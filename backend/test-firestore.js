/**
 * BurguerSync Ourinhos - Diagnóstico de Conexão Firestore
 */
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf-8') : '';

const getEnv = (key) => {
    const match = envContent.match(new RegExp(`${key}\\s*=\\s*["']?([^"',\\r\\n]+)["']?`));
    return match ? match[1].trim() : '';
};

const firebaseConfig = {
    apiKey: getEnv("FIREBASE_apiKey"),
    authDomain: getEnv("FIREBASE_authDomain"),
    projectId: getEnv("FIREBASE_projectId"),
    storageBucket: getEnv("FIREBASE_storageBucket"),
    messagingSenderId: getEnv("FIREBASE_messagingSenderId"),
    appId: getEnv("FIREBASE_appId")
};

async function testar() {
    console.log("Testando conectividade Firebase...");
    try {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const snapshot = await getDocs(collection(db, "pedidos"));
        console.log("Conexão OK! Total de pedidos no Firestore:", snapshot.size);
    } catch (err) {
        console.log("Resultado do teste:", err.message);
    }
}

testar();
