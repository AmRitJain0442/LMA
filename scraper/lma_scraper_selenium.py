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
from urllib.parse import urljoin, urlparse
import sys

# Fix encoding for Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')


class LMASeleniumScraper:
    def __init__(self, base_url, download_folder):
        self.base_url = base_url
        self.download_folder = download_folder
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })

        os.makedirs(download_folder, exist_ok=True)

    def setup_driver(self):
        """Setup Selenium WebDriver"""
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--window-size=1920,1080')

        try:
            service = Service(ChromeDriverManager().install())
            driver = webdriver.Chrome(service=service, options=chrome_options)
            return driver
        except Exception as e:
            print(f"Error setting up Chrome driver: {e}")
            print("Trying with Firefox...")
            try:
                from selenium.webdriver.firefox.service import Service as FirefoxService
                from webdriver_manager.firefox import GeckoDriverManager
                driver = webdriver.Firefox(service=FirefoxService(GeckoDriverManager().install()))
                return driver
            except Exception as e2:
                print(f"Error setting up Firefox driver: {e2}")
                return None

    def fetch_page_with_selenium(self):
        """Fetch page content using Selenium to handle JavaScript"""
        print(f"Loading page with Selenium: {self.base_url}")

        driver = self.setup_driver()
        if not driver:
            print("Failed to setup WebDriver")
            return None

        try:
            driver.get(self.base_url)

            # Wait for content to load
            print("Waiting for page to load...")
            time.sleep(5)

            # Try to wait for document elements
            try:
                WebDriverWait(driver, 20).until(
                    EC.presence_of_element_located((By.TAG_NAME, "a"))
                )
            except:
                print("Timeout waiting for elements, continuing anyway...")

            # Scroll to load any lazy-loaded content
            print("Scrolling to load content...")
            last_height = driver.execute_script("return document.body.scrollHeight")
            for _ in range(5):
                driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(2)
                new_height = driver.execute_script("return document.body.scrollHeight")
                if new_height == last_height:
                    break
                last_height = new_height

            html_content = driver.page_source
            driver.quit()
            return html_content

        except Exception as e:
            print(f"Error fetching page: {e}")
            if driver:
                driver.quit()
            return None

    def parse_documents(self, html_content):
        """Parse document links from HTML"""
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(html_content, 'html.parser')
        documents = []

        print("Searching for document links...")

        # Find all links
        all_links = soup.find_all('a', href=True)
        print(f"Found {len(all_links)} total links")

        # Look for document links
        for link in all_links:
            href = link['href']

            # Check for document extensions
            if any(ext in href.lower() for ext in ['.pdf', '.doc', '.docx', '.zip', '.xlsx', '.xls']):
                full_url = urljoin(self.base_url, href)
                filename = os.path.basename(urlparse(full_url).path)

                # Clean filename
                if not filename:
                    filename = f"document_{len(documents)}.pdf"

                documents.append({
                    'url': full_url,
                    'filename': filename,
                    'text': link.get_text(strip=True)[:100]
                })

        # Also look for data-download or data-url attributes
        for elem in soup.find_all(attrs={'data-download': True}):
            url = elem.get('data-download')
            if url:
                documents.append({
                    'url': urljoin(self.base_url, url),
                    'filename': os.path.basename(urlparse(url).path),
                    'text': elem.get_text(strip=True)[:100]
                })

        for elem in soup.find_all(attrs={'data-url': True}):
            url = elem.get('data-url')
            if url and any(ext in url.lower() for ext in ['.pdf', '.doc', '.docx']):
                documents.append({
                    'url': urljoin(self.base_url, url),
                    'filename': os.path.basename(urlparse(url).path),
                    'text': elem.get_text(strip=True)[:100]
                })

        return documents

    def download_document(self, url, filename):
        """Download a single document"""
        filepath = os.path.join(self.download_folder, filename)

        if os.path.exists(filepath):
            print(f"  [OK] Already exists: {filename}")
            return True

        try:
            print(f"  Downloading: {filename}")
            response = self.session.get(url, timeout=60, stream=True)
            response.raise_for_status()

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
        print("=" * 60)
        print("LMA Document Scraper (Selenium)")
        print("=" * 60)
        print()

        # Fetch page with Selenium
        html_content = self.fetch_page_with_selenium()
        if not html_content:
            print("Failed to fetch page content")
            return

        # Parse documents
        print("\nParsing document links...")
        documents = self.parse_documents(html_content)

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
            print("The LMA website likely requires member authentication.")

            # Save HTML for debugging
            debug_file = os.path.join(self.download_folder, '_debug_page.html')
            with open(debug_file, 'w', encoding='utf-8') as f:
                f.write(html_content)
            print(f"Saved page HTML to {debug_file} for debugging")
            return

        # Save document list
        list_file = os.path.join(self.download_folder, '_document_list.json')
        with open(list_file, 'w', encoding='utf-8') as f:
            json.dump(documents, f, indent=2, ensure_ascii=False)
        print(f"Saved document list to: {list_file}\n")

        # Download documents
        print("Starting downloads...")
        print("-" * 60)

        success_count = 0
        failed_count = 0

        for i, doc in enumerate(documents, 1):
            print(f"\n[{i}/{len(documents)}] {doc.get('text', 'Unknown')}")

            if self.download_document(doc['url'], doc['filename']):
                success_count += 1
            else:
                failed_count += 1

            time.sleep(1)

        # Summary
        print("\n" + "=" * 60)
        print("Download Summary")
        print("=" * 60)
        print(f"Total documents found: {len(documents)}")
        print(f"Successfully downloaded: {success_count}")
        print(f"Failed/Skipped: {failed_count}")
        print(f"Download folder: {os.path.abspath(self.download_folder)}")
        print()


if __name__ == "__main__":
    BASE_URL = "https://www.lma.eu.com/documents-guidelines/documents"
    DOWNLOAD_FOLDER = "./documents"

    scraper = LMASeleniumScraper(BASE_URL, DOWNLOAD_FOLDER)
    scraper.scrape()

    print("\n[NOTE] Most LMA documents require member authentication.")
    print("If downloads failed, you may need to log in to access documents.")
