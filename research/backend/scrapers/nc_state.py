import requests
from bs4 import BeautifulSoup

# Step 1: Send a request to the main page containing the list of professors
url = 'https://www.csc.ncsu.edu/directories/professors.php'
response = requests.get(url)

# Parse the HTML content
soup = BeautifulSoup(response.text, 'html.parser')

# Step 2: Find all professor links on the main page
professor_links = []
for link in soup.find_all('a', href=True):
    # Check if the link points to an individual professor's page
    href = link['href']
    if '/people/' in href:  # Professor links should have "/people/"
        full_url = 'https://www.csc.ncsu.edu' + href if not href.startswith('http') else href
        professor_links.append(full_url)

# Step 3: Scrape each professor's page for details
professors_data = []
for professor_url in professor_links:
    professor_info = {}

    # Send request to the professor's individual page
    response = requests.get(professor_url)
    soup = BeautifulSoup(response.text, 'html.parser')

    # Get professor's name
    name_tag = soup.find('span', class_='prof_name')
    if name_tag:
        professor_info['Name'] = name_tag.get_text(strip=True)

    # Get professor's photo (image tag with class 'profilepic')
    img_tag = soup.find('img', class_='profilepic')
    if img_tag:
        professor_info['Photo'] = 'https://www.csc.ncsu.edu' + img_tag['src']  # Get the full image URL

    # Get professor's email (found in the mailto link)
    email_tag = soup.find('a', href=True, string=lambda text: '@' in text)
    if email_tag:
        professor_info['Email'] = email_tag.get_text(strip=True)

    # Get professor's website (link to website)
    website_tag = soup.find('a', href=True, string='Web Site')
    if website_tag:
        professor_info['Website'] = website_tag['href']

    # Get research areas (list of topics in the "Research Areas" section)
    research_tag = soup.find('h2', string='Research Areas')
    if research_tag:
        research_areas = research_tag.find_next('ul')
        if research_areas:
            professor_info['Research Areas'] = [li.get_text(strip=True) for li in research_areas.find_all('li')]

    # Add the professor info to the list
    professors_data.append(professor_info)

# Output or store the data
for professor in professors_data:
    print(professor)
