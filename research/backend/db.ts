import 'dotenv/config';
import mysql, { Connection } from 'mysql2';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db: Connection = mysql.createConnection({
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
  port: Number(process.env.DB_PORT),
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL on port', process.env.DB_PORT);
});

// Function to reset and recreate the professors table
const resetProfessorsTable = () => {
  const dropTableQuery = `DROP TABLE IF EXISTS professors;`;

  db.query(dropTableQuery, (err) => {
    if (err) {
      console.error('Error dropping professors table:', err);
      db.end();
      return;
    }
    console.log('Professors table dropped');

    const createTableQuery = `
      CREATE TABLE professors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        school VARCHAR(255),
        department VARCHAR(255),
        name VARCHAR(255) NOT NULL,
        title VARCHAR(255),
        email VARCHAR(255),
        research_areas TEXT,
        image VARCHAR(255),
        website VARCHAR(255)
      );
    `;

    db.query(createTableQuery, (err) => {
      if (err) {
        console.error('Error creating professors table:', err);
      } else {
        console.log('Professors table created');
        runScrapers(); // Run scrapers after table creation
      }

      // Close the database connection
      db.end((err) => {
        if (err) {
          console.error('Error closing the database connection:', err);
        } else {
          console.log('Database connection closed');
        }
      });
    });
  });
};

// Function to run scrapers
const runScrapers = () => {
  const scraperFolder = path.join(__dirname, 'scrapers'); // Adjusted to 'backend/scraper/'
  const scrapers = ['nc_state.py'];
  // const scrapers = ['duke_scraper.py', 'unc_scraper.py', 'nc_state.py'];

  scrapers.forEach((script) => {
    const scriptPath = path.join(scraperFolder, script); // Construct full path

    const process = spawn('python3', [scriptPath]);

    process.stdout.on('data', (data) => {
      console.log(` ${script} Output: ${data}`);
    });

    process.stderr.on('data', (data) => {
      console.error(` ${script} Error: ${data}`);
    });

    process.on('close', (code) => {
      console.log(`${script} finished with exit code ${code}`);
    });
  });
};

// Reset and recreate the professors table
resetProfessorsTable();

export default db;