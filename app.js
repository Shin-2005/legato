let entries = []

function loadEntries() {
    const savedEntries = localStorage.getItem('journalEntries')
    return savedEntries ? JSON.parse(savedEntries) : []
}

function saveEntry(event) {
    event.preventDefault()

    const title = document.getElementById('entryTitle').value.trim()
    const content = document.getElementById('entryContent').value.trim()

    entries.unshift({
        id: generateId(),
        title: title,
        content: content
    })

    saveEntries()
    renderEntries()
}

function generateId() {
    return Date.now().toString()
}

function saveEntries() {
    localStorage.setItem('journalEntries', JSON.stringify(entries))
}

function renderEntries() {
    const entriesContainer = document.getElementById('entriesContainer')

    if (entries.length === 0) {
        entriesContainer.innerHTML = `
            <div class="empty-state">
                <h2>No Entries Yet</h2>
                <p>Create your first entry to get started</p>
                <button class="add-entry-btn" onClick="openEntryDialog()">+ Add your first entry</button>
            </div>
        `
        
        return
    }

    entriesContainer.innerHTML = entries.map(entry => `
        <div class="entry-card">
            <h3 class="entry-title">${entry.title}</h3>
            <p class="entry-content">${entry.content}</p>
        </div>
        `).join('')
}

function openEntryDialog() {
    const dialog = document.getElementById('entryDialog')
    const titleInput = document.getElementById('entryTitle')
    const contentInput = document.getElementById('entryContent')

    dialog.showModal()
    titleInput.focus()
} 

function closeEntryDialog(event) {
    document.getElementById('entryDialog').close()
    saveEntry(event)
}

document.addEventListener('DOMContentLoaded', function() {
    entries = loadEntries()
    renderEntries()
})