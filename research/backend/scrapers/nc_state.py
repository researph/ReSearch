import requests
from bs4 import BeautifulSoup
import mysql.connector
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Database connection setup
db_connection = mysql.connector.connect(
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME")
)
cursor = db_connection.cursor()

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

# Step 4: Insert the scraped data into the MySQL database
insert_query = """
    INSERT INTO professors (name, title, email, research_interests, image, website)
    VALUES (%s, %s, %s, %s, %s, %s)
"""

for professor in professors_data:
    # Get the research areas as a string (comma-separated)
    research_interests = ', '.join(professor.get('Research Areas', [])) if 'Research Areas' in professor else 'N/A'

    # Check if the website link is available and insert "N/A" if not
    website = professor.get('Website', 'N/A')

    # Execute the insertion query
    cursor.execute(insert_query, (
        professor['Name'],  # name
        professor.get('Title', 'N/A'),  # title (you might want to extract it from another field)
        professor['Email'],  # email
        research_interests,  # research interests
        professor['Photo'],  # image
        website  # website
    ))

# Commit the changes to the database
db_connection.commit()

# Close the cursor and database connection
cursor.close()
db_connection.close()

print("Data has been successfully inserted into the database.")