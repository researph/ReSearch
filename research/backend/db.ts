import 'dotenv/config';
import mysql, { Connection } from 'mysql2';

const db: Connection = mysql.createConnection({
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
  port: Number(process.env.DB_PORT),
});

db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.stack);
    return;
  }
  console.log('✅ Connected to MySQL on port', process.env.DB_PORT);
});

const createProfessorsTableQuery = `
  CREATE TABLE IF NOT EXISTS professors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school VARCHAR(255),
    department VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    email VARCHAR(255),
    research_interests TEXT,
    image VARCHAR(255),
    website VARCHAR(255)
  );
`;

// Run the query to create the table
db.query(createProfessorsTableQuery, (err, results) => {
  if (err) {
    console.error('❌ Error creating professors table:', err);
  } else {
    console.log('✅ Professors table created (or already exists)');
  }

  // Close the connection after the setup
  db.end((err) => {
    if (err) {
      console.error('❌ Error closing the database connection:', err);
    } else {
      console.log('✅ Database connection closed');
    }
  });
});

export default db;