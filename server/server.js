const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'data', 'entries.json');

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to read entries
const readEntries = () => {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]');
    return [];
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
};

// Helper function to write entries
const writeEntries = (entries) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2));
};

// Routes
// Get all entries
app.get('/api/entries', (req, res) => {
  try {
    const entries = readEntries();
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Error reading entries' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 