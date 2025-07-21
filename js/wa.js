let WA = {};

let filenames = []

const mwapath = "/static/wa/merfin/";
const mwa = `anchors.txt
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
warrior.txt`;

const fwapath = "/static/wa/fojji/";
const fwa = `cd.tracker.txt
class.anchors.txt
dk.txt
druid.txt
dungeon.mop.txt
essentials.mop.txt
hunter.txt
mage.txt
monk.txt
paladin.txt
priest.txt
rogue.txt
shaman.txt
warlock.txt
warrior.txt`;

function initWAFilenames(path, was) {
    was.split("\n").forEach((e) => filenames.push(path + e));
}

function generateWAName(filename) {
    return filename.replace("/static/wa/", "");
}

function pushWA(filename, wa) {
    WA[filename] = wa;
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(generateWAName(filename)));
    div.setAttribute("class", "wacopy-div");
    const btn = document.createElement("button");
    btn.textContent = "Copy";
    btn.setAttribute("onclick", `copy2clipboard("${filename}")`);
    btn.setAttribute("class", "wacopy-btn");
    div.appendChild(btn);
    const waupdate = document.getElementById("weakauras");
    const wrapper = document.createElement("li");
    wrapper.appendChild(div);
    waupdate.appendChild(wrapper);
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

initWAFilenames(mwapath, mwa);
initWAFilenames(fwapath, fwa);
loadWeakAuras();