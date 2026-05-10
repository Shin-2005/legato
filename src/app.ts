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
            </div>
        `
        
        return
    }
    
    (entriesContainer as HTMLInputElement).textContent = ''
    entries.forEach(entry => {
        const card = document.createElement("div")
        card.classList.add("entry-card")
        
        const title = document.createElement("h3")
        title.classList.add("entry-title")
        const titleText = document.createTextNode(entry.title)
        title.appendChild(titleText)
        card.appendChild(title)

        const content = document.createElement("p")
        content.classList.add("entry-content")
        const contentText = document.createTextNode(entry.content)
        content.appendChild(contentText)
        card.appendChild(content)

        const actionsDiv = document.createElement("div")
        actionsDiv.classList.add("entry-actions")
        
        const editBtn = document.createElement("button")
        editBtn.classList.add("edit-btn")
        editBtn.setAttribute("onclick", `openEntryDialog(\`${entry.id}\`)`)
        const editBtnText = document.createTextNode("Edit")
        editBtn.appendChild(editBtnText)
        actionsDiv.appendChild(editBtn)

        const deleteBtn = document.createElement("button")
        deleteBtn.classList.add("delete-btn")
        deleteBtn.setAttribute("onclick", `deleteEntry(\`${entry.id}\`)`)
        const deleteBtnText = document.createTextNode("Delete")
        deleteBtn.appendChild(deleteBtnText)
        actionsDiv.appendChild(deleteBtn)

        card.appendChild(actionsDiv);
        entriesContainer?.appendChild(card)
    })
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
        // Add new entry
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