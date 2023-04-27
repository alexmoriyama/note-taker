const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('../helpers/fsUtils');

notes.get('/notes', (req, res) => {
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});


notes.delete('/notes/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.id !== noteId);

      writeToFile('./db/db.json', result);

      res.json(`Item ${noteId} has been deleted 🗑️`);
    });
});


notes.post('/notes', (req, res) => {
  console.log(req.body);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
    text,
    title,
    id: uuidv4(),
    };

    readAndAppend(newNote, './db/db.json');
    res.json(newNote);
  } else {
    res.error('Error in adding note');
  }
});

module.exports = notes;
