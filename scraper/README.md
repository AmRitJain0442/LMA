# LMA Document Scraper

This scraper downloads documents from https://www.lma.eu.com/documents-guidelines/documents

## Important Notice

**The LMA website requires member authentication** to access most documents. This scraper provides multiple approaches:

1. **Basic scraper** (`lma_scraper.py`) - Attempts to download publicly accessible documents
2. **Selenium scraper** (`lma_scraper_selenium.py`) - Uses browser automation to handle JavaScript
3. **Authenticated scraper** (`lma_scraper_auth.py`) - Allows you to use your login credentials

## Quick Start

### Option 1: Try Public Access (Limited)

```bash
python lma_scraper_selenium.py
```

This will attempt to download any publicly accessible documents.

### Option 2: With Authentication (Recommended)

If you have LMA member credentials:

```bash
python lma_scraper_auth.py
```

This will open a browser window where you can:
1. Log in manually
2. The scraper will then download all accessible documents

## Installation

```bash
pip install -r requirements.txt
```

## Folder Structure

```
scraper/
├── documents/          # Downloaded documents will be saved here
├── lma_scraper.py      # Basic scraper
├── lma_scraper_selenium.py  # Selenium-based scraper
├── lma_scraper_auth.py      # Authenticated scraper
├── requirements.txt
└── README.md
```

## Authentication

The LMA website requires one of the following:
- LMA Member login
- Academic institution access
- Payment for historic documents (£250 per document)

Contact: lmadocs@lma.eu.com

## Troubleshooting

### No documents found
- The website requires authentication
- Try using `lma_scraper_auth.py` with your credentials

### Browser driver errors
- Make sure Chrome or Firefox is installed
- The script will auto-download the appropriate driver

### Access denied
- You need valid LMA member credentials
- Contact LMA for membership: https://www.lma.eu.com/about-us/contact-us
