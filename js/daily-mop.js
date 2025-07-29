let daily_states = {}

const COOKIE_STATES = "daily_states";
const COOKIE_DATE = "daily_date";
const FACTIONS = [
    "Shado-Pan",
    "Golden Lotus",
    "Klaxxi",
    "Celestials",
    "Cloud Serpents",
    "Anglers",
    "Tillers",
]
let listElement = document.getElementById("daily-mop");

let checkboxHandler = (id1, id2, v) => {
    daily_states[id1][id2] = v;
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


// update page & cookies from daily_states
function updatePage() {
    // clear screen
    listElement.textContent = listElement.innerHTML = "";
    updateCookies();
    if (daily_states != {}) {
        let sortedKeys = Object.keys(daily_states);
        sortedKeys.sort((a, b) => a.localeCompare(b));
        for (const k in sortedKeys) {
            let i = sortedKeys[k];
            if (daily_states[i] && daily_states[i] != {}) updateRow(i, daily_states[i]);
        }
    }
}

function updateCookies() {
    setCookie(COOKIE_DATE, new Date().toLocaleDateString(), 365);
    setCookie(COOKIE_STATES, JSON.stringify(daily_states), 365);
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
    button.setAttribute("class", "gigabutton");
    button.onclick = () => {
        delete daily_states[k];
        updatePage();
    };
    button.innerHTML = "<span>Delete</span>";
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
        checkboxWrapper.setAttribute("class", "ct-checkboxes " + ik);
        let checkbox = document.createElement("input");
        let id = `${k}_${ik}`;
        let label = document.createElement("label");
        label.innerHTML = ik;
        label.setAttribute("for", id);
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("name", id);
        checkbox.setAttribute("id", id);
        checkbox.setAttribute("class", "ct-checkbox");
        checkbox.checked = iv;
        checkbox.onchange = (event) => checkboxHandler(k, ik, event.currentTarget.checked);
        checkboxWrapper.appendChild(checkbox);
        checkboxWrapper.appendChild(label);
        checkboxes.appendChild(checkboxWrapper);
    }
    return checkboxes;
}

function todayIsANewDay() {
    for (const [k, v] of Object.entries(daily_states)) {
        for (const [ik, iv] of Object.entries(v)) {
            daily_states[k][ik] = false;
        }
    }
    updatePage();
}

// buttons
function addCharacter() {
    let name = document.getElementById("name").value.toUpperCase();
    daily_states[name] = {}
    FACTIONS.forEach(f => daily_states[name][f] = false);
    updatePage();
}

function reset() {
    daily_states = {};
    updatePage();
}

// util
function initUI() {
    //
    console.log("UI INIT");
}

window.onload = () => {
    initUI();
    daily_states = JSON.parse(getCookie(COOKIE_STATES));
    if (new Date().toLocaleDateString() != getCookie(COOKIE_DATE)) {
        todayIsANewDay();
    }
    updatePage();
}
