let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
const taskForm = document.getElementById('taskForm');
const searchInput = document.getElementById('searchInput');
const filterCategory = document.getElementById('filterCategory');

document.addEventListener('DOMContentLoaded', renderTasks);

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
        const matchesSearch = task.title.toLowerCase().includes(searchTerm);
        const matchesCat = filterCat === 'All' || task.category === filterCat;
        return matchesSearch && matchesCat;
    });

    filteredTasks.forEach(task => {
        const taskEl = document.createElement('div');
        taskEl.className = `task-card priority-${task.priority}`;
        taskEl.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.desc}</p>
            <small>${task.category} | ${task.priority}</small><br>
            <button onclick="deleteTask('${task.id}')">Delete</button>
        `;
        document.getElementById(`list-${task.status}`).appendChild(taskEl);
    });
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveAndRender();
}