# 🔍  ReSearch : Finding research shouldn’t feel like a research project!

**ReSearch** ReSearch is a streamlined, user-friendly platform designed to help you quickly discover Computer Science research professors across three prestigious universities—UNC, NC State, and Duke. Gone are the days of sifting through multiple university websites, departmental pages, or personal blogs. With ReSearch, you can:

* Search for professors by name, university, or research area.
* Browse detailed profiles, including contact information, research interests, and academic background.
* Centralize information from multiple universities, making it easy to compare and connect with experts in your field.

Additionally, ReSearch makes it easier to stay organized and reach out to your favorite professors:

* Save your favorite professors to your personal list for easy access.
* Quickly email professors by clicking on their email icon.
* Visit their lab websites directly with just a click, making it easier to explore their research projects.

Whether you're a student looking for a potential research advisor or a professional exploring the latest work in Computer Science, ReSearch saves you time by bringing all the relevant details into one accessible interface.

## Features
✅ Search by Name, University, or Research Interest

✅ Aggregated Researcher Profiles

✅ Automated Data Collection & Updates

✅ User-Friendly Interface with Fast Search

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
2. Install dependencies: npm install
3. Start MySQL with Docker: docker-compose up -d
    - To stop MySQL: docker-compose down
4. Start the frontend and backend (via concurrently): npm run dev

## Attributions / Sources
- Icons created on Figma using designs by Freepik (Flaticon)