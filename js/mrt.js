let names_textarea = document.getElementById("mrt_names");
let note_textarea = document.getElementById("mrt_note");
let result_textarea = document.getElementById("mrt_result");

function MRTGenerate() {
    let names = JSON.parse(names_textarea.textContent);
    let note = note_textarea.textContent;

    for (const [key, value] of Object.entries(names)) {
        note = note.replaceAll(key, value);
    }
    result_textarea.textContent = note;
}

function MRTCopy() {
    navigator.clipboard.writeText(note);
}