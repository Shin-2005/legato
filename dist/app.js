"use strict";
let entries = [];
let editingEntryId = null;
function loadEntries() {
    const savedEntries = localStorage.getItem('journalEntries');
    return savedEntries ? JSON.parse(savedEntries) : [];
}
function saveEntry(event) {
    event.preventDefault();
    const title = document.getElementById('entryTitle').value.trim();
    const content = document.getElementById('entryContent').value.trim();
    if (!title)
        return;
    if (editingEntryId) {
        // Update existing entry
        const entryIndex = entries.findIndex(entry => entry.id === editingEntryId);
        entries[entryIndex] = {
            ...entries[entryIndex],
            title: title,
            content: content
        };
    }
    else {
        // Add new entry
        entries.unshift({
            id: generateId(),
            title: title,
            content: content
        });
    }
    saveEntries();
    renderEntries();
}
function generateId() {
    return Date.now().toString();
}
function saveEntries() {
    localStorage.setItem('journalEntries', JSON.stringify(entries));
}
function deleteEntry(entryId) {
    entries = entries.filter(entry => entry.id != entryId);
    saveEntries();
    renderEntries();
}
function renderEntries() {
    const entriesContainer = document.getElementById('entriesContainer');
    if (entries.length === 0) {
        entriesContainer.innerHTML = `
            <div class="empty-state">
                <h2>No Entries Yet</h2>
                <p>Create your first entry to get started</p>
            </div>
        `;
        return;
    }
    entriesContainer.textContent = '';
    entries.forEach(entry => {
        const card = document.createElement("div");
        card.classList.add("entry-card");
        const title = document.createElement("h3");
        title.classList.add("entry-title");
        const titleText = document.createTextNode(entry.title);
        title.appendChild(titleText);
        card.appendChild(title);
        const content = document.createElement("p");
        content.classList.add("entry-content");
        const contentText = document.createTextNode(entry.content);
        content.appendChild(contentText);
        card.appendChild(content);
        const actionsDiv = document.createElement("div");
        actionsDiv.classList.add("entry-actions");
        const editBtn = document.createElement("button");
        editBtn.classList.add("edit-btn");
        editBtn.setAttribute("onclick", `openEntryDialog(\`${entry.id}\`)`);
        editBtn.setAttribute("title", "Edit Note");
        const editBtnIcon = createEditIcon();
        editBtn.appendChild(editBtnIcon);
        actionsDiv.appendChild(editBtn);
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.setAttribute("onclick", `deleteEntry(\`${entry.id}\`)`);
        deleteBtn.setAttribute("title", "Delete Note");
        const deleteBtnIcon = createDeleteIcon();
        deleteBtn.appendChild(deleteBtnIcon);
        actionsDiv.appendChild(deleteBtn);
        card.appendChild(actionsDiv);
        entriesContainer?.appendChild(card);
    });
}
function createEditIcon() {
    const svg_ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svg_ns, 'svg');
    Object.entries({
        width: '16',
        height: '16',
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
    }).forEach(([k, v]) => svg.setAttribute(k, v));
    [
        'M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7',
        'M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z'
    ].forEach(d => {
        const path = document.createElementNS(svg_ns, 'path');
        path.setAttribute('d', d);
        svg.appendChild(path);
    });
    return svg;
}
function createDeleteIcon() {
    const svg_ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svg_ns, 'svg');
    Object.entries({
        width: '16',
        height: '16',
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
    }).forEach(([k, v]) => svg.setAttribute(k, v));
    [
        'M10 11v6',
        'M14 11v6',
        'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6',
        'M3 6h18',
        'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
    ].forEach(d => {
        const path = document.createElementNS(svg_ns, 'path');
        path.setAttribute('d', d);
        svg.appendChild(path);
    });
    return svg;
}
function openEntryDialog(entryId) {
    const dialog = document.getElementById('entryDialog');
    const dialogTitle = document.getElementById('dialogTitle');
    const titleInput = document.getElementById('entryTitle');
    const contentInput = document.getElementById('entryContent');
    if (entryId) {
        // Edit existing entry
        const entryToEdit = entries.find(entry => entry.id === entryId);
        editingEntryId = entryId;
        dialogTitle.textContent = 'Edit Entry';
        titleInput.value = entryToEdit.title;
        contentInput.value = entryToEdit.content;
    }
    else {
        // Add new entry
        editingEntryId = null;
        dialogTitle.textContent = 'New Entry';
        titleInput.value = '';
        contentInput.value = '';
    }
    dialog.showModal();
    titleInput.focus();
}
function closeEntryDialog(event) {
    saveEntry(event);
    document.getElementById('entryDialog').close();
}
document.addEventListener('DOMContentLoaded', function () {
    entries = loadEntries();
    renderEntries();
});
//# sourceMappingURL=app.js.map