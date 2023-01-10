const signInfoB = document.querySelector("#signInfoB");

const changeFormContent = () => {
    const form = document.querySelector("form");
    const namelabel = document.querySelector("#name-label");
    const nameinput = document.querySelector("#name");
    const passlabel = document.querySelector("#password-label");
    const passinput = document.querySelector("#confirm-password");
    const signInfoH = document.querySelector("#signInfoH");
    const submit = document.querySelector("#submit");
    const signInfoP = document.querySelector("#signInfoP");

    if (form.classList.contains("sign-up")) {
        form.classList.remove("sign-up");
        form.classList.add("sign-in");
        namelabel.classList.add("hidden");
        nameinput.classList.add("hidden");
        passlabel.classList.add("hidden");
        passinput.classList.add("hidden");
        signInfoH.innerHTML = "Sign in";
        submit.innerHTML = "Sign in";
        signInfoP.innerHTML = "Don't have an account?";
        signInfoB.innerHTML = "Sign Up";
    } else {
        form.classList.remove("sign-in");
        form.classList.add("sign-up");
        namelabel.classList.remove("hidden");
        nameinput.classList.remove("hidden");
        passlabel.classList.remove("hidden");
        passinput.classList.remove("hidden");
        signInfoH.innerHTML = "Sign up";
        submit.innerHTML = "Sign up";
        signInfoP.innerHTML = "Already have an account?";
        signInfoB.innerHTML = "Sign In";
    }
};

signInfoB.addEventListener("click", changeFormContent);

// empty the div
const emptyDiv = (counter) => {
    console.log(counter);
    if (counter == 0) {
        const div = document.querySelector(".drag-section");
        div.innerHTML = "";
    }
};

// drag elements to a div
let counter = 0;
const allowDrop = (ev) => {
    ev.preventDefault();
};
const drag = (ev) => {
    ev.dataTransfer.setData("text", ev.target.id);
};
const drop = (ev) => {
    emptyDiv(counter);
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
    counter++;
};

const images = document.querySelectorAll("img");
images.forEach((image) => {
    image.addEventListener("dragstart", drag);
});
