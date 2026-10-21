function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

function registerUser(login, password) {
    login = login.trim();
    if (!login || !password) return alert('Заполните все поля!');

    let users = getUsers();
    if (users.some(u => u.login === login)) return alert('Логин занят!');

    users.push({ login, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Успешная регистрация!');
}

function loginUser(login, password) {
    let users = getUsers();
    let user = users.find(u => u.login === login.trim() && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', user.login);
        return true;
    }
    alert('Неверный логин или пароль!');
    return false;
}

function logoutUser() {
    localStorage.removeItem('currentUser');
    location.reload();
}