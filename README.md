# 🔍  ReSearch : Finding research shouldn’t feel like a research project!

**ReSearch** ReSearch is a streamlined, user-friendly platform designed to help you quickly discover Computer Science research professors across three prestigious universities—UNC, NC State, and Duke. Gone are the days of sifting through multiple university websites, departmental pages, or personal blogs. With ReSearch, you can:

* Search for professors by name, university, or research area.
* Browse detailed profiles, including contact information, research interests, and academic background.
* Centralize information from multiple universities, making it easy to compare and connect with experts in your field.

Additionally, ReSearch makes it easier to stay organized and reach out to your favorite professors:

* Save your favorite professors to your personal list for easy access.
* Quickly email professors by clicking on their email icon.
* Visit their lab websites directly with just a click, making it easier to explore their research projects.
* Has a feature that allows users to upload a text version of their resume and select from a dropdown of their saved professors. The platform then generates a draft email to that professor based on the user’s resume and the professor’s research areas, making it easier to reach out with personalized content. 

For Computer Science students in the Research Triangle, ReSearch is the perfect tool to efficiently explore and connect with the vibrant research community at UNC, NC State, and Duke, saving you time and helping you make meaningful academic connections.

## Features
✅ Search by Name, University, or Research Interest

✅ Aggregated Researcher Profiles

✅ User-Friendly Interface with Fast Search

✅ Draft Research Interest Email Generator

## 🚀 Tech Stack  
### **Frontend**  
- **Next.js**  
- **React**
- **Tailwind CSS**

### **Backend**  
- **Typescript**
- **Node.js**
- **MySQL**

### **Infrastructure**
- Docker (Containerization)
- npm (Package management)
- Concurrently (Concurrent task running)

### **Scraping**  
- **Python**
- **Beautiful Soup**

### **Generative AI (Draft Email)**
- **Gemini API**

## 🛠️ Setup & Installation  

### **Prerequisites**  
- **Node.js** (for Next.js) (v18 or beyond)  
- **Docker & Docker Compose**
- **Python** (for the scraper)  
- **MySQL** (for storing data)
- **Some Dependencies**
    - dotenv
    - react
    - react-dom
    - next
    - typescript
    - ts-node
    - ts-node-dev
    - mysql2
    - concurrently

### Some Important Files
- docker-compose.yml: Defines Docker services for running MySQL in a container (no need for MySQL setup with manual installation)
- tsconfig.json: Configures TypeScript for the frontend (Next.js)
- tsconfig.backend.json: Configures TypeScript for the backend
- package.json: Defines project dependencies, scripts, and metadata

### **Setup**  
1. Make your .env file in project root:
    DB_HOST=localhost
    DB_USER=user
    DB_PASSWORD=password
    DB_NAME=research_db
    DB_PORT=3306
2. Install dependencies: `npm install`
3. Start MySQL with Docker: `docker-compose up -d`
    - To stop MySQL: docker-compose down
4. Start the frontend and backend (via concurrently): `npm run dev`

### **Gemini API Note**
We integrated Google's Gemini Pro API into our Next.js + TypeScript project to generate email drafts based on user input (resume). 

Here was our process:
1. Created the API Endpoint
2. Developed prompt:
    >Based on the following resume text, generate a professional cover letter addressed to Professor ${professor} about their research.
    >   
    >${resumeText}
    >
    >The cover letter should:
    >- Be concise and professional.
    >- Highlight relevant skills and experience.
    >- Express interest in learning more and request a meeting.
    >- Be formatted properly with a subject line and email signature.

3. Displayed the generated letter.

## Attributions / Sources
Profile icon created on Figma using designs by Freepik (Flaticon)!