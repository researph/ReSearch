import requests
from bs4 import BeautifulSoup

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

    # Print the extracted data
    for prof in professors:
        print(prof)