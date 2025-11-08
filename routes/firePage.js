import db from "./firebase-init.js";


let lastDoc = null;
 
async function getFirstPage() {
    const q = db.collection("game")
        //.orderBy('idGame', 'desc')
        .limit(2);
 
    const snap = await q.get();
    if (snap.empty) { console.log('Sin datos'); return; }
 
    snap.forEach(doc => console.log(doc.id, doc.data()));
    lastDoc = snap.docs[snap.docs.length - 1];
}
 
async function getNextPage() {
    if (!lastDoc) { console.log('Primero llama getFirstPage()'); return; }
 
    const q = db.collection('game')
        //.orderBy('idGame', 'desc')
        .startAfter(lastDoc)
        .limit(2);
 
    const snap = await q.get();
    if (snap.empty) { console.log('No hay mas paginas'); return }
 
    snap.forEach(doc => console.log(doc.id, doc.data()));
    lastDoc = snap.docs[snap.docs.length - 1]
}
 
await getFirstPage();
await getNextPage();