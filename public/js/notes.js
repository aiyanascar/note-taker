document.addEventListener('DOMContentLoaded', (event) => {
    const notesList = document.getElementById('notes-list');
    const noteTitle = document.getElementById('note-title');
    const noteText = document.getElementById('note-text');
    const saveNoteButton = document.getElementById('save-note');
    const clearNoteButton = document.getElementById('clear-note');
    const newNoteButton = document.getElementById('new-note');

    const apiUrl = '/api/notes';

    // Function to fetch notes from the server
    const fetchNotes = async () => {
        const response = await fetch(apiUrl);
        const notes = await response.json();
        notesList.innerHTML = '';
        notes.forEach(note => {
            const li = document.createElement('li');
            li.textContent = note.title;
            li.dataset.id = note.id;
            li.addEventListener('click', () => {
                displayNote(note);
            });
            notesList.appendChild(li);
        });
    };

    // Function to display a note
    const displayNote = (note) => {
        noteTitle.value = note.title;
        noteText.value = note.text;
        saveNoteButton.dataset.id = note.id;
        newNoteButton.style.display = 'block';
    };

    // Function to clear the note form
    const clearForm = () => {
        noteTitle.value = '';
        noteText.value = '';
        delete saveNoteButton.dataset.id;
        newNoteButton.style.display = 'none';
    };

    // Function to save a new or updated note
    const saveNote = async () => {
        const note = {
            title: noteTitle.value,
            text: noteText.value
        };
        const method = saveNoteButton.dataset.id ? 'PUT' : 'POST';
        const url = method === 'PUT' ? `${apiUrl}/${saveNoteButton.dataset.id}` : apiUrl;
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(note)
        });
        const newNote = await response.json();
        fetchNotes();
        clearForm();
    };

    // Event Listeners
    saveNoteButton.addEventListener('click', saveNote);
    clearNoteButton.addEventListener('click', clearForm);
    newNoteButton.addEventListener('click', clearForm);

    // Initial fetch of notes
    fetchNotes();
});
