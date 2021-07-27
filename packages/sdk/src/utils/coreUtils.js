export function prepareNote(note) {
    const enc = new TextEncoder();
    return  enc.encode(note);
}