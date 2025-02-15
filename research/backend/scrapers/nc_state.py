import requests
from bs4 import BeautifulSoup

# URL of the NC State CS faculty page
URL = "https://www.csc.ncsu.edu/directories/professors.php"  # Replace with the actual faculty page URL

# Send a GET request to fetch the webpage content
response = requests.get(URL, headers={
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
})

# Check if the request was successful
if response.status_code != 200:
    print(f"❌ Failed to retrieve the page, status code: {response.status_code}")
else:
    soup = BeautifulSoup(response.text, "html.parser")

# Step 2: Find all professor links on the main page
professor_links = []
for link in soup.find_all('a', href=True):
    # Check if the link points to an individual professor's page
    href = link['href']
    if '/people/' in href:  # Professor links should have "/people/"
        full_url = 'https://www.csc.ncsu.edu' + href if not href.startswith('http') else href
        professor_links.append(full_url)

# Step 3: Scrape each professor's page for details
professors = []
for professor_link in professor_links:
    professor = {}

    # Send request to the professor's individual page
    response = requests.get(professor_link)
    soup = BeautifulSoup(response.text, 'html.parser')

    # Get professor's name
    name_tag = soup.find('span', class_='prof_name')
    if name_tag:
        professor['name'] = name_tag.get_text(strip=True)

    # Get professor's title (found in the <span class="position"> tag)
    title_tag = soup.find('span', class_='position')
    if title_tag:
        professor['title'] = title_tag.get_text(strip=True)

    # Get professor's photo (image tag with class 'profilepic')
    img_tag = soup.find('img', class_='profilepic')
    if img_tag:
        professor['image'] = 'https://www.csc.ncsu.edu' + img_tag['src']  # Get the full image URL

    # Get professor's email (found in the mailto link)
    email_tag = soup.find('a', href=True, string=lambda text: '@' in text)
    if email_tag:
        professor['email'] = email_tag.get_text(strip=True)

    # Get professor's website (link to website)
    website_tag = soup.find('a', href=True, string='Web Site')
    if website_tag:
        professor['website'] = website_tag['href']

    # Get research areas (list of topics in the "Research Areas" section)
    research_tag = soup.find('h2', string='Research Areas')
    if research_tag:
        research_areas = research_tag.find_next('ul')
        if research_areas:
            professor['research areas'] = [li.get_text(strip=True) for li in research_areas.find_all('li')]

    professor('')

    # Add the professor info to the list
    professors.append(professor)

# Output or store the data
for professor in professors:
    print(professor)
