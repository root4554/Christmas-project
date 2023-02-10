// let companiesID = {
//     bbva: 1,
//     santander: 2,
//     repsol: 3,
//     iberdrola: 4,
//     inditex: 5,
//     caixabank: 6,
//     cellnex: 7,
//     naturgy: 8,
//     telefonica: 9,
//     ferrovial: 10,
// };

const signInfoB = document.querySelector("#signInfoB");

const form = document.querySelector("form");
const namelabel = document.querySelector("#name-label");
const nameinput = document.querySelector("#name");
const passlabel = document.querySelector("#password-label");
const passinput = document.querySelector("#confirm-password");
const signInfoH = document.querySelector("#signInfoH");
const submit = document.querySelector("#submit");
const signInfoP = document.querySelector("#signInfoP");

const changeFormContent = () => {
    if (form.classList.contains("sign-up")) {
        // console.log("sign in form");
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
        // console.log("sign up form");
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
    if (counter == 0) {
        const div = document.querySelector(".drop-section");
        div.innerHTML = "";
    }
};

//disable pointer events on drop section while draging
const disablePointerEvents = () => {
    const drop_containers = document.querySelectorAll(".dp-section");
    drop_containers.forEach((container) => {
        container.querySelectorAll("img").forEach((img) => {
            img.style.pointerEvents = "none";
        });
    });
};
//enable pointer events on drop section after droping
const enablePointerEvents = () => {
    const drop_containers = document.querySelectorAll(".dp-section");
    drop_containers.forEach((container) => {
        container.querySelectorAll("img").forEach((img) => {
            img.style.pointerEvents = "all";
        });
    });
};
const changeBorder = (dotted) => {
    const container = document.querySelector(".dp-section");
    if (dotted == true) {
        container.style.border = "2px dashed white";
    } else {
        container.style.border = "none";
    }
};

// drag elements to a div
let counter = 0;
const allowDrop = (ev) => {
    disablePointerEvents();
    ev.preventDefault();
    changeBorder(true);
};
const drag = (ev) => {
    ev.dataTransfer.setData("text", ev.target.id);
};
const drop = (ev) => {
    emptyDiv(counter);
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
    counter++;
    enablePointerEvents();
    changeBorder(false);
};

const images = document.querySelectorAll("img");
images.forEach((image) => {
    image.addEventListener("dragstart", drag);
});

//transfer logo to drop section by click on image(for mobile use)
const logoTranfer = (logo) => {
    const drop_containers = document.querySelectorAll(".dp-section");
    drop_containers.forEach((container) => {
        container.appendChild(logo);
    });
};

const dropDragDiv = document.querySelectorAll(".dp-section");
dropDragDiv.forEach((div) => {
    div.addEventListener("drop", drop);
    div.addEventListener("dragover", allowDrop);
});

///////////////////////////  localstorage  ///////////////////////////
const checkStoredCompanies = () => {
    let cont = document.querySelector(".slide-track");
    let companies = JSON.parse(localStorage.getItem("companies"));
    if (companies) {
        if (companies.length > 0) {
            emptyDiv(counter);
            counter++;
        }
        for (let i = 0; i < companies.length; i++) {
            const company = document.querySelector(`.${companies[i].name}`);
            logoTranfer(company);
        }
    }
};
document.onload = checkStoredCompanies();

const storeCompanies = () => {
    document.querySelector("#scrl").style.display = "block";
    let selectedcompanies = document
        .querySelector("#drop-section")
        .querySelectorAll("img");
    let companies = [];
    for (let i = 0; i < selectedcompanies.length; i++) {
        companies.push({
            name: selectedcompanies[i].className,
            id: selectedcompanies[i].id,
        });
    }
    localStorage.setItem("companies", JSON.stringify(companies));
    // return companies;
};
document.querySelector("#data-btn").addEventListener("click", storeCompanies);

// remove scrollicnon on scroll
const removeScrollIcon = () => {
    document.querySelector("#scrl").style.display = "none";
};
document.querySelector("body").addEventListener("scroll", removeScrollIcon);
document.querySelector("body").addEventListener("wheel", removeScrollIcon);

///////////////////////// showing the selected companies /////////////////////////

const showCompanies = () => {
    let companies = JSON.parse(localStorage.getItem("companies"));
    if (companies) {
        const div = document.querySelector(".stocks-info");
        div.querySelectorAll(".stock-card").forEach((card) => {
            card.remove();
        });

        for (let i = 0; i < companies.length; i++) {
            // const company = document.querySelector(`#${companies[i]}`);
            const company = `<div class="stock-card" companyId="${companies[i].id}">
            <div class="pic">
                <img
                    id="${companies[i].id}"
                    src="assets/${companies[i].name}.png"
                    alt=""
                />
            </div>
            <div class="last-value">
                <p id="last-value">---- €</p>
            </div>
            <div class="actual-value">
                <p id="actual-value">---- €</p>
            </div>
        </div>`;
            div.innerHTML += company;
        }
        document.querySelectorAll(".stock-card").forEach((card) => {
            card.addEventListener("click", () => {
                createCompanyChart(card);
                getTotalInvestmentData(card);
            });
        });
    }
};

document.querySelector("#data-btn").addEventListener("click", showCompanies);
document.onload = showCompanies();
