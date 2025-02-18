import aiohttp
import asyncio
from bs4 import BeautifulSoup
import mysql.connector
import os
from dotenv import load_dotenv
import re

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

# URL for UNC Psychology Core Faculty
BASE_URL = "https://psychology.unc.edu/core-faculty/"

async def fetch(session, url):
    """Asynchronously fetch URL content."""
    async with session.get(url) as response:
        return await response.text()

async def extract_faculty():
    """Extracts faculty information asynchronously."""
    async with aiohttp.ClientSession() as session:
        html = await fetch(session, BASE_URL)
        soup = BeautifulSoup(html, 'lxml')

        faculty_data = []
        faculty_blocks = soup.find_all("p")

        for i in range(len(faculty_blocks)):
            faculty = faculty_blocks[i]
            strong_tag = faculty.find("strong")
            if strong_tag:
                name = strong_tag.text.strip()
                title = faculty.find("em").text.strip() if faculty.find("em") else "N/A"
                
                email_tag = faculty.find("a", href=lambda href: href and "mailto:" in href)
                email = email_tag.text.strip() if email_tag else "N/A"

                # Extract image (from the same <p> or the previous <p> block if present)
                image = "N/A"
                img_tag = faculty.find("img")
                if not img_tag and faculty.find_previous_sibling("p"):
                    img_tag = faculty.find_previous_sibling("p").find("img")
                if img_tag:
                    image = img_tag["src"]

                # Extract research description
                research_areas = []
                website = "N/A"
                j = i + 1

                while j < len(faculty_blocks) and not faculty_blocks[j].find("strong"):
                    text = faculty_blocks[j].get_text(strip=True)

                    # Extract lab website from hyperlink
                    link_tag = faculty_blocks[j].find("a", href=True)
                    if link_tag and ("web.unc.edu" in link_tag["href"] or "lab" in link_tag["href"] or "research" in link_tag["href"]):
                        website = link_tag["href"]

                    # Remove "Visit online" and similar text from research areas
                    text = re.sub(r"Visit (him|her|them|me|us|our|their|online).*?:", "", text, flags=re.IGNORECASE)

                    # Remove any hyperlinks that were not captured as websites
                    text = re.sub(r'<a[^>]*>.*?</a>', '', text, flags=re.IGNORECASE)

                    research_areas.append(text)
                    j += 1

                research_areas = " ".join(research_areas).strip() if research_areas else "N/A"

                faculty_data.append({
                    "school": "UNC",
                    "department": "Psychology & Neuroscience",
                    "name": name,
                    "title": title,
                    "email": email,
                    "research_areas": research_areas,
                    "image": image,
                    "website": website
                })

        return faculty_data

async def main():
    """Main function to scrape and insert data into MySQL."""
    faculty_data = await extract_faculty()

    insert_query = """
        INSERT INTO professors (school, department, name, title, email, research_areas, image, website)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """

    for faculty in faculty_data:
        try:
            cursor.execute(insert_query, (
                faculty["school"],
                faculty["department"],
                faculty["name"],
                faculty["title"],
                faculty["email"],
                faculty["research_areas"],
                faculty["image"],
                faculty["website"]
            ))
        except mysql.connector.Error as err:
            print("MySQL Error: ", err)

    db_connection.commit()
    print("UNC (Psycho & Neuro) has been successfully inserted into the database.")

# Run the asynchronous scraping
asyncio.run(main())

# Close database connection
cursor.close()
db_connection.close()
