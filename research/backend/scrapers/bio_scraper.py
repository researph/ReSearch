import requests
from bs4 import BeautifulSoup

# URL of the faculty directory
URL = "https://bio.unc.edu/people/faculty/"

# Headers to mimic a real browser visit (helps avoid blocks)
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
}

# Send request and parse the page
response = requests.get(URL, headers=headers)
if response.status_code == 200:
    soup = BeautifulSoup(response.text, "html.parser")

    # List to store faculty information
    faculty_list = []

    # Iterate through faculty members
    for faculty in soup.select(".row"):
        name_tag = faculty.select_one(".col-sm-10 span")
        title_tag = faculty.select_one(".col-sm-10 em")
        email_tag = faculty.select_one(".col-sm-10 a[href^='mailto:']")
        research_tag = faculty.select_one(".col-sm-12 strong:contains('Research interests:')")

        profile_link_tag = faculty.select_one(".col-sm-2 a")
        profile_image_tag = faculty.select_one(".col-sm-2 img")

        # Extract text and attributes
        name = name_tag.text.strip() if name_tag else "N/A"
        title = title_tag.text.strip() if title_tag else "N/A"
        email = email_tag["href"].replace("mailto:", "").strip() if email_tag else "N/A"
        research_interests = research_tag.find_next_sibling(text=True).strip() if research_tag else "N/A"
        
        profile_link = profile_link_tag["href"] if profile_link_tag else "N/A"
        profile_image = profile_image_tag["src"] if profile_image_tag else "N/A"

        faculty_list.append({
            "name": name,
            "title": title,
            "email": email,
            "research_interests": research_interests,
            "website": profile_link,
            "img": profile_image
        })

    # Print the first 5 results for verification
    for faculty in faculty_list:
        print(faculty)

else:
    print(f"Failed to fetch page. Status code: {response.status_code}")
