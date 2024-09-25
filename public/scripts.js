document.addEventListener('DOMContentLoaded', () => {
    const noteForm = document.getElementById('noteForm');
    const notesList = document.getElementById('notesList');

    // Fetch and display notes
    fetch('/api/notes')
        .then(response => response.json())
        .then(notes => {
            notes.forEach(note => {
                addNoteToDOM(note);
            });
        });

    // Handle form submission
    noteForm.addEventListener('submit', event => {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;

        fetch('/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, content })
        })
            .then(response => response.json())
            .then(note => {
                addNoteToDOM(note);
                noteForm.reset();
            });
    });

    // Add note to DOM
    function addNoteToDOM(note) {
        const noteDiv = document.createElement('div');
        noteDiv.classList.add('note');
        noteDiv.innerHTML = `
            <h2>${note.title}</h2>
            <p>${note.content}</p>
            <button onclick="deleteNote('${note._id}', this)">Delete</button>
        `;
        notesList.appendChild(noteDiv);
    }
});

// Delete note
function deleteNote(id, button) {
    fetch(`/api/notes/${id}`, {
        method: 'DELETE'
    })
        .then(() => {
            const noteDiv = button.parentElement;
            noteDiv.remove();
        });
}
