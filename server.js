const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// API Routes
app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading notes data:', err);
      return res.status(500).json({ error: 'Failed to read notes data' });
    }
    res.json(JSON.parse(data));
  });
});

app.post('/api/notes', (req, res) => {
  const newNote = { id: uuidv4(), ...req.body };
  console.log('New note received:', newNote); // Log the new note received by the server

  fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading notes data:', err);
      return res.status(500).json({ error: 'Failed to read notes data' });
    }

    const notes = JSON.parse(data);
    notes.push(newNote);

    fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        console.error('Error saving note:', err);
        return res.status(500).json({ error: 'Failed to save note' });
      }
      res.json(newNote);
    });
  });
});

app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;

  fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading notes data:', err);
      return res.status(500).json({ error: 'Failed to read notes data' });
    }

    let notes = JSON.parse(data);
    notes = notes.filter(note => note.id !== noteId);

    fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        console.error('Error deleting note:', err);
        return res.status(500).json({ error: 'Failed to delete note' });
      }
      res.json({ message: 'Note deleted' });
    });
  });
});

// HTML Routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
