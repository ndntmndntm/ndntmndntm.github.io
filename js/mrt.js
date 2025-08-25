let names_textarea = document.getElementById("mrt_names");
let note_textarea = document.getElementById("mrt_note");
let result_textarea = document.getElementById("mrt_result");

function MRTGenerate() {
    let names = JSON.parse("" + names_textarea.value);
    let note = note_textarea.value;

    for (const [key, value] of Object.entries(names)) {
        console.log(key, value);
        note = note.replaceAll(key, value);
    }
    result_textarea.value = note;
}

function MRTCopy() {
    navigator.clipboard.writeText(result_textarea.textContent);
}