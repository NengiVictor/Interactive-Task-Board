let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentTheme = localStorage.getItem('theme') || 'light';

const taskForm = document.getElementById('taskForm');
const searchInput = document.getElementById('searchInput');
const filterCategory = document.getElementById('filterCategory');
const themeToggle = document.getElementById('themeToggle');

document.addEventListener('DOMContentLoaded', () => {
    if (currentTheme === 'dark') document.body.classList.add('dark-mode');
    renderTasks();
    setupDropzones();
});

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
});

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    tasks.push({
        id: Date.now().toString(),
        title: document.getElementById('taskTitle').value,
        desc: document.getElementById('taskDesc').value,
        category: document.getElementById('taskCategory').value,
        priority: document.getElementById('taskPriority').value,
        status: 'todo'
    });
    saveAndRender();
    taskForm.reset();
});

searchInput.addEventListener('input', renderTasks);
filterCategory.addEventListener('change', renderTasks);

function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

function renderTasks() {
    document.getElementById('list-todo').innerHTML = '';
    document.getElementById('list-in-progress').innerHTML = '';
    document.getElementById('list-completed').innerHTML = '';

    const searchTerm = searchInput.value.toLowerCase();
    const filterCat = filterCategory.value;
    
    let counts = { 'todo': 0, 'in-progress': 0, 'completed': 0 };

    tasks.filter(task => 
        task.title.toLowerCase().includes(searchTerm) && 
        (filterCat === 'All' || task.category === filterCat)
    ).forEach(task => {
        counts[task.status]++;
        const taskEl = document.createElement('div');
        taskEl.className = `task-card priority-${task.priority}`;
        taskEl.setAttribute('draggable', 'true');
        taskEl.dataset.id = task.id;
        taskEl.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.desc}</p>
            <small>${task.category} | ${task.priority}</small><br>
            <button onclick="deleteTask('${task.id}')">Delete</button>
        `;
        
        taskEl.addEventListener('dragstart', function() {
            this.classList.add('dragging');
            draggedTaskId = this.dataset.id;
        });
        taskEl.addEventListener('dragend', function() {
            this.classList.remove('dragging');
            draggedTaskId = null;
        });

        document.getElementById(`list-${task.status}`).appendChild(taskEl);
    });

    document.getElementById('count-todo').innerText = `(${counts['todo']})`;
    document.getElementById('count-in-progress').innerText = `(${counts['in-progress']})`;
    document.getElementById('count-completed').innerText = `(${counts['completed']})`;
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveAndRender();
}

let draggedTaskId = null;
function setupDropzones() {
    document.querySelectorAll('.dropzone').forEach(zone => {
        zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
        zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
        zone.addEventListener('drop', e => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            if (draggedTaskId) {
                tasks.find(t => t.id === draggedTaskId).status = zone.dataset.status;
                saveAndRender();
            }
        });
    });
}