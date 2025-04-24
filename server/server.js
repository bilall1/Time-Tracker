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

// Create new entry
app.post('/api/entries', (req, res) => {
  try {
    const entries = readEntries();
    const newEntry = {
      id: Date.now(),
      ...req.body,
      startTime: new Date(req.body.startTime),
      endTime: req.body.endTime ? new Date(req.body.endTime) : null
    };
    entries.push(newEntry);
    writeEntries(entries);
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ error: 'Error creating entry' });
  }
});

// Update entry
app.put('/api/entries/:id', (req, res) => {
  try {
    const entries = readEntries();
    const index = entries.findIndex(entry => entry.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    entries[index] = {
      ...entries[index],
      ...req.body,
      startTime: new Date(req.body.startTime),
      endTime: req.body.endTime ? new Date(req.body.endTime) : null
    };
    writeEntries(entries);
    res.json(entries[index]);
  } catch (error) {
    res.status(500).json({ error: 'Error updating entry' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 