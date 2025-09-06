let names_list = document.getElementById("mrt_names");
let note_textarea = document.getElementById("mrt_note");
let result_textarea = document.getElementById("mrt_result");

let mrt_states = {
};

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

function importMRT() {
    let mrt_string = prompt("Enter exported MRT roster (don't use MRT export string)");
    console.log(mrt_string);
    let mrt_groups = mrt_string.replaceAll("\n", " ").replaceAll("\t", " ").replaceAll("  ", " ").trim().split(" ");
    let count = 0;
    for (p of mrt_groups) {
        if (p != "") {
            mrt_states["players"][count++] = {
                "name": p,
                "spec": "SPEC"
            }
        }
    }
    updatePage();
}

function importWA() {
    let wa_string = prompt("Enter exported WA roster").trim();
    console.log(wa_string);
    if (wa_string[0] != "!") {
        alert("Error?");
        return;
    }
    wa_string = wa_string.substring(1).trim();
    let wa_groups = wa_string.replaceAll("\n", " ").replaceAll("\t", " ").replaceAll("  ", " ").trim().split(" ");
    let count = 0;
    for (g of wa_groups) {
        if (g) {
            let [spec, name] = g.split("=");
            mrt_states["players"][count++] = {
                "name": name,
                "spec": spec
            }
        }
    }
    updatePage();
}


function updatePage() {
    names_list.innerHTML = "";
    saveMRTStates();
    if (!mrt_states["players"]) {
        mrt_states["players"] = {};
    }
    if (mrt_states != {} && mrt_states["players"] != {}) {
        for (const [k, v] of Object.entries(mrt_states["players"])) {
            updateRow(k, v);
        }
    }
}
let counter = 0;
function addNewPlayer() {
    if (!mrt_states["players"]) {
        mrt_states["players"] = {};
    }
    mrt_states["players"][new Date().getTime()] = {
        "name": "NAME",
        "spec": "SPEC"
    }
    updatePage();
}

function updateRow(k, v) {
    let item = document.createElement("div");
    item.setAttribute("class", "wacopy-div");
    item.appendChild(makeSpecText(k, v));
    item.appendChild(makeArrowText(k, v));
    item.appendChild(makeNameText(k, v));
    item.appendChild(makeRemoveButton(k, v));

    let wrapper = document.createElement("li");
    wrapper.appendChild(item);

    names_list.appendChild(wrapper);
}

function makeArrowText(k, v) {
    let p = document.createElement("p");
    p.innerHTML = "=>";
    return p;
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
    let p = document.createElement("input");
    p.value = v["name"];
    p.onchange = (event) => v["name"] = event.target.value;
    return p;
}
function makeSpecText(k, v) {
    let p = document.createElement("input");
    p.value = v["spec"];
    p.onchange = (event) => v["spec"] = event.target.value;
    return p;
}

function saveMRTStates() {
    mrt_states["note"] = note_textarea.value;
    setCookie("mrt", JSON.stringify(mrt_states));
}

function CleanUnused(txt) {
    let unusedSpecRE = /[A-Z][a-zA-Z]*[0-9]/;
    let spell = /{spell:\d*}/;
    let p;
    while ((p = unusedSpecRE.exec(txt)) != null) {
        let next = txt.slice(p.index).search(spell);
        let len = txt.slice(p.index).match(spell)[0].length;
        let end = next + len + p.index;
        txt = txt.slice(0, p) + txt.slice(end);
    }
    return txt;
}

function MRTGenerate() {
    let note = note_textarea.value;

    for (const [key, value] of Object.entries(mrt_states["players"])) {
        console.log(key, value);
        note = note.replaceAll(value["spec"], value["name"]);
    }
    result_textarea.value = CleanUnused(note);
    saveMRTStates();
}

function MRTGigaGenerate() {

    let note = note_textarea.value;

    let spell = /{spell:\d*}/;
    for (const [key, value] of Object.entries(mrt_states["players"])) {
        let pos;
        while ((pos = note.search(value["spec"])) != -1) {
            let tag = `\{p:${value["name"]}} ${value["name"]}`;
            let t = note.replace(value["spec"], tag);
            let tpos = pos + tag.length - value["spec"].length;
            let next = t.slice(tpos).search(spell);
            let len = t.slice(tpos).match(spell)[0].length;
            let idx = next + len + tpos;
            t = t.slice(0, idx) + "{/p}" + t.slice(idx);
            note = t;
        }
    }
    result_textarea.value = CleanUnused(note);
    saveMRTStates();
}



function MRTCopy() {
    navigator.clipboard.writeText(result_textarea.textContent);
}

window.onload = () => {
    let mrtCookie = getCookie("mrt");
    if (mrtCookie == "") mrtCookie = "{}";
    mrt_states = JSON.parse(mrtCookie);
    note_textarea.value = mrt_states["note"];
    updatePage();
}