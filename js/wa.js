let WA = {};

let filenames = []

const mwapath = "/static/wa/merfin/";
const mwa = `
anchors.txt
dk.txt
druid.txt
general.txt
hunter.txt
hunterpets.txt
mage.txt
monk.txt
paladin.txt
priest.txt
reminders.txt
rogue.txt
shaman.txt
t14autoswap.txt
t14customnotes.txt
uf.txt
warlock.txt
warrior.txt
`;

function initMWAFilenames() {
    mwa.split("\n").forEach((e) => filenames.push(mwapath + e));
}

function generateWAName(filename) {
    return filename.replace("/static/wa/", "");
}

function pushWA(filename, wa) {
    WA[filename] = wa;
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(generateWAName(filename)));
    const btn = document.createElement("button");
    btn.textContent = "Copy";
    btn.setAttribute("onclick", `copy2clipboard(${filename})`);
    btn.setAttribute("class", "wacopy-btn");
    div.appendChild(btn);
    const waupdate = document.getElementById("wa-update");
    waupdate.append(div);
}

function loadWeakAuras() {
    filenames.forEach((e) => {
        fetch(e).then((res) => res.text())
            .then((text) => {
                pushWA(e, text);
            }).catch((error) => console.log(error));
    });
}

function copy2clipboard(idx) {
    console.log(idx);
    console.log(WA[idx]);
    if (WA[idx]) {
        navigator.clipboard.writeText(WA[idx]);
    } else {
        alert('error: ' + idx);
    }
}

initMWAFilenames();
loadWeakAuras();