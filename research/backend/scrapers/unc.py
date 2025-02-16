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

# Parse the HTML content
soup = BeautifulSoup(response.text, 'html.parser')

# List to store professor details
professors = []

# Scrape each card for details
for card in soup.find_all("div", class_="col-sm-12 col-md-8"):
    # Extract professor name
    name_tag = card.find("a")
    name = name_tag.text.strip() if name_tag else "N/A"

    # Extract title/position
    title_tag = card.find("h3")
    title = title_tag.text.strip() if title_tag else "N/A"

    # Extract email
    email_tag = card.find("a", href=lambda href: href and "mailto:" in href)
    email = email_tag.text.strip() if email_tag else "N/A"

    # Extract research interests
    research_areas_element = card.find("div", class_="details")
    research_areas = research_areas_element.text.strip() if research_areas_element else "N/A"

    # Extract profile image URL
    img_tag = card.find("img")
    profile_image_url = img_tag["src"] if img_tag else "N/A"

    # Store the professor's details
    professors.append({
        "name": name,
        "title": title,
        "email": email,
        "research_areas": research_areas,
        "image": profile_image_url
    })

# Insert data into the MySQL database
insert_query = """
    INSERT INTO professors (name, title, email, research_areas, image, website)
    VALUES (%s, %s, %s, %s, %s, %s)
"""

for prof in professors:
    # Check if the website link is available and insert "N/A" if not
    website = prof.get('website', 'N/A')

    # Execute the insertion query
    cursor.execute(insert_query, (prof['name'], prof['title'], prof['email'], prof['research_areas'], prof['image'], website))

# Commit the changes to the database
db_connection.commit()

# Close the cursor and database connection
cursor.close()
db_connection.close()

print("UNC has been successfully inserted into the database.")