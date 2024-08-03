document.addEventListener('DOMContentLoaded', (event) => {
    let noteForm = document.querySelector('.note-form');
    let noteTitle = document.querySelector('.note-title');
    let noteText = document.querySelector('.note-textarea');
    let saveNoteBtn = document.querySelector('.save-note');
    let newNoteBtn = document.querySelector('.new-note');
    let clearBtn = document.querySelector('.clear-btn');
    let noteList = document.querySelector('#note-list');
  
    const apiUrl = '/api/notes';
  
    const show = (elem) => { elem.style.display = 'inline'; };
    const hide = (elem) => { elem.style.display = 'none'; };
  
    let activeNote = {};
  
    const getNotes = () => fetch(apiUrl, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
  
    const saveNote = (note) => fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(note) });
  
    const deleteNote = (id) => fetch(`${apiUrl}/${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } });
  
    const renderActiveNote = () => {
      hide(saveNoteBtn);
      hide(clearBtn);
  
      if (activeNote.id) {
        show(newNoteBtn);
        noteTitle.setAttribute('readonly', true);
        noteText.setAttribute('readonly', true);
        noteTitle.value = activeNote.title;
        noteText.value = activeNote.text;
      } else {
        hide(newNoteBtn);
        noteTitle.removeAttribute('readonly');
        noteText.removeAttribute('readonly');
        noteTitle.value = '';
        noteText.value = '';
      }
    };
  
    const handleNoteSave = () => {
      const newNote = { title: noteTitle.value, text: noteText.value };
      saveNote(newNote).then(() => {
        getAndRenderNotes();
        renderActiveNote();
      });
    };
  
    const handleNoteDelete = (e) => {
      e.stopPropagation();
  
      const note = e.target;
      const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;
  
      if (activeNote.id === noteId) {
        activeNote = {};
      }
  
      deleteNote(noteId).then(() => {
        getAndRenderNotes();
        renderActiveNote();
      });
    };
  
    const handleNoteView = (e) => {
      e.preventDefault();
      activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
      renderActiveNote();
    };
  
    const handleNewNoteView = (e) => {
      activeNote = {};
      show(clearBtn);
      renderActiveNote();
    };
  
    const handleRenderBtns = () => {
      show(clearBtn);
      if (!noteTitle.value.trim() && !noteText.value.trim()) {
        hide(clearBtn);
      } else if (!noteTitle.value.trim() || !noteText.value.trim()) {
        hide(saveNoteBtn);
      } else {
        show(saveNoteBtn);
      }
    };
  
    const renderNoteList = async (notes) => {
      let jsonNotes = await notes.json();
      noteList.innerHTML = '';
  
      let noteListItems = [];
  
      const createLi = (text, delBtn = true) => {
        const liEl = document.createElement('li');
        liEl.classList.add('list-group-item');
  
        const spanEl = document.createElement('span');
        spanEl.classList.add('list-item-title');
        spanEl.innerText = text;
        spanEl.addEventListener('click', handleNoteView);
  
        liEl.append(spanEl);
  
        if (delBtn) {
          const delBtnEl = document.createElement('i');
          delBtnEl.classList.add('fas', 'fa-trash-alt', 'float-right', 'text-danger', 'delete-note');
          delBtnEl.addEventListener('click', handleNoteDelete);
  
          liEl.append(delBtnEl);
        }
  
        return liEl;
      };
  
      if (jsonNotes.length === 0) {
        noteListItems.push(createLi('No saved Notes', false));
      }
  
      jsonNotes.forEach((note) => {
        const li = createLi(note.title);
        li.dataset.note = JSON.stringify(note);
        noteListItems.push(li);
      });
  
      noteListItems.forEach((note) => noteList.append(note));
    };
  
    const getAndRenderNotes = () => getNotes().then(renderNoteList);
  
    saveNoteBtn.addEventListener('click', handleNoteSave);
    newNoteBtn.addEventListener('click', handleNewNoteView);
    clearBtn.addEventListener('click', renderActiveNote);
    noteForm.addEventListener('input', handleRenderBtns);
  
    getAndRenderNotes();
  });
  