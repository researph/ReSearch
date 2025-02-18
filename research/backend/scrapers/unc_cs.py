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
url = 'https://cs.unc.edu/about/people/?wpv-designation=faculty'
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

# List to store professor links
professor_links = []

# Scrape main page for each professor's page
for link_tag in soup.find_all('a', href=True):
    # Check if the link points to an individual professor's page
    href = link_tag['href']
    if 'https://cs.unc.edu/person/' in href: # Professor links should have "https://cs.unc.edu/person/"
        professor_links.append(href)

# List to store professor details
professors = []

# Scrape each professor's page for details
for professor_link in professor_links:
    # Send request to the professor's individual page
    response = requests.get(professor_link)
    soup = BeautifulSoup(response.text, 'html.parser')

    # Extract department
    department_keywords = ["School of", "Department of", "Departments of"]
    department_tag = next(
    (
        h2 for h2 in soup.find_all('h2') 
        if any(phrase in h2.text for phrase in department_keywords)
    ), 
    None
    )
    if department_tag:
        department_text = department_tag.text.strip()
        # Extract the department name after the phrase
        for phrase in department_keywords:
            if phrase in department_text:
                department = department_text.split(phrase, 1)[1].strip()
    else:
        department = 'Computer Science'

    # Extract name
    name_tag = soup.find('h1', class_='entry-title')
    name = name_tag.text.strip() if name_tag else 'N/A'

    # Extract title
    title_tag = next((h2 for h2 in soup.find_all('h2') if "Professor" in h2.text), None)
    title = title_tag.text.strip() if title_tag else 'N/A'

    # Extract email
    email_tag = soup.find('a', href=lambda href: href and "mailto:" in href)
    email = email_tag.text.strip() if email_tag else 'N/A'

    # Extract research areas
    research_tag = soup.find('p')
    if research_tag and research_tag.text.strip():
        research_text = research_tag.text.strip()
        if research_text[-1] == '.':
            research_text = research_text[:-1]
        # Extract the research areas after the degree information
        research_areas = research_text.split('.')[-1].strip()
    else:
        research_areas = 'N/A'

    # Extract image
    image_tag = soup.find('img', class_='wp-post-image')
    image = image_tag['src'] if image_tag else 'N/A'

    # Extract website
    website_tag = email_tag.find_next_sibling('a', href=True)
    website = website_tag['href'] if website_tag else 'N/A'

    # Store the professor's details
    professors.append({
        "department": department,
        "name": name,
        "title": title,
        "email": email,
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
        'UNC',
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

print("UNC (CS) has been successfully inserted into the database.")