const sign = document.querySelector(".sign");
const formType = document.querySelector(".form-type");

//confirm password
const confirmPass = () => {
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    if (form.classList.contains("sign-up") && password != confirmPassword) {
        //console.log("Passwords Don't Match");
    } else {
        //console.log("Passwords Match");
    }
};

document.querySelector("#submit").addEventListener("click", confirmPass);

const getformInfo = (type) => {
    const emailv = document.getElementById("email").value;
    const passwordv = document.getElementById("password").value;
    if (type == "signup") {
        const namev = document.getElementById("name").value;
        return { name: namev, email: emailv, password: passwordv };
    } else {
        return { email: emailv, password: passwordv };
    }
};
const showErrorAlert = (response) => {
    if (response == null) {
        changeFormContent();
        alert(
            "Please fill all the fields correctly and check if the email is already used"
        );
    }
};

const storeUser = (response) => {
    let curentDate = new Date();
    response.date = curentDate;
    localStorage.setItem("response", JSON.stringify(response));
    showErrorAlert(response);
};
const removeUser = () => {
    localStorage.removeItem("user");
};
const getDate = (fulldate) => {
    fulldate = fulldate.split("T")[0];
    return fulldate;
};
const showUser = () => {
    let response = JSON.parse(localStorage.getItem("response"));
    let random = Math.floor(Math.random() * 2) + 1;
    sign.innerHTML = "";
    if (response != null && response.status == "success") {
        //console.log("user is logged in");
        form.style.display = "none";
        formType.style.display = "none";
        sign.innerHTML += `<div class="user">
        <img src="assets/av${random}.png" alt="">
        <p>${response.user.name}</p>
        <p>${response.user.email}</p>
        <p>account created at: ${getDate(response.user.created_at)}</p>
        <button class="logoutBtn" onclick="logout()">Log out</button>
    </div>`;
    } else {
        //console.log("user is not logged in");
        showForm();
    }
};
const showForm = () => {
    //console.log("show form");
    document.location.reload();
};

const logToUser = (response) => {
    //console.log("log to user");
    if (response.status == "success") {
        storeUser(response);
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
        .then((response) => logToUser(response))
        .catch((err) => console.error(err));
};

// login
const login = () => {
    //console.log("login");
    const options = {
        method: "POST",
        headers: { Authorization: "Bearer " },
        body: new URLSearchParams({
            ...getformInfo("login"),
        }),
    };

    fetch("/api/login", options)
        .then((response) => response.json())
        .then((response) => logToUser(response))
        .catch((err) => console.error(err));
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
    ////console.log("logout");
    const storedSession = JSON.parse(localStorage.getItem("response"));
    localStorage.removeItem("response");
    localStorage.removeItem("companies");
    showForm();
    // const options = {
    //     method: "POST",
    //     headers: {
    //         Authorization:
    //             "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0L2FwaS9sb2dpbiIsImlhdCI6MTY3NDk0MDIwMywiZXhwIjoxNjc0OTQzODAzLCJuYmYiOjE2NzQ5NDAyMDMsImp0aSI6IkpVQVpXOW5IQzJFeE16WE8iLCJzdWIiOiIyIiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.kUBt7zgpSZrz2hlhUNfGik2jhKwBfiC9tjnPvO9kU7g",
    //     },
    //     body: new URLSearchParams({
    //         email: user[0].email,
    //         password: user[0].password,
    //     }),
    // };
    // fetch("/api/logout", options)
    //     .then((response) => response.json())
    //     .then((response) => ////console.log(response))
    //     .catch((err) => console.error(err));

    // removeUser();
    // showUser();
};

const log = () => {
    ////console.log("log");

    let formType = document.querySelector("form");
    if (formType.classList.contains("sign-up")) {
        ////console.log("signup type");
        signup();
    } else {
        login();
        ////console.log("login type");
    }
};

document.querySelector("#submit").addEventListener("click", (e) => {
    log();
});
//#endregion

const SessionTimeOut = () => {
    let response = JSON.parse(localStorage.getItem("response"));
    let curentDate = new Date();
    let tokenDate = response.date;
    // if the difference between the current date and the token date is greater than 1 hour, the user will be logged out
    if (curentDate - tokenDate > 36000) {
        logout();
    }
};

const checkSession = () => {
    let response = JSON.parse(localStorage.getItem("response"));
    if (response != null) {
        showUser();
        SessionTimeOut();
    }
};
checkSession();
