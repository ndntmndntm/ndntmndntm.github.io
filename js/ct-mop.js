let states = {}
let data = {
    "ins": ["scroll"],
    "jwc": ["gem"],
    "alch": ["transmute"],
    "none": [],
}

let listElement = document.getElementById("ct-mop");

let checkboxHandler = (id1, id2, v) => {
    states[id1][id2] = v;
    updatePage();
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// update page & cookies from states
function updatePage() {
    // clear screen
    listElement.textContent = listElement.innerHTML = "";
    updateCookies();
    if (states != {}) {
        let sortedKeys = Object.keys(states);
        sortedKeys.sort((a, b) => a.localeCompare(b));
        console.log(sortedKeys);
        for (const k in sortedKeys) {
            console.log(k, states[k]);
            updateRow(k, states[k]);
        }
    }
}

function updateCookies() {
    setCookie("date", new Date().toLocaleDateString(), 365);
    setCookie("states", JSON.stringify(states), 365);
}

function updateRow(k, v) {
    let item = document.createElement("div");
    item.setAttribute("class", "wacopy-div");
    item.appendChild(makeNameText(k, v));
    item.appendChild(makeCheckboxes(k, v));
    item.appendChild(makeRemoveButton(k, v));

    let wrapper = document.createElement("li");
    wrapper.appendChild(item);

    listElement.appendChild(wrapper);
}

function makeRemoveButton(k, v) {
    let button = document.createElement("button");
    button.onclick = () => {
        delete states[k];
        updatePage();
    };
    button.innerHTML = "delete";
    return button;
}

function makeNameText(k, v) {
    let p = document.createElement("p");
    p.innerHTML = k;
    return p;
}

function makeCheckboxes(k, v) {
    let checkboxes = document.createElement("div");
    checkboxes.setAttribute("class", "wacopy-div");
    for (const [ik, iv] of Object.entries(v)) {
        let checkboxWrapper = document.createElement("div");
        checkboxWrapper.setAttribute("class", "ct-checkboxes");
        let checkbox = document.createElement("input");
        let id = `${k}_${ik}`;
        let label = document.createElement("label");
        label.innerHTML = ik;
        label.setAttribute("for", id);
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("name", id);
        checkbox.setAttribute("id", id);
        checkbox.checked = iv;
        checkbox.onchange = (event) => checkboxHandler(k, ik, event.currentTarget.checked);
        checkboxWrapper.appendChild(label);
        checkboxWrapper.appendChild(checkbox);
        checkboxes.appendChild(checkboxWrapper);
    }
    return checkboxes;
}

function todayIsANewDay() {
    for (const [k, v] of Object.entries(states)) {
        for (const [ik, iv] of Object.entries(v)) {
            states[k][ik] = false;
        }
    }
    updatePage();
}

function addCharacter() {
    let name = document.getElementById("name").value.toUpperCase();
    let prof1 = document.getElementById("prof1").value;
    let prof2 = document.getElementById("prof2").value;

    states[name] = {};
    data[prof1].forEach(e => states[name][e] = false);
    data[prof2].forEach(e => states[name][e] = false);

    updatePage();
}

function reset() {
    states = {};
    updatePage();
}

function initUI() {
    const id1 = "prof1";
    const id2 = "prof2";

    let changeHandler = (a, b, id) => {
        let v = a.getAttribute("value");
        if (v != "none") {
            if (b.selectedIndex == a.selectedIndex) b.value = "none";
            document.querySelectorAll(`#${id} option`).forEach(opt =>
                opt.disabled = opt.value != "none" && opt.value == a.value
            );
        }
    }

    let prof1 = document.getElementById(id1);
    let prof2 = document.getElementById(id2);
    prof1.onchange = () => changeHandler(prof1, prof2, id2);
    prof2.onchange = () => changeHandler(prof2, prof1, id1);
    console.log("UI INIT");
}

function updateStates() {
    for (const [k, v] of Object.entries(states)) {
        let newKey = k.toUpperCase();
        delete states[k];
        states[newKey] = v;
    }
}

window.onload = () => {
    initUI();
    states = JSON.parse(getCookie("states"));
    updateStates();
    if (new Date().toLocaleDateString() != getCookie("date")) {
        todayIsANewDay();
    }
    updatePage();
}
