import express from 'express';
import cors from 'cors';
import db from './db'; 

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json()); 

app.get('/api/professors', (req, res) => {
  const sql = 'SELECT * FROM professors';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching professors:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});