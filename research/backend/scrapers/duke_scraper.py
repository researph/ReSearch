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

# URL of the Duke CS faculty page
URL = "https://cs.duke.edu/people/appointed-faculty/primary-faculty"  # Replace with the actual faculty page URL

# Send a GET request to fetch the webpage content
response = requests.get(URL, headers={
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
})

# Check if the request was successful
if response.status_code != 200:
    print(f"❌ Failed to retrieve the page, status code: {response.status_code}")
else:
    soup = BeautifulSoup(response.text, "html.parser")

    # List to store professor details
    professors = []

    # Loop through each professor item in the list
    for li in soup.find_all("li", class_="grid list-group-item"):
        professor = {}

        # Extract professor name
        name_tag = li.find("div", class_="h4").find("a") if li.find("div", class_="h4") else None
        professor['name'] = name_tag.text.strip() if name_tag else "N/A"

        # Extract professor title
        title_tag = li.find("div", class_="h6")
        professor['title'] = title_tag.text.strip() if title_tag else "N/A"

        # Extract professor email
        email_tag = li.find("a", href=lambda href: href and "mailto:" in href)
        professor['email'] = email_tag.text.strip() if email_tag else "N/A"

        # Extract professor image URL
        img_tag = li.find("img")
        professor['image_url'] = img_tag["src"] if img_tag else "N/A"

        # Extract website link, safely handle None
        website_tag = li.find("div", class_="views-field-field-websites")
        if website_tag:
            website_link = website_tag.find("a")
            professor['website'] = website_link['href'] if website_link else "N/A"
        else:
            professor['website'] = "N/A"

        # Add the professor's details to the list
        professors.append(professor)

    # Insert data into the MySQL database
    insert_query = """
        INSERT INTO professors (name, title, email, research_interests, image, website)
        VALUES (%s, %s, %s, %s, %s, %s)
    """

    for prof in professors:
        # Assuming research_interests is not available on this page, so inserting "N/A"
        cursor.execute(insert_query, (prof['name'], prof['title'], prof['email'], "N/A", prof['image_url'], prof['website']))

    # Commit the changes to the database
    db_connection.commit()

    # Close the cursor and database connection
    cursor.close()
    db_connection.close()

    print("Data has been successfully inserted into the database.")