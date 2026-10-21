let tasks = [];
let editIndex = -1;
let currentUser = null;

const authScreen = document.getElementById('authScreen');
const appScreen = document.getElementById('appScreen');
const authLogin = document.getElementById('authLogin');
const authPassword = document.getElementById('authPassword');
const saveBtn = document.getElementById('saveBtn');
const taskList = document.getElementById('taskList');
const emptyMsg = document.getElementById('emptyMsg');
const titleInput = document.getElementById('title');
const descInput = document.getElementById('desc');
const dateInput = document.getElementById('date');
const statusInput = document.getElementById('status');

document.getElementById('loginBtn').onclick = () => {
    if (loginUser(authLogin.value, authPassword.value)) {
        startApp(authLogin.value);
    }
};

document.getElementById('registerBtn').onclick = () => {
    registerUser(authLogin.value, authPassword.value);
    authLogin.value = authPassword.value = '';
};

document.getElementById('logoutBtn').onclick = logoutUser;

function startApp(login) {
    currentUser = login;
    authScreen.style.display = 'none';
    appScreen.style.display = 'block';
    document.getElementById('userName').innerText = '👤 ' + login;

    tasks = JSON.parse(localStorage.getItem('tasks_' + currentUser)) || [];
    renderTasks();
}

window.onload = () => {
    let user = localStorage.getItem('currentUser');
    if (user) startApp(user);
};

function saveTasks() {
    localStorage.setItem('tasks_' + currentUser, JSON.stringify(tasks));
}

function renderTasks() {
    const search = document.getElementById('search').value.toLowerCase();
    const filter = document.getElementById('filter').value;
    const sort = document.getElementById('sort').value;

    let visible = tasks.filter(t =>
        t.title.toLowerCase().includes(search) &&
        (filter === 'all' || t.status === filter)
    );

    if (sort === 'date') {
        visible.sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999'));
    }

    emptyMsg.style.display = visible.length ? 'none' : 'block';
    taskList.innerHTML = '';

    visible.forEach(task => {
        let div = document.createElement('div');
        div.className = 'task';
        div.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.desc || 'Без описания'}</p>
            <div class="meta">Срок: ${task.date || 'не указан'} | Статус: <span class="status-${task.status}">${task.status}</span></div>
            <button class="btn-edit" onclick="editTask(${tasks.indexOf(task)})">Редактировать</button>
            <button class="btn-delete" onclick="deleteTask(${tasks.indexOf(task)})">Удалить</button>
        `;
        taskList.appendChild(div);
    });
}

saveBtn.onclick = () => {
    let title = titleInput.value.trim();
    if (!title) return alert('Введите название!');

    let task = { title, desc: descInput.value, date: dateInput.value, status: statusInput.value };

    if (editIndex === -1) tasks.push(task);
    else {
        tasks[editIndex] = task;
        editIndex = -1;
        saveBtn.innerText = 'Добавить задачу';
    }

    saveTasks();
    renderTasks();

    titleInput.value = descInput.value = dateInput.value = '';
    statusInput.value = 'Новая';
};

function editTask(index) {
    let t = tasks[index];
    titleInput.value = t.title;
    descInput.value = t.desc;
    dateInput.value = t.date;
    statusInput.value = t.status;

    editIndex = index;
    saveBtn.innerText = 'Сохранить изменения';
    window.scrollTo(0, 0);
}

function deleteTask(index) {
    if (confirm('Удалить задачу?')) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }
}

document.getElementById('search').oninput = renderTasks;
document.getElementById('filter').onchange = renderTasks;
document.getElementById('sort').onchange = renderTasks;