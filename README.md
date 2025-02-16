# 🔍  ReSearch : Finding research shouldn’t feel like a research project!

**ReSearch** is a centralized database that makes finding professors and researchers easy. No more clicking through endless university / departmental / personal pages — search by name, university, or research interest and get the info you need in one place.

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