from typing import List, Dict, Tuple
from dataclasses import dataclass

@dataclass
class QuotationData:
    """Data class for quotation information"""
    id: int
    bank_id: int
    bank_name: str
    offered_amount: float
    interest_rate: float
    conditions: str = ""

@dataclass
class OptimizationResult:
    """Result of loan optimization"""
    selected_quotations: List[QuotationData]
    total_amount: float
    weighted_avg_rate: float
    number_of_banks: int
    optimization_score: float
    is_feasible: bool

class LoanOptimizer:
    """Optimize syndicate composition to minimize interest rate while meeting loan requirements"""

    def optimize(
        self,
        quotations: List[QuotationData],
        target_amount: float,
        max_interest_rate: float = None,
        min_banks: int = 1,
        max_banks: int = 10
    ) -> OptimizationResult:
        """
        Find optimal combination of banks for syndicated loan

        Args:
            quotations: List of bank quotations
            target_amount: Required loan amount
            max_interest_rate: Maximum acceptable weighted average rate
            min_banks: Minimum number of banks in syndicate
            max_banks: Maximum number of banks in syndicate

        Returns:
            OptimizationResult with selected banks
        """
        if not quotations:
            return self._empty_result()

        # Filter out invalid quotations
        valid_quotations = [
            q for q in quotations
            if q.offered_amount and q.offered_amount > 0
            and q.interest_rate and q.interest_rate > 0
        ]

        if not valid_quotations:
            return self._empty_result()

        # Try greedy algorithm first (best rate first)
        greedy_result = self._greedy_optimization(
            valid_quotations, target_amount, max_interest_rate, min_banks, max_banks
        )

        # Try alternative: largest amounts first (reduce number of banks)
        large_first_result = self._large_amounts_first(
            valid_quotations, target_amount, max_interest_rate, min_banks, max_banks
        )

        # Return better result
        if large_first_result.is_feasible and (
            not greedy_result.is_feasible or
            large_first_result.weighted_avg_rate < greedy_result.weighted_avg_rate
        ):
            return large_first_result

        return greedy_result

    def _greedy_optimization(
        self,
        quotations: List[QuotationData],
        target_amount: float,
        max_rate: float,
        min_banks: int,
        max_banks: int
    ) -> OptimizationResult:
        """Greedy algorithm: select lowest rates first"""
        # Sort by interest rate (ascending)
        sorted_quotes = sorted(quotations, key=lambda x: x.interest_rate)

        selected = []
        total_amount = 0.0

        for quote in sorted_quotes:
            if len(selected) >= max_banks:
                break

            # Calculate how much we still need
            remaining_needed = target_amount - total_amount

            if remaining_needed <= 0:
                break

            # Take up to what this bank offers, but only what we need
            amount_to_take = min(quote.offered_amount, remaining_needed)

            selected.append((quote, amount_to_take))
            total_amount += amount_to_take

        # Check if solution is valid
        is_feasible = (
            total_amount >= target_amount * 0.99 and  # Allow 1% tolerance
            len(selected) >= min_banks and
            len(selected) <= max_banks
        )

        if not is_feasible:
            return self._empty_result()

        # Calculate weighted average interest rate
        weighted_rate = sum(q.interest_rate * amt for q, amt in selected) / total_amount

        # Check rate constraint
        if max_rate and weighted_rate > max_rate:
            is_feasible = False

        # Calculate optimization score (lower is better)
        # Score = weighted_rate + penalty for using more banks
        bank_penalty = len(selected) * 0.01  # 1 basis point per bank
        optimization_score = weighted_rate + bank_penalty

        # Create result quotations with allocated amounts
        result_quotations = [
            QuotationData(
                id=q.id,
                bank_id=q.bank_id,
                bank_name=q.bank_name,
                offered_amount=amt,  # Use allocated amount
                interest_rate=q.interest_rate,
                conditions=q.conditions
            )
            for q, amt in selected
        ]

        return OptimizationResult(
            selected_quotations=result_quotations,
            total_amount=total_amount,
            weighted_avg_rate=weighted_rate,
            number_of_banks=len(selected),
            optimization_score=optimization_score,
            is_feasible=is_feasible
        )

    def _large_amounts_first(
        self,
        quotations: List[QuotationData],
        target_amount: float,
        max_rate: float,
        min_banks: int,
        max_banks: int
    ) -> OptimizationResult:
        """Alternative strategy: select largest amounts first to minimize bank count"""
        # Sort by offered amount (descending)
        sorted_quotes = sorted(quotations, key=lambda x: x.offered_amount, reverse=True)

        selected = []
        total_amount = 0.0

        for quote in sorted_quotes:
            if len(selected) >= max_banks:
                break

            remaining_needed = target_amount - total_amount
            if remaining_needed <= 0:
                break

            amount_to_take = min(quote.offered_amount, remaining_needed)
            selected.append((quote, amount_to_take))
            total_amount += amount_to_take

        is_feasible = (
            total_amount >= target_amount * 0.99 and
            len(selected) >= min_banks and
            len(selected) <= max_banks
        )

        if not is_feasible:
            return self._empty_result()

        weighted_rate = sum(q.interest_rate * amt for q, amt in selected) / total_amount

        if max_rate and weighted_rate > max_rate:
            is_feasible = False

        bank_penalty = len(selected) * 0.01
        optimization_score = weighted_rate + bank_penalty

        result_quotations = [
            QuotationData(
                id=q.id,
                bank_id=q.bank_id,
                bank_name=q.bank_name,
                offered_amount=amt,
                interest_rate=q.interest_rate,
                conditions=q.conditions
            )
            for q, amt in selected
        ]

        return OptimizationResult(
            selected_quotations=result_quotations,
            total_amount=total_amount,
            weighted_avg_rate=weighted_rate,
            number_of_banks=len(selected),
            optimization_score=optimization_score,
            is_feasible=is_feasible
        )

    def _empty_result(self) -> OptimizationResult:
        """Return empty/infeasible result"""
        return OptimizationResult(
            selected_quotations=[],
            total_amount=0.0,
            weighted_avg_rate=0.0,
            number_of_banks=0,
            optimization_score=float('inf'),
            is_feasible=False
        )
