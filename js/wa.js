let WA = {};

let filenames = []
let loaded = 0;
const mwapath = "/static/wa/merfin/";
const mwa = `Banner Manager.txt
Death Knight (Full HD 1920-1080px).txt
Druid (Full HD 1920-1080px).txt
DungeonQueWidget.txt
Equipped Items.txt
Gear Check Helper.txt
General (All in 1).txt
Hunter (Full HD 1920-1080px).txt
Hunter Easy Pets.txt
I cba tinkers.txt
Mage (Full HD 1920-1080px).txt
MerfinUI Anchors (Full HD).txt
Mogushan Vaults Extra.txt
Monk (Full HD 1920-1080px).txt
Paladin (Full HD 1920-1080px).txt
Priest (Full HD 1920-1080px).txt
RCD Backend.txt
RCD Presets.txt
Rogue (Full HD 1920-1080px).txt
Shaman (Full HD 1920-1080px).txt
Starter Pack.txt
Stormlash Manager.txt
Talents&Glyphs.txt
TalentsGlyphs Reminder.txt
Unit Frames Indicators.txt
Warlock (Full HD 1920-1080px).txt
Warrior (Full HD 1920-1080px).txt
[Merfin] MRT T14 Auto Swap.txt
[Merfin] MRT T14 Custom Notes.txt`;

const fwapath = "/static/wa/fojji/";
const fwa = `t14msv.txt
boss kill timers.txt
donkey kong.txt
dudu.txt
dungeon pack icons.txt
dungeon pack.txt
general cooldown pulse.txt
general easy talents.txt
glyph reminders.txt
glyph talent set reminders.txt
guild banner rotation.txt
huntrad.txt
magus.txt
monk.txt
numen cd tracker.txt
numen core.txt
paladin.txt
priest.txt
raid assigments rl hof.txt
raid assigments rl msv.txt
raid assigments rl toes.txt
raid assigments user.txt
rogue.txt
set reminders.txt
shammy.txt
speedrun timer msv.txt
warlock.txt
warrior.txt`;

function initWAFilenames(path, was) {
    was.split("\n").forEach((e) => filenames.push(path + e));
}

function generateWAName(filename) {
    return filename.replace("/static/wa/", "").replace(".txt", "");
}

function pushWA(filename, wa) {
    WA[filename] = wa;
    const div = document.createElement("div");
    const p = document.createElement("p");
    p.textContent = generateWAName(filename);
    div.appendChild(p);
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

    loaded++;

    if (loaded == filenames.length) {
        sortWA();
    }
}

function sortWA() {
    const weakaurasElement = document.getElementById('weakauras');
    const listItems = Array.from(weakaurasElement.getElementsByTagName('li'));
    function getText(e) {
        return e.getElementsByTagName("div")[0].getElementsByTagName("p")[0].textContent; // :)
    }

    listItems.sort((a, b) => getText(a).localeCompare(getText(b)));

    weakaurasElement.innerHTML = '';

    listItems.forEach(item => {
        weakaurasElement.appendChild(item);
    });
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