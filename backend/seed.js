/**
 * BurguerSync Ourinhos - Script de Carga & Simulação no Firebase Firestore
 * Camada 3: Execução Determinística
 */
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import * as fs from 'fs';
import * as path from 'path';

// Carregar variáveis do .env
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

console.log("=================================================");
console.log("🍔 BurguerSync Ourinhos - Carga Inicial Firestore");
console.log("Projeto:", firebaseConfig.projectId);
console.log("=================================================");

async function executarSeed() {
    try {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        const pedidosSimulados = [
            {
                cliente: {
                    nome: "Lucas Ferreira",
                    celular: "(14) 99876-5432",
                    endereco: "Rua Paraná, 450 - Centro",
                    obsEntrega: "Interfone 42, deixar na portaria"
                },
                itens: [
                    { nome: "Ourinhos Smash Burguer", preco: 28.00, quantidade: 2, obsItem: "Sem cebola" },
                    { nome: "Batata Rústica com Alecrim", preco: 18.00, quantidade: 1, obsItem: "Maionese à parte" }
                ],
                pagamento: { metodo: "Pix", troco: null },
                valores: { subtotal: 74.00, taxaEntrega: 5.00, total: 79.00 },
                status: "Recebido",
                horario: serverTimestamp()
            },
            {
                cliente: {
                    nome: "Mariana Souza",
                    celular: "(14) 98112-3344",
                    endereco: "Av. Altino Arantes, 1200 - Vila Nova",
                    obsEntrega: "Casa com portão preto"
                },
                itens: [
                    { nome: "Bacon Supremo Double", preco: 36.00, quantidade: 1, obsItem: "Ponto da carne ao ponto para bem" },
                    { nome: "Guaraná Artesanal da Região", preco: 8.00, quantidade: 1, obsItem: "Bem gelado" }
                ],
                pagamento: { metodo: "Cartao_Entrega", troco: null },
                valores: { subtotal: 44.00, taxaEntrega: 5.00, total: 49.00 },
                status: "Em Preparo",
                horario: serverTimestamp()
            }
        ];

        console.log(`Inserindo ${pedidosSimulados.length} pedidos de teste...`);
        for (const pedido of pedidosSimulados) {
            const docRef = await addDoc(collection(db, "pedidos"), pedido);
            console.log(`✔ Pedido criado para ${pedido.cliente.nome} | ID: ${docRef.id}`);
        }

        const snapshot = await getDocs(collection(db, "pedidos"));
        console.log(`\n🎉 Total de pedidos na base: ${snapshot.size}`);
    } catch (err) {
        console.error("\n❌ Erro durante o seed:", err.message);
        if (err.message.includes("PERMISSION_DENIED")) {
            console.log("\n⚠️ DICA DE PERMISSÃO FIRESTORE:");
            console.log("No console do Firebase (https://console.firebase.google.com):");
            console.log("Acesse Firestore Database > Rules e defina temporariamente para testes:");
            console.log("allow read, write: if true;");
        }
    }
}

executarSeed();
