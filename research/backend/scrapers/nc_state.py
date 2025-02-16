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
url = 'https://www.csc.ncsu.edu/directories/professors.php'
response = requests.get(url)

# Parse the HTML content
soup = BeautifulSoup(response.text, 'html.parser')

# List to store professor links
professor_links = []

# Scrape main page for each professor's page
for link in soup.find_all('a', href=True):
    # Check if the link points to an individual professor's page
    href = link['href']
    if '/people/' in href: # Professor links should have "/people/"
        full_url = 'https://www.csc.ncsu.edu' + href if not href.startswith('http') else href
        professor_links.append(full_url)

# List to store professor details
professors = []

# Scrape each professor's page for details
for professor_url in professor_links:
    # Send request to the professor's individual page
    response = requests.get(professor_url)
    soup = BeautifulSoup(response.text, 'html.parser')

    # Extract professor name without trailing comma
    name_tag = soup.find('span', class_='prof_name')
    name = name_tag.text.strip()[:-1] if name_tag else 'N/A'


    # Extract title without trailing spaces and department
    title_tag = soup.find('span', class_='position')
    title = title_tag.text.strip().split("  ")[0] if title_tag else 'N/A'

    # Extract email
    email_tag = soup.find("a", href=lambda href: href and "mailto:" in href)
    email = email_tag.text.strip() if email_tag else 'N/A'

    # Extract research areas
    research_tag = soup.find('h2', string='Research Areas')
    if research_tag and research_tag.find_next('ul'):
        research_list = [li.text.strip() for li in research_tag.find_next('ul').find_all('li')]
        # Combine the research areas into a comma-separated string
        research_areas = ', '.join(research_list)
    else:
        research_areas = 'N/A'

    # Extract profile image URL
    image_tag = soup.find('img', class_='profilepic')
    image = 'https://www.csc.ncsu.edu' + image_tag['src'] if image_tag else 'N/A'

    # Extract professor's website
    website_tag = soup.find('a', href=True, string='Web Site')
    website = website_tag['href'] if website_tag else 'N/A'

    # Store the professor's details
    professors.append({
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
        'NC State',
        'Computer Science',
        professor['name'], # name
        professor['title'], # title
        professor['email'], # email
        professor['research_areas'], # research areas
        professor['image'], # image
        professor['website'] # website
    ))

# Commit the changes to the database
db_connection.commit()

# Close the cursor and database connection
cursor.close()
db_connection.close()

print("NC State has been successfully inserted into the database.")