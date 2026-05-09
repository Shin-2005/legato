interface Entry {
    id: string;
    title: string;
    content: string;
}

let entries: Entry[] = []
let editingEntryId: string | null = null

function loadEntries() {
    const savedEntries = localStorage.getItem('journalEntries')
    return savedEntries ? JSON.parse(savedEntries) : []
}

function saveEntry(event : MouseEvent) {
    event.preventDefault()

    const title = (document.getElementById('entryTitle') as HTMLInputElement).value.trim()
    const content = (document.getElementById('entryContent') as HTMLInputElement).value.trim()

    if (!title) return

    if (editingEntryId) {
        // Update existing entry
        const entryIndex = entries.findIndex(entry => entry.id === editingEntryId)
        entries[entryIndex] = {
            ...entries[entryIndex],
            title: title,
            content: content
        }
        
    } else {
        // Add new entry
        entries.unshift({
            id: generateId(),
            title: title,
            content: content
        })
    }

    saveEntries()
    renderEntries()
}

function generateId() {
    return Date.now().toString()
}

function saveEntries() {
    localStorage.setItem('journalEntries', JSON.stringify(entries))
}

function deleteEntry(entryId : string) {
    entries = entries.filter(entry => entry.id != entryId)
    saveEntries()
    renderEntries()
}

function renderEntries() {
    const entriesContainer = document.getElementById('entriesContainer')

    if (entries.length === 0) {
        (entriesContainer as HTMLInputElement).innerHTML = `
            <div class="empty-state">
                <h2>No Entries Yet</h2>
                <p>Create your first entry to get started</p>
                <button class="add-entry-btn" onClick="openEntryDialog()">+ Add your first entry</button>
            </div>
        `
        
        return
    }

    (entriesContainer as HTMLInputElement).innerHTML = entries.map(entry => `
        <div class="entry-card">
            <h3 class="entry-title">${entry.title}</h3>
            <p class="entry-content">${entry.content}</p>
            <div class="entry-actions">
                <button class="edit-btn" onclick="openEntryDialog('${entry.id}')">Edit</button>
                <button class="delete-btn" onclick="deleteEntry('${entry.id}')">Delete</button>
        </div>
        `).join('')
}

function openEntryDialog(entryId : string) {
    const dialog = (document.getElementById('entryDialog') as HTMLDialogElement)
    const titleInput = (document.getElementById('entryTitle') as HTMLInputElement)
    const contentInput = (document.getElementById('entryContent') as HTMLInputElement)

    if (entryId) {
        // Edit existing entry
        const entryToEdit = (entries.find(entry => entry.id === entryId) as Entry)
        editingEntryId = entryId
        titleInput.value = entryToEdit.title
        contentInput.value = entryToEdit.content
    } else {
        // Add existing entry
        editingEntryId = null
        titleInput.value = ''
        contentInput.value = ''
    }

    dialog.showModal()
    titleInput.focus() 
} 

function closeEntryDialog(event : MouseEvent) {
    saveEntry(event);
    (document.getElementById('entryDialog') as HTMLDialogElement).close()
}

document.addEventListener('DOMContentLoaded', function() {
    entries = loadEntries()
    renderEntries()
})