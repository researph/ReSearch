import requests
from bs4 import BeautifulSoup

# URL of the faculty page
URL = "https://linguistics.unc.edu/people/faculty/"  # Replace with actual faculty page URL

# Send a GET request to fetch the webpage content
soup = BeautifulSoup(requests.get(URL, headers={
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
}).text, "html.parser")

# List to store professor details
professors = []

for card in soup.find_all("div", class_="col-md-8"):
    # Extract professor name
    name_tag = card.find("span", class_="people-name")
    name = name_tag.text.strip() if name_tag else "N/A"

    # Extract title/position
    title_text = card.text.split("\n")[1].strip() if len(card.text.split("\n")) > 1 else "N/A"

    # Extract email
    email_tag = card.find("a", href=lambda href: href and "mailto:" in href)
    email = email_tag.text.strip() if email_tag else "N/A"

    # Extract website
    website_tag = card.find("a", href=lambda href: href and "web.unc.edu" in href)
    website = website_tag["href"] if website_tag else "N/A"

    # Extract specialization
    specialization_tag = card.find("strong", text="Specialization:")
    specialization = specialization_tag.next_sibling.strip() if specialization_tag else "N/A"

    # Extract corresponding image (assuming images are in the previous sibling div)
    image_div = card.find_previous_sibling("div", class_="col-md-4")
    image_tag = image_div.find("img") if image_div else None
    image_url = image_tag["src"] if image_tag else "N/A"

    # Store the professor's details
    professors.append({
        "name": name,
        "title": title_text,
        "email": email,
        "website": website,
        "research_interests": specialization,
        "image": image_url
    })

# Print the extracted data
for prof in professors:
    print(prof)
