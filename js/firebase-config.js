/**
 * BurguerSync Ourinhos - Conexão Firebase Modular SDK v10 (ES6 via CDN)
 * Camada 3: Execução e Conectividade
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    onSnapshot, 
    updateDoc, 
    doc, 
    query, 
    orderBy, 
    serverTimestamp,
    enableIndexedDbPersistence
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Credenciais do Firebase (.env)
export const firebaseConfig = {
    apiKey: "AIzaSyDst7hVW71qdgSaQs0O-2DXulxdushQmKU",
    authDomain: "burguersync-meridian.firebaseapp.com",
    projectId: "burguersync-meridian",
    storageBucket: "burguersync-meridian.firebasestorage.app",
    messagingSenderId: "591456028440",
    appId: "1:591456028440:web:8759c4a668ee789adb006d"
};

let app = null;
let db = null;
let isConnected = false;

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    isConnected = true;
    console.log("[BurguerSync] Firebase Inicializado com sucesso:", firebaseConfig.projectId);
} catch (error) {
    console.error("[BurguerSync] Erro ao inicializar Firebase:", error);
}

export { 
    app, 
    db, 
    isConnected,
    collection, 
    addDoc, 
    onSnapshot, 
    updateDoc, 
    doc, 
    query, 
    orderBy, 
    serverTimestamp 
};
