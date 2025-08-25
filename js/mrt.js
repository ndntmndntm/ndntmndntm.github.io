let names_list = document.getElementById("mrt_names");
let note_textarea = document.getElementById("mrt_note");
let result_textarea = document.getElementById("mrt_result");

let mrt_states = {};

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

function updatePage() {
    names_list.innerHTML = "";
    saveMRTStates();
    if (mrt_states != {} && mrt_states["players"] != {}) {
        for (const [k, v] of Object.entries(mrt_states["players"])) {
            updateRow(k, v);
        }
    }
}
let counter = 0;
function addNewPlayer() {
    if (!mrt_states["player"]) {
        mrt_states["player"] = {};
    }
    mrt_states["player"][new Date().getTime()] = {
        "name": "NAME",
        "spec": "SPEC"
    }
    updatePage();
}

function updateRow(k, v) {
    let item = document.createElement("div");
    item.setAttribute("class", "wacopy-div");
    item.appendChild(makeNameText(k, v));
    item.appendChild(makeSpecText(k, v));
    item.appendChild(makeRemoveButton(k, v));

    let wrapper = document.createElement("li");
    wrapper.appendChild(item);

    names_list.appendChild(wrapper);
}


function makeRemoveButton(k, v) {
    let button = document.createElement("button");
    button.setAttribute("class", "gigabutton");
    button.onclick = () => {
        delete mrt_states["players"][k];
        updatePage();
    };
    button.innerHTML = "<span>Delete</span>";
    return button;
}

function makeNameText(k, v) {
    let p = document.createElement("p");
    p.innerHTML = v["name"];
    p.onchange = (event) => v["name"] = event.target.value;
    return p;
}
function makeSpecText(k, v) {
    let p = document.createElement("p");
    p.innerHTML = v["spec"];
    p.onchange = (event) => v["spec"] = event.target.value;
    return p;
}

function saveMRTStates() {
    mrt_states["note"] = note_textarea.value;
    setCookie("mrt", JSON.stringify(mrt_states));
}

function MRTGenerate() {
    let names = JSON.parse("" + names_list.value);
    let note = note_textarea.value;

    saveMRTStates();
    for (const [key, value] of Object.entries(names)) {
        console.log(key, value);
        note = note.replaceAll(key, value);
    }
    result_textarea.value = note;
}

function MRTCopy() {
    navigator.clipboard.writeText(result_textarea.textContent);
}

window.onload = () => {
    let mrtCookie = getCookie("mrt");
    if (mrtCookie == "") mrtCookie = "{}";
    mrt_states = JSON.parse(mrtCookie);
    updatePage();
    note_textarea.value = mrt_states["note"];
}