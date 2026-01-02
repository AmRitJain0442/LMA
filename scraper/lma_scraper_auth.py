"""
LMA Authenticated Document Scraper

This script allows you to log in to the LMA website manually, then automatically
downloads all available documents.
"""

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import requests
import os
import time
import json
from urllib.parse import urljoin, urlparse, parse_qs
from bs4 import BeautifulSoup
import sys

# Fix encoding for Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')


class LMAAuthScraper:
    def __init__(self, base_url, download_folder):
        self.base_url = base_url
        self.download_folder = download_folder
        self.driver = None
        self.cookies = None

        os.makedirs(download_folder, exist_ok=True)

    def setup_driver(self, headless=False):
        """Setup Selenium WebDriver"""
        chrome_options = Options()
        if headless:
            chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--window-size=1920,1080')

        # Enable downloads
        prefs = {
            "download.default_directory": os.path.abspath(self.download_folder),
            "download.prompt_for_download": False,
            "download.directory_upgrade": True,
            "safebrowsing.enabled": True
        }
        chrome_options.add_experimental_option("prefs", prefs)

        try:
            service = Service(ChromeDriverManager().install())
            self.driver = webdriver.Chrome(service=service, options=chrome_options)
            return True
        except Exception as e:
            print(f"Error setting up Chrome driver: {e}")
            return False

    def manual_login(self):
        """Allow user to log in manually"""
        print("\n" + "="*60)
        print("MANUAL LOGIN REQUIRED")
        print("="*60)
        print("\nA browser window will open. Please:")
        print("1. Log in to your LMA account")
        print("2. Navigate to the documents page")
        print("3. Wait for the documents to load")
        print("4. Come back to this terminal and press ENTER")
        print("\nOpening browser...")

        self.driver.get(self.base_url)

        input("\nPress ENTER after you have logged in and the documents page is loaded...")

        # Save cookies for later use
        self.cookies = self.driver.get_cookies()
        print(f"Session saved! ({len(self.cookies)} cookies)")

    def extract_document_links(self):
        """Extract all document download links from the page"""
        print("\nExtracting document links...")

        # Scroll to load all content
        print("Scrolling to load all content...")
        last_height = self.driver.execute_script("return document.body.scrollHeight")
        while True:
            self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(2)
            new_height = self.driver.execute_script("return document.body.scrollHeight")
            if new_height == last_height:
                break
            last_height = new_height

        # Get page source
        html_content = self.driver.page_source
        soup = BeautifulSoup(html_content, 'html.parser')

        documents = []

        # Find all download links
        # Look for common patterns
        for link in soup.find_all('a', href=True):
            href = link['href']

            # Document file extensions
            if any(ext in href.lower() for ext in ['.pdf', '.doc', '.docx', '.zip', '.xlsx', '.xls']):
                full_url = urljoin(self.base_url, href)
                filename = os.path.basename(urlparse(full_url).path)

                # Try to get a better filename from link text
                link_text = link.get_text(strip=True)
                if link_text and len(link_text) < 100:
                    # Clean filename
                    safe_text = "".join(c for c in link_text if c.isalnum() or c in (' ', '-', '_'))
                    if safe_text:
                        ext = os.path.splitext(filename)[1]
                        filename = f"{safe_text[:50]}{ext}"

                documents.append({
                    'url': full_url,
                    'filename': filename,
                    'text': link_text[:100]
                })

        # Also try to find download buttons or data attributes
        for elem in soup.find_all(attrs={'data-download': True}):
            url = elem.get('data-download')
            if url:
                documents.append({
                    'url': urljoin(self.base_url, url),
                    'filename': os.path.basename(urlparse(url).path),
                    'text': elem.get_text(strip=True)[:100]
                })

        # Try JavaScript-loaded content
        # Execute JavaScript to find document objects
        try:
            doc_elements = self.driver.find_elements(By.CSS_SELECTOR, '[data-document-id], [data-file-url], .document-link, .download-link')
            for elem in doc_elements:
                try:
                    url = elem.get_attribute('href') or elem.get_attribute('data-file-url') or elem.get_attribute('data-url')
                    if url and any(ext in url.lower() for ext in ['.pdf', '.doc', '.docx']):
                        documents.append({
                            'url': url if url.startswith('http') else urljoin(self.base_url, url),
                            'filename': os.path.basename(urlparse(url).path),
                            'text': elem.text[:100]
                        })
                except:
                    continue
        except Exception as e:
            print(f"Could not extract JavaScript elements: {e}")

        return documents

    def download_document(self, url, filename):
        """Download a single document using authenticated session"""
        filepath = os.path.join(self.download_folder, filename)

        if os.path.exists(filepath):
            print(f"  [OK] Already exists: {filename}")
            return True

        try:
            print(f"  Downloading: {filename}")

            # Use selenium to download by navigating to URL
            # This preserves authentication
            self.driver.get(url)
            time.sleep(2)

            # Check if download started or if we got an error page
            current_url = self.driver.current_url
            page_source = self.driver.page_source.lower()

            if 'error' in page_source or 'access denied' in page_source or 'not found' in page_source:
                print(f"  [FAIL] Access denied or not found: {filename}")
                return False

            print(f"  [OK] Download initiated: {filename}")
            return True

        except Exception as e:
            print(f"  [FAIL] Error: {filename}: {e}")
            return False

    def download_with_requests(self, url, filename):
        """Alternative: Download using requests with cookies"""
        filepath = os.path.join(self.download_folder, filename)

        if os.path.exists(filepath):
            print(f"  [OK] Already exists: {filename}")
            return True

        try:
            print(f"  Downloading: {filename}")

            # Create session with cookies
            session = requests.Session()
            for cookie in self.cookies:
                session.cookies.set(cookie['name'], cookie['value'])

            response = session.get(url, timeout=60, stream=True)
            response.raise_for_status()

            # Check content type
            content_type = response.headers.get('Content-Type', '')
            if 'text/html' in content_type and not filename.endswith('.html'):
                print(f"  [FAIL] Access denied (got HTML): {filename}")
                return False

            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)

            file_size = os.path.getsize(filepath)
            print(f"  [OK] Downloaded: {filename} ({file_size:,} bytes)")
            return True

        except Exception as e:
            print(f"  [FAIL] Error: {filename}: {e}")
            return False

    def scrape(self):
        """Main scraping function"""
        print("="*60)
        print("LMA Authenticated Document Scraper")
        print("="*60)

        # Setup driver
        if not self.setup_driver(headless=False):
            print("Failed to setup browser driver")
            return

        try:
            # Manual login
            self.manual_login()

            # Extract document links
            documents = self.extract_document_links()

            # Remove duplicates
            unique_docs = {}
            for doc in documents:
                url = doc['url']
                if url not in unique_docs:
                    unique_docs[url] = doc

            documents = list(unique_docs.values())

            print(f"\nFound {len(documents)} unique document(s)\n")

            if not documents:
                print("[WARNING] No documents found!")
                print("The page may require additional interaction or different selectors.")

                # Save HTML for debugging
                debug_file = os.path.join(self.download_folder, '_debug_authenticated.html')
                with open(debug_file, 'w', encoding='utf-8') as f:
                    f.write(self.driver.page_source)
                print(f"Saved page HTML to {debug_file} for debugging")

                input("\nPress ENTER to close...")
                return

            # Save document list
            list_file = os.path.join(self.download_folder, '_document_list.json')
            with open(list_file, 'w', encoding='utf-8') as f:
                json.dump(documents, f, indent=2, ensure_ascii=False)
            print(f"Saved document list to: {list_file}\n")

            # Download documents
            print("Starting downloads...")
            print("-"*60)

            success_count = 0
            failed_count = 0

            for i, doc in enumerate(documents, 1):
                print(f"\n[{i}/{len(documents)}] {doc.get('text', 'Unknown')}")

                # Try requests method first (faster)
                if self.download_with_requests(doc['url'], doc['filename']):
                    success_count += 1
                else:
                    failed_count += 1

                time.sleep(1)

            # Summary
            print("\n" + "="*60)
            print("Download Summary")
            print("="*60)
            print(f"Total documents found: {len(documents)}")
            print(f"Successfully downloaded: {success_count}")
            print(f"Failed/Skipped: {failed_count}")
            print(f"Download folder: {os.path.abspath(self.download_folder)}")
            print()

        finally:
            input("\nPress ENTER to close the browser and exit...")
            if self.driver:
                self.driver.quit()


if __name__ == "__main__":
    BASE_URL = "https://www.lma.eu.com/documents-guidelines/documents"
    DOWNLOAD_FOLDER = "./documents"

    scraper = LMAAuthScraper(BASE_URL, DOWNLOAD_FOLDER)
    scraper.scrape()
