let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
const taskForm = document.getElementById('taskForm');
const searchInput = document.getElementById('searchInput');
const filterCategory = document.getElementById('filterCategory');

document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    setupDropzones();
});

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newTask = {
        id: Date.now().toString(),
        title: document.getElementById('taskTitle').value,
        desc: document.getElementById('taskDesc').value,
        category: document.getElementById('taskCategory').value,
        priority: document.getElementById('taskPriority').value,
        status: 'todo'
    };
    tasks.push(newTask);
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

    const filteredTasks = tasks.filter(task => {
        return task.title.toLowerCase().includes(searchTerm) && 
               (filterCat === 'All' || task.category === filterCat);
    });

    filteredTasks.forEach(task => {
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
        
        // Drag events
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
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveAndRender();
}

// Drag and Drop Logic
let draggedTaskId = null;

function setupDropzones() {
    const dropzones = document.querySelectorAll('.dropzone');
    dropzones.forEach(zone => {
        zone.addEventListener('dragover', e => {
            e.preventDefault();
            zone.classList.add('drag-over');
        });
        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over');
        });
        zone.addEventListener('drop', e => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            if (draggedTaskId) {
                const newStatus = zone.dataset.status;
                const taskIndex = tasks.findIndex(t => t.id === draggedTaskId);
                tasks[taskIndex].status = newStatus;
                saveAndRender();
            }
        });
    });
}