import aiohttp
import asyncio
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

# Base URL for UNC Biology Faculty
BASE_URL = "https://bio.unc.edu/people/faculty/"

async def fetch(session, url):
    """Asynchronously fetch URL content."""
    async with session.get(url) as response:
        return await response.text()

async def extract_faculty_links():
    """Extracts all faculty profile links asynchronously."""
    async with aiohttp.ClientSession() as session:
        html = await fetch(session, BASE_URL)
        soup = BeautifulSoup(html, 'lxml')

        faculty_links = {
            link['href']
            for link in soup.find_all('a', href=True)
            if "https://bio.unc.edu/faculty-profile/" in link['href']
        }
        
        return list(faculty_links)  # Remove duplicates

async def extract_faculty_details(session, faculty_link):
    """Fetch and extract faculty details asynchronously."""
    html = await fetch(session, faculty_link)
    soup = BeautifulSoup(html, 'lxml')

    # Extract name
    name_tag = soup.find('h1', class_='entry-title')
    name = name_tag.text.strip() if name_tag else 'N/A'

    # Extract title
    title_tag = soup.find('span', style="font-size: 1.8em")
    title = title_tag.text.strip() if title_tag else 'N/A'

    # Extract email
    email_tag = soup.find('a', href=lambda href: href and "mailto:" in href)
    email = email_tag.text.strip() if email_tag else 'N/A'

    # Extract profile image
    image_tag = soup.find('img', class_='people-image')
    image = image_tag['src'] if image_tag else 'N/A'

    # Extract lab/personal website
    website_tag = soup.find('a', id="labpagebutton")
    website = website_tag['href'] if website_tag else 'N/A'

    # Extract research description from <div style="margin-top: 40px">
    research_div = soup.find("div", style="margin-top: 40px")
    research_areas = "N/A"
    if research_div:
        paragraphs = research_div.find_all("p")
        if paragraphs:
            research_areas = " ".join(p.get_text(strip=True) for p in paragraphs)

    return {
        "school": "UNC",
        "department": "Biology",
        "name": name,
        "title": title,
        "email": email,
        "research_areas": research_areas,
        "image": image,
        "website": website
    }

async def main():
    """Main function to scrape faculty details asynchronously."""
    faculty_links = await extract_faculty_links()

    async with aiohttp.ClientSession() as session:
        tasks = [extract_faculty_details(session, link) for link in faculty_links]
        faculty_data = await asyncio.gather(*tasks)

    # Insert the scraped data into the MySQL database
    insert_query = """
        INSERT INTO professors (school, department, name, title, email, research_areas, image, website)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """

    for faculty in faculty_data:
        try:
            cursor.execute(insert_query, (
                faculty['school'],
                faculty['department'],
                faculty['name'],
                faculty['title'],
                faculty['email'],
                faculty['research_areas'],
                faculty['image'],
                faculty['website']
            ))
        except mysql.connector.Error as err:
            print("MySQL Error: ", err)

    # Commit changes to the database
    db_connection.commit()
    print("UNC Biology data successfully inserted into the database.")

# Run the asynchronous scraping
asyncio.run(main())

# Close database connection
cursor.close()
db_connection.close()