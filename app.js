let notes = []

function saveEntry(event) {
    event.preventDefault()

    const title = document.getElementById('entryTitle').value.trim()
    const content = document.getElementById('entryContent').value.trim()

    notes.unshift({
        id: generateId(),
        title: title,
        content: content
    })

    saveEntries()
}

function generateId() {
    return Date.now().toString()
}

function saveNotes() {
    localStorage.setItem('journalEntries', JSON.stringify(notes))
}

function openEntryDialog() {
    const dialog = document.getElementById('entryDialog')
    const titleInput = document.getElementById('entryTitle')
    const contentInput = document.getElementById('entryContent')

    dialog.showModal()
    titleInput.focus()
} 

function closeEntryDialog() {
    document.getElementById('entryDialog').close()
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('entryForm').addEventListener('submit', saveEntry)
    document.getElementById('entryDialog').addEventListener('click', function(event) {
        if (event.target === this) closeEntryDialog()
    })
})