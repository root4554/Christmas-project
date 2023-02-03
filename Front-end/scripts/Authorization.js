// const { Console } = require("console");

//confirm password
const confirmPass = () => {
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    if (password != confirmPassword) {
        console.log("Passwords Don't Match");
    } else {
        console.log("Passwords Match");
    }
};

document.querySelector("#submit").addEventListener("click", confirmPass);

const getformInfo = (type) => {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    if (type == "signup") {
        return { name: name, email: email, password: password };
    } else {
        return { email: email, password: password };
    }
};

const storeUser = (form) => {
    console.log("store user");
    let user = [];
    user.push(getformInfo(form));
    localStorage.setItem("user", JSON.stringify(user));
};
const removeUser = () => {
    localStorage.removeItem("user");
};

// const getCreatedDate = (n) => {
//     let query = 'se'
const showUser = () => {
    console.log("show user");

    let user = JSON.parse(localStorage.getItem("user"));
    let sign = document.querySelector(".sign");
    let random = Math.floor(Math.random() * 2) + 1;
    sign.innerHTML = "";
    if (user) {
        sign.innerHTML = `<div class="user">
        <img src="assets/av${random}.png" alt="">
        <p>${user[0].name}</p>
        <p>${user[0].email}</p>
        <p>user created at: ${user[0].created_at}</p>
        <button class="logoutBtn" onclick="changeFormContent()">Log out</button>
    </div>`;
    } else {
        changeFormContent();
    }
};

const logToUser = (response) => {
    console.log(response);
    if (response.status == 200) {
        storeUser("signup");
        showUser();
    }
};

// signup
const signup = () => {
    removeUser();
    const options = {
        method: "POST",
        headers: { Authorization: "Bearer " },
        body: new URLSearchParams({
            ...getformInfo("signup"),
        }),
    };

    fetch("/api/register", options)
        .then((response) => response.json())
        .then((response) => console.log(response))
        .catch((err) => console.error(err));

    storeUser("login");
    showUser();
};

// login
const login = () => {
    console.log("login func");
    const options = {
        method: "POST",
        headers: { Authorization: "Bearer " },
        body: new URLSearchParams({
            ...getformInfo("login"),
        }),
    };

    fetch("/api/login", options)
        .then((response) => response.json())
        .then((response) => console.log(response))
        .catch((err) => console.error(err));
    // if (response.status == 200) {
    storeUser("login");
    showUser();
    // }
};

// refresh
const refresh = () => {
    const options = {
        method: "POST",
        headers: {
            Authorization:
                "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0L2FwaS9sb2dpbiIsImlhdCI6MTY3NDk0MDIwMywiZXhwIjoxNjc0OTQzODAzLCJuYmYiOjE2NzQ5NDAyMDMsImp0aSI6IkpVQVpXOW5IQzJFeE16WE8iLCJzdWIiOiIyIiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.kUBt7zgpSZrz2hlhUNfGik2jhKwBfiC9tjnPvO9kU7g",
        },
        body: new URLSearchParams({
            email: "marouan@mail.com",
            password: "test1234",
        }),
    };

    fetch("/api/refresh", options)
        .then((response) => response.json())
        .then((response) => console.log(response))
        .catch((err) => console.error(err));
};

// logout
const logout = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const options = {
        method: "POST",
        headers: {
            Authorization:
                "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0L2FwaS9sb2dpbiIsImlhdCI6MTY3NDk0MDIwMywiZXhwIjoxNjc0OTQzODAzLCJuYmYiOjE2NzQ5NDAyMDMsImp0aSI6IkpVQVpXOW5IQzJFeE16WE8iLCJzdWIiOiIyIiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.kUBt7zgpSZrz2hlhUNfGik2jhKwBfiC9tjnPvO9kU7g",
        },
        body: new URLSearchParams({
            email: user[0].email,
            password: user[0].password,
        }),
    };
    fetch("/api/logout", options)
        .then((response) => response.json())
        .then((response) => console.log(response))
        .catch((err) => console.error(err));

    if (response.status == 200) {
        removeUser();
        showUser();
    }
};

const log = () => {
    const token = localStorage.getItem("user");
    if (token != null) {
        console.log("token exists");
        console.log(token);
    } else {
        console.log("token not found");
        let formType = document.querySelector("form");
        if (formType.classList.contains("sign-up")) {
            console.log("signup type");
            signup();
        } else {
            login();
            console.log("login type");
        }
    }
};
document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    log();
});
//#endregion
