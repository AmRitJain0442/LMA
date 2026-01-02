import requests
from bs4 import BeautifulSoup
import os
import time
from urllib.parse import urljoin, urlparse
import json
import sys

# Fix encoding for Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

class LMAScraper:
    def __init__(self, base_url, download_folder):
        self.base_url = base_url
        self.download_folder = download_folder
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        })

        # Create download folder if it doesn't exist
        os.makedirs(download_folder, exist_ok=True)

    def fetch_page(self):
        """Fetch the main documents page"""
        try:
            print(f"Fetching page: {self.base_url}")
            response = self.session.get(self.base_url, timeout=30)
            response.raise_for_status()
            return response.text
        except requests.RequestException as e:
            print(f"Error fetching page: {e}")
            return None

    def parse_documents(self, html_content):
        """Parse document links from the HTML"""
        soup = BeautifulSoup(html_content, 'html.parser')
        documents = []

        # Find all document links - looking for common patterns
        # PDF and DOC/DOCX files
        for link in soup.find_all('a', href=True):
            href = link['href']

            # Check if it's a document link
            if any(ext in href.lower() for ext in ['.pdf', '.doc', '.docx', '.zip']):
                full_url = urljoin(self.base_url, href)
                filename = os.path.basename(urlparse(full_url).path)

                documents.append({
                    'url': full_url,
                    'filename': filename,
                    'text': link.get_text(strip=True)
                })

        # Also look for data attributes or JavaScript-loaded content
        # The page might use AJAX to load documents
        scripts = soup.find_all('script')
        for script in scripts:
            if script.string and ('document' in script.string.lower() or 'download' in script.string.lower()):
                # Could contain URLs in JSON format
                try:
                    # Look for URLs in the script content
                    import re
                    urls = re.findall(r'https?://[^\s<>"{}|\\^`\[\]]+\.(?:pdf|docx?|zip)', script.string)
                    for url in urls:
                        filename = os.path.basename(urlparse(url).path)
                        documents.append({
                            'url': url,
                            'filename': filename,
                            'text': 'Found in script'
                        })
                except:
                    pass

        return documents

    def download_document(self, url, filename):
        """Download a single document"""
        filepath = os.path.join(self.download_folder, filename)

        # Skip if already downloaded
        if os.path.exists(filepath):
            print(f"  ✓ Already exists: {filename}")
            return True

        try:
            print(f"  Downloading: {filename}")
            response = self.session.get(url, timeout=60, stream=True)
            response.raise_for_status()

            # Check if we got HTML instead of a document (access denied page)
            content_type = response.headers.get('Content-Type', '')
            if 'text/html' in content_type and not filename.endswith('.html'):
                print(f"  ✗ Access denied or redirect (got HTML): {filename}")
                return False

            # Save the file
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)

            print(f"  ✓ Downloaded: {filename}")
            return True

        except requests.RequestException as e:
            print(f"  ✗ Error downloading {filename}: {e}")
            return False

    def scrape(self):
        """Main scraping function"""
        print("=" * 60)
        print("LMA Document Scraper")
        print("=" * 60)
        print()

        # Fetch the page
        html_content = self.fetch_page()
        if not html_content:
            print("Failed to fetch the page. Exiting.")
            return

        # Parse documents
        print("Parsing document links...")
        documents = self.parse_documents(html_content)

        # Remove duplicates
        unique_docs = {}
        for doc in documents:
            if doc['url'] not in unique_docs:
                unique_docs[doc['url']] = doc

        documents = list(unique_docs.values())

        print(f"Found {len(documents)} unique document(s)\n")

        if not documents:
            print("⚠ No documents found!")
            print("Note: The LMA website requires member authentication.")
            print("Documents may be dynamically loaded or access-restricted.")
            return

        # Save document list
        list_file = os.path.join(self.download_folder, '_document_list.json')
        with open(list_file, 'w', encoding='utf-8') as f:
            json.dump(documents, f, indent=2)
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

            # Be polite - add delay between downloads
            if i < len(documents):
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
    # Configuration
    BASE_URL = "https://www.lma.eu.com/documents-guidelines/documents"
    DOWNLOAD_FOLDER = "./documents"

    # Run scraper
    scraper = LMAScraper(BASE_URL, DOWNLOAD_FOLDER)
    scraper.scrape()

    print("\n⚠ IMPORTANT NOTE:")
    print("Most LMA documents require member authentication.")
    print("If downloads failed, you may need to:")
    print("  1. Log in to the LMA website first")
    print("  2. Export your browser cookies")
    print("  3. Modify this script to use your authenticated session")
    print()
