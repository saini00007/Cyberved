// server.js
import express from 'express';
import cors from 'cors';
import { createObjectCsvWriter } from 'csv-writer';
import { existsSync } from 'fs';

const app = express();
app.use(cors());
app.use(express.json());

const csvWriter = createObjectCsvWriter({
  path: 'registrations.csv',
  header: [
    { id: 'firstName', title: 'First Name' },
    { id: 'middleName', title: 'Middle Name' },
    { id: 'lastName', title: 'Last Name' },
    { id: 'designation', title: 'Designation' },
    { id: 'telephone', title: 'Telephone' },
    { id: 'whatsapp', title: 'WhatsApp' },
    { id: 'telegram', title: 'Telegram' },
    { id: 'email', title: 'Email' },
    { id: 'amount', title: 'Amount' },
    { id: 'submissionDate', title: 'Submission Date' }
  ],
  append: existsSync('registrations.csv')
});

app.post('/register', async (req, res) => {
  const { firstName, middleName, lastName, designation, telephone, whatsapp, telegram, email, amount } = req.body;
  try {
    if (!firstName || !lastName || !designation || !telephone || !whatsapp || !email || !amount) {
      return res.status(400).json({
        success: false,
         error: 'Required fields missing!'
      });
    }

    const now = new Date();
    const submissionData = { ...req.body, submissionDate: now };

    await csvWriter.writeRecords([submissionData]);

    res.json({
      success: true,
      redirectUrl: "https://pages.razorpay.com/upsifs-cyberveda"
    });
  } catch (error) {
    console.error('Error writing to CSV:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed'
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));