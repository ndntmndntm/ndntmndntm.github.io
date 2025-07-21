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
    mwa.split(" ").forEach((e) => filenames.push(mwapath + e));
}

function generateWAName(filename) {
    return filename.replace("/static/wa/", "");
}

function pushWA(filename, wa) {
    WA[filename] = text;
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(generateWAName(filename)));
    const btn = document.createElement("button");
    btn.setAttribute("onclick", `copy2clipboard(${filename})`);
    div.appendChild(btn);
    const waupdate = document.getElementById("wa-update");
    document.insertBefore(div, waupdate);
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