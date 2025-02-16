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

# Send a GET request to fetch the webpage content
url = 'https://cs.duke.edu/people/appointed-faculty/primary-faculty'
response = requests.get(url)
soup = BeautifulSoup(response.text, "html.parser")

# List to store professor links
professor_links = []

for professor_item in soup.find_all('li', class_='grid list-group-item'):
    profile_link_tag = professor_item.find('a', href=True)
    if profile_link_tag:
        profile_link = profile_link_tag['href']
        professor_links.append(profile_link)
    
# List to store professor details
professors = []

# Scrape each professor's page for details
for professor_url in professor_links:
    # Send request to the professor's individual page
    response = requests.get(professor_url)
    soup = BeautifulSoup(response.text, 'html.parser')

    # Extract name
    name_tag = soup.find('span', class_='pr-3')
    name = name_tag.text.strip() if name_tag else 'N/A'

    # Extract title
    title_tag = soup.find('div', class_='sub-h1')
    title = title_tag.text.strip() if title_tag else 'N/A'

    # Extract email
    email_tag = soup.find('a', href=lambda href: href and "mailto:" in href)
    email = email_tag.text.strip() if email_tag else 'N/A'

    # Extract department
    department_tag = soup.find('a', class_='primary-org')
    department = department_tag.text.strip() if department_tag else 'N/A'

    # Extract research areas
    research_tag = soup.find('div', class_='excerpt')
    research_areas = research_tag.text.strip() if research_tag else 'N/A'

    # Extract image
    image_tag = soup.find('div', class_='profile-img-box').find('img')
    image = image_tag['src'] if image_tag else 'N/A'

    # Extract website
    website_tag = soup.find('h2', string="External Links")
    website = website_tag.find_next('a', href=True)['href'] if website_tag and website_tag.find_next('a', href=True) else 'N/A'

    # Store the professor's details
    professors.append({
        "name": name,
        "title": title,
        "email": email,
        "department": department,
        "research_areas": research_areas,
        "image": image,
        "website": website
    })

# Insert the scraped data into the MySQL database
insert_query = """
    INSERT INTO professors (school, department, name, title, email, research_areas, image, website)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
"""

for professor in professors:
    # Execute the insertion query
    cursor.execute(insert_query, (
        'Duke',
        professor['department'],
        professor['name'],
        professor['title'],
        professor['email'],
        professor['research_areas'],
        professor['image'],
        professor['website']
    ))

# Commit the changes to the database
db_connection.commit()

# Close the cursor and database connection
cursor.close()
db_connection.close()

print("Duke has been successfully inserted into the database.")