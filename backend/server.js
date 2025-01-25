// server.js
import express from 'express';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(cors());
app.use(express.json());

app.post('/api/register', async (req, res) => {
  const {
    firstName,
    middleName,
    lastName,
    designation,
    telephone,
    whatsapp,
    telegram,
    email,
    amount,
    submissionDate
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO registrations (
        first_name,
        middle_name,
        last_name,
        designation,
        telephone,
        whatsapp,
        telegram,
        email,
        amount,
        submission_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
      [firstName, middleName, lastName, designation, telephone, whatsapp, 
       telegram, email, amount, submissionDate]
    );

    res.json({
      success: true,
      redirectUrl: `http://localhost:5000/payment/${result.rows[0].id}`
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));