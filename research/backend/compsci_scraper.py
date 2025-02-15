import requests
from bs4 import BeautifulSoup

# URL of the faculty page
URL = "https://cs.unc.edu/about/people/?wpv-designation=faculty"  # Replace with actual faculty page URL

# Send a GET request to fetch the webpage content
soup = BeautifulSoup(requests.get(URL, headers={
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
}).text, "html.parser")

# List to store professor details
professors = []

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

    # Extract research interests (if available)
    research_interests_element = card.find("div", class_="details")
    research_interests = research_interests_element.text.strip() if research_interests_element else "N/A"

    # Extract profile image URL
    img_tag = card.find("img")
    profile_image_url = img_tag["src"] if img_tag else "N/A"

    # Store the professor's details
    professors.append({
        "name": name,
        "title": title,
        "email": email,
        "research_interests": research_interests,
        "profile_image_url": profile_image_url
    })

# Print the extracted data
for prof in professors:
    print(prof)