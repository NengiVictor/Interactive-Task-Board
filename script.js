let tasks = [];
const taskForm = document.getElementById('taskForm');

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
    renderTasks();
    taskForm.reset();
});

function renderTasks() {
    document.getElementById('list-todo').innerHTML = '';
    document.getElementById('list-in-progress').innerHTML = '';
    document.getElementById('list-completed').innerHTML = '';

    tasks.forEach(task => {
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
    renderTasks();
}