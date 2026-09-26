/**
 * BurguerSync Ourinhos - Aplicação Principal & Lógica de Negócio Realtime
 * Arquitetura de 3 Camadas Antigravity - Resiliência e Auto-Sync
 */
import { 
    db, 
    collection, 
    addDoc, 
    onSnapshot, 
    updateDoc, 
    doc, 
    query, 
    orderBy, 
    serverTimestamp,
    isConnected
} from "./firebase-config.js";

// ==========================================================================
// 1. CATÁLOGO DE PRODUTOS ARTESANAIS (Design System Google Stitch)
// ==========================================================================
export const CARDAPIO = [
    {
        id: "smash-ourinhos",
        nome: "Ourinhos Smash Burguer",
        descricao: "Pão brioche selado, 2x smash 80g de blend artesanal, queijo cheddar inglês derretido e bacon crocante.",
        preco: 28.00,
        imagem: "assets/images/smash.jpg",
        tag: "Mais Pedido"
    },
    {
        id: "bacon-supremo",
        nome: "Bacon Supremo Double",
        descricao: "Blend nobre de 180g, crosta de pimentas, fatias generosas de bacon defumado, cebola caramelizada e molho da casa.",
        preco: 36.00,
        imagem: "assets/images/bacon-burger.jpg",
        tag: "Especial Chef"
    },
    {
        id: "batata-rustica",
        nome: "Batata Rústica com Alecrim",
        descricao: "Batatas crocantes com corte artesanal, sal marinho, alecrim fresco tostado e maionese verde de alho assado.",
        preco: 18.00,
        imagem: "assets/images/batata-rustica.jpg",
        tag: "Porção"
    },
    {
        id: "combo-sync",
        nome: "Combo BurguerSync Completo",
        descricao: "1x Ourinhos Smash Burguer + 1x Batata Rústica individual + 1x Refrigerante Artesanal de Guaraná gelado.",
        preco: 46.00,
        imagem: "assets/images/smash.jpg",
        tag: "Melhor Valor"
    },
    {
        id: "refri-artesanal",
        nome: "Guaraná Artesanal da Região",
        descricao: "Refrigerante natural com extrato puro de guaraná da Amazônia e toque cítrico de limão cravo (Lata 350ml).",
        preco: 8.00,
        imagem: "assets/images/smash.jpg",
        tag: "Bebida"
    },
    {
        id: "milkshake-caramelo",
        nome: "Milkshake Caramelo Flor de Sal",
        descricao: "Sorvete artesanal batido com calda toffee artesanal, finalizado com chantilly e cristais de flor de sal (400ml).",
        preco: 19.00,
        imagem: "assets/images/bacon-burger.jpg",
        tag: "Sobremesa"
    }
];

// ==========================================================================
// 2. ESTADO DA APLICAÇÃO (Carrinho, Fallback Local e Auto-Sync)
// ==========================================================================
const TAXA_ENTREGA = 5.00;
let carrinho = [];
let localPedidosFallback = JSON.parse(localStorage.getItem("burguersync_pedidos_local") || "[]");
let firestorePermissionBlocked = false;
let isSyncing = false;

// ==========================================================================
// 3. ELEMENTOS DOM
// ==========================================================================
const DOM = {
    // Alternância de visão
    btnVisaoCliente: document.getElementById("btnVisaoCliente"),
    btnVisaoCozinha: document.getElementById("btnVisaoCozinha"),
    visaoCliente: document.getElementById("visaoCliente"),
    visaoCozinha: document.getElementById("visaoCozinha"),
    
    // Status de conexão e banners
    statusDot: document.getElementById("statusDot"),
    statusText: document.getElementById("statusText"),
    firestoreAlertBanner: document.getElementById("firestoreAlertBanner"),
    alertBannerTitle: document.getElementById("alertBannerTitle"),
    alertBannerDesc: document.getElementById("alertBannerDesc"),
    pendingOrdersCount: document.getElementById("pendingOrdersCount"),
    btnCopiarRegraFirestore: document.getElementById("btnCopiarRegraFirestore"),
    btnTentarSincronizar: document.getElementById("btnTentarSincronizar"),
    
    // Vitrine
    listaLanches: document.getElementById("listaLanches"),
    
    // Carrinho & Drawer
    btnCartTrigger: document.getElementById("btnCartTrigger"),
    cartCountBadge: document.getElementById("cartCountBadge"),
    cartOverlay: document.getElementById("cartOverlay"),
    cartDrawer: document.getElementById("cartDrawer"),
    btnFecharCarrinho: document.getElementById("btnFecharCarrinho"),
    listaItensCarrinho: document.getElementById("listaItensCarrinho"),
    cartEmptyState: document.getElementById("cartEmptyState"),
    subtotalValor: document.getElementById("subtotalValor"),
    taxaEntrega: document.getElementById("taxaEntrega"),
    totalValor: document.getElementById("totalValor"),
    
    // Checkout form
    formCheckout: document.getElementById("formCheckout"),
    nomeCliente: document.getElementById("nomeCliente"),
    telefoneCliente: document.getElementById("telefoneCliente"),
    enderecoCliente: document.getElementById("enderecoCliente"),
    obsEntrega: document.getElementById("obsEntrega"),
    radiosPagamento: document.querySelectorAll('input[name="pagamento"]'),
    campoTroco: document.getElementById("campoTroco"),
    valorTroco: document.getElementById("valorTroco"),
    btnFinalizarPedido: document.getElementById("btnFinalizarPedido"),
    
    // Cozinha Kanban
    colRecebidos: document.getElementById("colRecebidos"),
    colPreparo: document.getElementById("colPreparo"),
    colEntrega: document.getElementById("colEntrega"),
    countRecebidos: document.getElementById("countRecebidos"),
    countPreparo: document.getElementById("countPreparo"),
    countEntrega: document.getElementById("countEntrega"),
    totalPedidosHoje: document.getElementById("totalPedidosHoje"),
    
    // Modal Confirmação
    modalConfirmacao: document.getElementById("modalConfirmacao"),
    modalPedidoId: document.getElementById("modalPedidoId"),
    modalTotal: document.getElementById("modalTotal"),
    modalMetodoPagamento: document.getElementById("modalMetodoPagamento"),
    pixArea: document.getElementById("pixArea"),
    pixCodeInput: document.getElementById("pixCodeInput"),
    btnCopiarPix: document.getElementById("btnCopiarPix"),
    btnFecharModal: document.getElementById("btnFecharModal")
};

// ==========================================================================
// 4. INICIALIZAÇÃO DA APLICAÇÃO
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    renderizarCardapio();
    inicializarEventos();
    atualizarCarrinhoUI();
    iniciarEscutaCozinha();
    verificarStatusConexao();
    atualizarContadorFila();

    // Auto-sync em background a cada 10 segundos
    setInterval(sincronizarFilaPedidosLocais, 10000);
});

// ==========================================================================
// 5. RENDERIZAÇÃO DO CARDÁPIO
// ==========================================================================
function renderizarCardapio() {
    if (!DOM.listaLanches) return;
    
    DOM.listaLanches.innerHTML = CARDAPIO.map(item => `
        <article class="burger-card" data-id="${item.id}">
            <div class="burger-image-wrapper">
                <img src="${item.imagem}" alt="${item.nome}" class="burger-img" loading="lazy" onerror="this.src='assets/images/smash.jpg'">
                <span class="badge-tag">${item.tag}</span>
            </div>
            <div class="burger-info">
                <h3 class="burger-title">${item.nome}</h3>
                <p class="burger-description">${item.descricao}</p>
                <div class="burger-footer">
                    <span class="burger-price">R$ ${item.preco.toFixed(2).replace('.', ',')}</span>
                    <button class="btn-add-cart" data-id="${item.id}">
                        <span>+</span> Adicionar
                    </button>
                </div>
            </div>
        </article>
    `).join('');
}

// ==========================================================================
// 6. GERENCIAMENTO DO CARRINHO
// ==========================================================================
function adicionarAoCarrinho(produtoId) {
    const produto = CARDAPIO.find(p => p.id === produtoId);
    if (!produto) return;

    const itemExistente = carrinho.find(item => item.id === produtoId);
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            quantidade: 1,
            obsItem: ""
        });
    }

    atualizarCarrinhoUI();
    abrirCarrinho();
}

function alterarQuantidade(index, delta) {
    if (!carrinho[index]) return;
    carrinho[index].quantidade += delta;
    if (carrinho[index].quantidade <= 0) {
        carrinho.splice(index, 1);
    }
    atualizarCarrinhoUI();
}

function removerItem(index) {
    carrinho.splice(index, 1);
    atualizarCarrinhoUI();
}

function atualizarObsItem(index, texto) {
    if (carrinho[index]) {
        carrinho[index].obsItem = texto;
    }
}

function atualizarCarrinhoUI() {
    const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    const subtotal = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    const total = totalItens > 0 ? subtotal + TAXA_ENTREGA : 0;

    if (DOM.cartCountBadge) {
        DOM.cartCountBadge.textContent = totalItens;
    }

    if (DOM.subtotalValor) DOM.subtotalValor.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    if (DOM.taxaEntrega) DOM.taxaEntrega.textContent = totalItens > 0 ? `R$ ${TAXA_ENTREGA.toFixed(2).replace('.', ',')}` : "R$ 0,00";
    if (DOM.totalValor) DOM.totalValor.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;

    if (!DOM.listaItensCarrinho) return;

    if (carrinho.length === 0) {
        DOM.listaItensCarrinho.innerHTML = '';
        DOM.cartEmptyState?.classList.remove('hidden');
        if (DOM.btnFinalizarPedido) DOM.btnFinalizarPedido.disabled = true;
    } else {
        DOM.cartEmptyState?.classList.add('hidden');
        if (DOM.btnFinalizarPedido) DOM.btnFinalizarPedido.disabled = false;

        DOM.listaItensCarrinho.innerHTML = carrinho.map((item, idx) => `
            <li class="cart-item">
                <div class="cart-item-top">
                    <span class="cart-item-title">${item.nome}</span>
                    <span class="cart-item-price">R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</span>
                </div>
                <input type="text" class="input-obs" placeholder="Obs: Sem cebola, ponto da carne..." value="${item.obsItem || ''}" data-idx="${idx}">
                <div class="cart-item-bottom">
                    <div class="cart-item-qty">
                        <button type="button" class="btn-qty btn-minus" data-idx="${idx}">-</button>
                        <span class="qty-number">${item.quantidade}</span>
                        <button type="button" class="btn-qty btn-plus" data-idx="${idx}">+</button>
                    </div>
                    <button type="button" class="btn-remove-item" data-idx="${idx}">🗑️ Remover</button>
                </div>
            </li>
        `).join('');

        DOM.listaItensCarrinho.querySelectorAll('.input-obs').forEach(input => {
            input.addEventListener('input', (e) => {
                const idx = parseInt(e.target.dataset.idx, 10);
                atualizarObsItem(idx, e.target.value);
            });
        });

        DOM.listaItensCarrinho.querySelectorAll('.btn-minus').forEach(btn => {
            btn.addEventListener('click', () => alterarQuantidade(parseInt(btn.dataset.idx, 10), -1));
        });
        DOM.listaItensCarrinho.querySelectorAll('.btn-plus').forEach(btn => {
            btn.addEventListener('click', () => alterarQuantidade(parseInt(btn.dataset.idx, 10), 1));
        });
        DOM.listaItensCarrinho.querySelectorAll('.btn-remove-item').forEach(btn => {
            btn.addEventListener('click', () => removerItem(parseInt(btn.dataset.idx, 10)));
        });
    }
}

function abrirCarrinho() {
    DOM.cartDrawer?.classList.add('open');
    DOM.cartOverlay?.classList.remove('hidden');
}

function fecharCarrinho() {
    DOM.cartDrawer?.classList.remove('open');
    DOM.cartOverlay?.classList.add('hidden');
}

// ==========================================================================
// 7. ENVIO DE PEDIDO (CHECKOUT COM SELF-ANNEALING NO FIRESTORE)
// ==========================================================================
async function finalizarPedido(e) {
    e.preventDefault();

    if (carrinho.length === 0) {
        alert("Adicione pelo menos um item ao carrinho antes de finalizar.");
        return;
    }

    const nome = DOM.nomeCliente.value.trim();
    const celular = DOM.telefoneCliente.value.trim();
    const endereco = DOM.enderecoCliente.value.trim();
    const obsEntrega = DOM.obsEntrega.value.trim();

    if (!nome || !celular || !endereco) {
        alert("Por favor, preencha todos os campos obrigatórios de entrega.");
        return;
    }

    const metodoPagamentoSelecionado = document.querySelector('input[name="pagamento"]:checked')?.value || 'pix';
    const troco = metodoPagamentoSelecionado === 'dinheiro' ? (DOM.valorTroco.value.trim() || 'Sem troco') : null;

    const subtotal = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    const total = subtotal + TAXA_ENTREGA;

    const novoPedido = {
        cliente: {
            nome,
            celular,
            endereco,
            obsEntrega: obsEntrega || "Sem observações adicionais"
        },
        itens: carrinho.map(item => ({
            nome: item.nome,
            preco: item.preco,
            quantidade: item.quantidade,
            obsItem: item.obsItem || ""
        })),
        pagamento: {
            metodo: formatarMetodoPagamento(metodoPagamentoSelecionado),
            troco: troco
        },
        valores: {
            subtotal,
            taxaEntrega: TAXA_ENTREGA,
            total
        },
        status: "Recebido",
        horario: serverTimestamp(),
        synced: false
    };

    DOM.btnFinalizarPedido.disabled = true;
    DOM.btnFinalizarPedido.textContent = "⏳ Enviando Pedido...";

    let pedidoId = "BS-" + Math.floor(1000 + Math.random() * 9000);

    try {
        if (db && isConnected) {
            const docRef = await addDoc(collection(db, "pedidos"), novoPedido);
            pedidoId = docRef.id.substring(0, 7).toUpperCase();
            console.log("[BurguerSync] Pedido salvo diretamente no Firestore! ID:", docRef.id);
            registrarStatusConexao(true, "Conectado e gravando no Firebase Cloud Firestore");
            esconderAlertaFirestore();
        } else {
            throw new Error("Conexão Firestore indisponível. Ativando fallback resiliente.");
        }
    } catch (err) {
        console.warn("[BurguerSync Resiliência] Fallback ativado:", err.message);
        firestorePermissionBlocked = true;
        exibirAlertaFirestore("O Firebase Firestore bloqueou a gravação na nuvem (PERMISSION_DENIED). Seu pedido foi salvo no cache local e será sincronizado assim que a regra for liberada.");

        // Salvar no armazenamento local garantindo continuidade do fluxo de atendimento
        const pedidoLocal = {
            ...novoPedido,
            id: pedidoId,
            synced: false,
            horarioLocal: new Date().toISOString()
        };
        localPedidosFallback.unshift(pedidoLocal);
        localStorage.setItem("burguersync_pedidos_local", JSON.stringify(localPedidosFallback));
        
        atualizarContadorFila();
        renderizarPainelCozinha(localPedidosFallback);
    } finally {
        exibirModalSucesso(pedidoId, total, metodoPagamentoSelecionado);

        carrinho = [];
        DOM.formCheckout.reset();
        DOM.campoTroco.classList.add('hidden');
        atualizarCarrinhoUI();
        fecharCarrinho();
        DOM.btnFinalizarPedido.disabled = false;
        DOM.btnFinalizarPedido.innerHTML = `<span>🚀</span> Finalizar e Enviar Pedido`;
    }
}

function formatarMetodoPagamento(valor) {
    switch (valor) {
        case 'pix': return 'Pix';
        case 'cartao': return 'Cartao_Entrega';
        case 'dinheiro': return 'Dinheiro_Entrega';
        default: return 'Pix';
    }
}

// ==========================================================================
// 8. ESCUTADOR REALTIME DA COZINHA (onSnapshot COM SAFE NAVIGATION)
// ==========================================================================
function iniciarEscutaCozinha() {
    if (!db || !isConnected) {
        console.warn("[BurguerSync] Firestore não conectado no momento. Utilizando pedidos em cache.");
        renderizarPainelCozinha(localPedidosFallback);
        return;
    }

    try {
        const q = query(collection(db, "pedidos"), orderBy("horario", "desc"));

        onSnapshot(q, (snapshot) => {
            const pedidos = [];
            snapshot.forEach((docSnap) => {
                pedidos.push({
                    id: docSnap.id,
                    ...docSnap.data(),
                    synced: true
                });
            });
            console.log(`[BurguerSync Realtime] ${pedidos.length} pedidos recebidos via Firestore.`);
            firestorePermissionBlocked = false;
            registrarStatusConexao(true, "Sincronizado em Tempo Real com Firestore");
            
            // Mesclar pedidos não sincronizados locais caso existam
            const pendentes = localPedidosFallback.filter(p => !p.synced);
            const combinados = [...pendentes, ...pedidos];
            renderizarPainelCozinha(combinados);

            if (pendentes.length > 0) {
                sincronizarFilaPedidosLocais();
            } else {
                esconderAlertaFirestore();
            }
        }, (error) => {
            console.error("[BurguerSync Realtime Erro]:", error.message);
            firestorePermissionBlocked = true;
            exibirAlertaFirestore("O Firebase Firestore bloqueou a leitura em tempo real (PERMISSION_DENIED). Operando com persistência local.");
            renderizarPainelCozinha(localPedidosFallback);
        });
    } catch (err) {
        console.error("[BurguerSync Falha na Escuta]:", err);
        renderizarPainelCozinha(localPedidosFallback);
    }
}

// ==========================================================================
// 9. AUTO-SYNC: SINCRONIZAÇÃO DETERMINÍSTICA DA FILA LOCAL
// ==========================================================================
async function sincronizarFilaPedidosLocais() {
    if (isSyncing || !db || !isConnected) return;

    const pedidosPendentes = localPedidosFallback.filter(p => !p.synced);
    if (pedidosPendentes.length === 0) {
        atualizarContadorFila();
        return;
    }

    isSyncing = true;
    console.log(`[BurguerSync Auto-Sync] Tentando sincronizar ${pedidosPendentes.length} pedidos pendentes com o Firestore...`);

    try {
        // Testar com o primeiro pedido
        for (const pedido of pedidosPendentes) {
            const pedidoParaGravar = {
                cliente: pedido.cliente,
                itens: pedido.itens,
                pagamento: pedido.pagamento,
                valores: pedido.valores,
                status: pedido.status || "Recebido",
                horario: serverTimestamp()
            };

            const docRef = await addDoc(collection(db, "pedidos"), pedidoParaGravar);
            console.log(`[BurguerSync Auto-Sync] Pedido sincronizado com Firestore! ID: ${docRef.id}`);
            pedido.synced = true;
            pedido.id = docRef.id;
        }

        // Salvar status atualizado no localStorage
        localStorage.setItem("burguersync_pedidos_local", JSON.stringify(localPedidosFallback));
        firestorePermissionBlocked = false;
        
        if (DOM.firestoreAlertBanner) {
            DOM.firestoreAlertBanner.className = "firestore-alert-banner success";
            DOM.alertBannerTitle.textContent = "🎉 Sincronização em Nuvem Concluída!";
            DOM.alertBannerDesc.textContent = "Todos os pedidos locais foram transferidos com sucesso para o banco de dados Firebase Cloud Firestore.";
            setTimeout(() => {
                esconderAlertaFirestore();
            }, 4000);
        }

        atualizarContadorFila();
        registrarStatusConexao(true, "Firebase Cloud Firestore Ativo & Sincronizado");
    } catch (err) {
        console.warn("[BurguerSync Auto-Sync] Falha na sincronização (regras ainda restritas):", err.message);
        firestorePermissionBlocked = true;
        exibirAlertaFirestore("O Firebase Firestore ainda está bloqueando a gravação (PERMISSION_DENIED). Seus pedidos continuam salvos com segurança no cache local e serão reenviados assim que a regra for publicada.");
    } finally {
        isSyncing = false;
    }
}

function exibirAlertaFirestore(mensagem) {
    if (!DOM.firestoreAlertBanner) return;
    DOM.firestoreAlertBanner.classList.remove('hidden');
    DOM.firestoreAlertBanner.className = "firestore-alert-banner";
    if (DOM.alertBannerTitle) DOM.alertBannerTitle.textContent = "Aviso de Sincronização Firebase Firestore";
    if (DOM.alertBannerDesc) DOM.alertBannerDesc.innerHTML = `
        <strong>Causa Raiz:</strong> Regras de segurança do Firestore bloqueando leitura/gravação (<strong>PERMISSION_DENIED</strong>).<br>
        <strong>Ação:</strong> Acesse o <strong>Firebase Console &gt; Firestore Database &gt; Rules</strong> e atualize para:<br>
        <code style="display:block; background:#111; padding:0.5rem; border-radius:4px; margin:0.4rem 0; font-family:monospace; color:var(--accent-yellow);">allow read, write: if true;</code>
        <em>${mensagem}</em>
    `;
    atualizarContadorFila();
}

function esconderAlertaFirestore() {
    if (!DOM.firestoreAlertBanner) return;
    const pendentes = localPedidosFallback.filter(p => !p.synced);
    if (pendentes.length === 0) {
        DOM.firestoreAlertBanner.classList.add('hidden');
    }
}

function atualizarContadorFila() {
    const pendentes = localPedidosFallback.filter(p => !p.synced);
    if (DOM.pendingOrdersCount) {
        DOM.pendingOrdersCount.textContent = `${pendentes.length} pedidos em fila`;
        DOM.pendingOrdersCount.style.display = pendentes.length > 0 ? "inline-block" : "none";
    }
}

// ==========================================================================
// 10. RENDERIZAÇÃO DO PAINEL KANBAN DA COZINHA (SAFE NAVIGATION)
// ==========================================================================
function renderizarPainelCozinha(pedidos) {
    if (!DOM.colRecebidos || !DOM.colPreparo || !DOM.colEntrega) return;

    const recebidos = [];
    const preparo = [];
    const entrega = [];

    pedidos.forEach(p => {
        const status = p.status || "Recebido";
        if (status === "Recebido") recebidos.push(p);
        else if (status === "Em Preparo") preparo.push(p);
        else if (status === "Saiu para Entrega" || status === "Entregue") entrega.push(p);
    });

    if (DOM.countRecebidos) DOM.countRecebidos.textContent = recebidos.length;
    if (DOM.countPreparo) DOM.countPreparo.textContent = preparo.length;
    if (DOM.countEntrega) DOM.countEntrega.textContent = entrega.length;
    if (DOM.totalPedidosHoje) DOM.totalPedidosHoje.textContent = pedidos.length;

    DOM.colRecebidos.innerHTML = recebidos.length ? recebidos.map(p => criarCardPedidoHTML(p)).join('') : '<p class="text-secondary" style="padding:1rem;text-align:center;font-size:0.85rem">Nenhum pedido novo</p>';
    DOM.colPreparo.innerHTML = preparo.length ? preparo.map(p => criarCardPedidoHTML(p)).join('') : '<p class="text-secondary" style="padding:1rem;text-align:center;font-size:0.85rem">Nenhum pedido em preparo</p>';
    DOM.colEntrega.innerHTML = entrega.length ? entrega.map(p => criarCardPedidoHTML(p)).join('') : '<p class="text-secondary" style="padding:1rem;text-align:center;font-size:0.85rem">Nenhum pedido para entrega</p>';

    document.querySelectorAll('.btn-status-action').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const pedidoId = e.currentTarget.dataset.id;
            const proximoStatus = e.currentTarget.dataset.next;
            await atualizarStatusPedido(pedidoId, proximoStatus);
        });
    });
}

function criarCardPedidoHTML(pedido) {
    const clienteNome = pedido.cliente?.nome || "Cliente Anônimo";
    const clienteCelular = pedido.cliente?.celular || "Sem telefone";
    const clienteEndereco = pedido.cliente?.endereco || "Retirada no balcão";
    const obsEntrega = pedido.cliente?.obsEntrega || "";

    let horaFormatada = "Agora";
    try {
        if (pedido.horario?.toDate) {
            const date = pedido.horario.toDate();
            horaFormatada = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        } else if (pedido.horarioLocal) {
            const date = new Date(pedido.horarioLocal);
            horaFormatada = isNaN(date.getTime()) ? "Agora" : date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        } else if (pedido.horario) {
            const date = new Date(pedido.horario);
            horaFormatada = isNaN(date.getTime()) ? "Agora" : date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        }
    } catch {
        horaFormatada = "Agora";
    }

    const itens = Array.isArray(pedido.itens) ? pedido.itens : [];
    const total = pedido.valores?.total ? `R$ ${pedido.valores.total.toFixed(2).replace('.', ',')}` : "R$ 0,00";
    const idCurto = pedido.id ? pedido.id.substring(0, 6).toUpperCase() : "101";
    const status = pedido.status || "Recebido";
    const syncBadge = pedido.synced === false ? `<span class="badge-tag" style="position:static;background:var(--accent-yellow);color:#000;font-size:0.65rem;">Cache Local</span>` : `<span class="badge-tag" style="position:static;background:var(--success);color:#000;font-size:0.65rem;">Cloud Firestore</span>`;

    let botoesAcao = '';
    if (status === "Recebido") {
        botoesAcao = `<button class="btn-status-action" data-id="${pedido.id}" data-next="Em Preparo">Iniciar Preparo ➔</button>`;
    } else if (status === "Em Preparo") {
        botoesAcao = `<button class="btn-status-action" data-id="${pedido.id}" data-next="Saiu para Entrega">Despachar Entrega ➔</button>`;
    } else if (status === "Saiu para Entrega") {
        botoesAcao = `<button class="btn-status-action success" data-id="${pedido.id}" data-next="Entregue">Finalizar Pedido ✔</button>`;
    } else {
        botoesAcao = `<span class="status-badge entregue">Entregue</span>`;
    }

    return `
        <article class="order-card status-${status.replace(/\s+/g, '_')}" data-id="${pedido.id}">
            <header class="order-card-header">
                <div>
                    <span class="order-id">#${idCurto}</span>
                    ${syncBadge}
                </div>
                <span class="order-time">⏰ ${horaFormatada}</span>
            </header>
            
            <div class="order-customer-info">
                <div class="order-customer-name">${clienteNome} <span class="order-customer-phone">(${clienteCelular})</span></div>
                <div class="order-customer-addr">📍 ${clienteEndereco}</div>
                ${obsEntrega ? `<div style="font-size:0.75rem;color:var(--accent-yellow);margin-top:0.25rem;">💬 ${obsEntrega}</div>` : ''}
            </div>

            <ul class="order-items-list">
                ${itens.map(it => `
                    <li class="order-item-line">
                        <div>
                            <span class="order-item-qty">${it.quantidade}x</span>
                            <span>${it.nome}</span>
                            ${it.obsItem ? `<span class="order-item-obs">Obs: ${it.obsItem}</span>` : ''}
                        </div>
                        <span>R$ ${(it.preco * it.quantidade).toFixed(2).replace('.', ',')}</span>
                    </li>
                `).join('')}
            </ul>

            <div class="order-card-footer">
                <span class="order-total-badge">${total} (${pedido.pagamento?.metodo || 'Pix'})</span>
                <div class="status-actions">
                    ${botoesAcao}
                </div>
            </div>
        </article>
    `;
}

// ==========================================================================
// 11. ATUALIZAÇÃO DE STATUS (updateDoc COM FALLBACK)
// ==========================================================================
async function atualizarStatusPedido(pedidoId, proximoStatus) {
    try {
        if (db && isConnected) {
            const pedidoRef = doc(db, "pedidos", pedidoId);
            await updateDoc(pedidoRef, { status: proximoStatus });
            console.log(`[BurguerSync] Pedido ${pedidoId} alterado para: ${proximoStatus}`);
        } else {
            throw new Error("Offline ou Firebase desabilitado");
        }
    } catch (err) {
        console.warn("[BurguerSync] Atualizando status no cache local:", err.message);
        const pedido = localPedidosFallback.find(p => p.id === pedidoId);
        if (pedido) {
            pedido.status = proximoStatus;
            localStorage.setItem("burguersync_pedidos_local", JSON.stringify(localPedidosFallback));
            renderizarPainelCozinha(localPedidosFallback);
        }
    }
}

// ==========================================================================
// 12. MODAL E FEEDBACK DE SUCESSO
// ==========================================================================
function exibirModalSucesso(id, total, metodo) {
    if (!DOM.modalConfirmacao) return;

    if (DOM.modalPedidoId) DOM.modalPedidoId.textContent = `#${id}`;
    if (DOM.modalTotal) DOM.modalTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    
    if (DOM.modalMetodoPagamento) {
        DOM.modalMetodoPagamento.textContent = formatarMetodoPagamento(metodo);
    }

    if (metodo === 'pix') {
        DOM.pixArea?.classList.remove('hidden');
        if (DOM.pixCodeInput) {
            DOM.pixCodeInput.value = `00020126580014BR.GOV.BCB.PIX0136burguersync-ourinhos@pix.com.br520400005303986540${total.toFixed(2)}5802BR5919BURGUERSYNC OURINHOS6008OURINHOS62070503***6304`;
        }
    } else {
        DOM.pixArea?.classList.add('hidden');
    }

    DOM.modalConfirmacao.classList.remove('hidden');
}

function fecharModalSucesso() {
    DOM.modalConfirmacao?.classList.add('hidden');
}

// ==========================================================================
// 13. EVENTOS E INTERAÇÃO DO USUÁRIO
// ==========================================================================
function inicializarEventos() {
    DOM.btnVisaoCliente?.addEventListener('click', () => alternarVisao('cliente'));
    DOM.btnVisaoCozinha?.addEventListener('click', () => alternarVisao('cozinha'));

    DOM.listaLanches?.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-add-cart');
        if (btn) {
            const produtoId = btn.dataset.id;
            adicionarAoCarrinho(produtoId);
        }
    });

    DOM.btnCartTrigger?.addEventListener('click', abrirCarrinho);
    DOM.btnFecharCarrinho?.addEventListener('click', fecharCarrinho);
    DOM.cartOverlay?.addEventListener('click', fecharCarrinho);

    DOM.radiosPagamento?.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'dinheiro') {
                DOM.campoTroco?.classList.remove('hidden');
            } else {
                DOM.campoTroco?.classList.add('hidden');
            }
        });
    });

    DOM.formCheckout?.addEventListener('submit', finalizarPedido);
    DOM.btnFecharModal?.addEventListener('click', fecharModalSucesso);
    
    DOM.btnCopiarPix?.addEventListener('click', () => {
        if (DOM.pixCodeInput) {
            DOM.pixCodeInput.select();
            navigator.clipboard.writeText(DOM.pixCodeInput.value).then(() => {
                DOM.btnCopiarPix.textContent = "✔ Copiado!";
                setTimeout(() => {
                    DOM.btnCopiarPix.textContent = "Copiar Código";
                }, 2000);
            });
        }
    });

    // Copiar Regra do Firestore
    DOM.btnCopiarRegraFirestore?.addEventListener('click', () => {
        const regra = `rules_version = '2';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    match /{document=**} {\n      allow read, write: if true;\n    }\n  }\n}`;
        navigator.clipboard.writeText(regra).then(() => {
            DOM.btnCopiarRegraFirestore.textContent = "✔ Regra Copiada!";
            setTimeout(() => {
                DOM.btnCopiarRegraFirestore.textContent = "📋 Copiar Regra do Firestore";
            }, 3000);
        });
    });

    // Botão Tentar Sincronizar Agora
    DOM.btnTentarSincronizar?.addEventListener('click', async () => {
        DOM.btnTentarSincronizar.textContent = "⏳ Sincronizando...";
        DOM.btnTentarSincronizar.disabled = true;
        await sincronizarFilaPedidosLocais();
        DOM.btnTentarSincronizar.textContent = "🔄 Tentar Sincronizar Agora";
        DOM.btnTentarSincronizar.disabled = false;
    });
}

function alternarVisao(visao) {
    if (visao === 'cliente') {
        DOM.btnVisaoCliente?.classList.add('active');
        DOM.btnVisaoCozinha?.classList.remove('active');
        DOM.visaoCliente?.classList.remove('hidden');
        DOM.visaoCozinha?.classList.add('hidden');
        DOM.btnCartTrigger?.classList.remove('hidden');
    } else {
        DOM.btnVisaoCozinha?.classList.add('active');
        DOM.btnVisaoCliente?.classList.remove('active');
        DOM.visaoCozinha?.classList.remove('hidden');
        DOM.visaoCliente?.classList.add('hidden');
        DOM.btnCartTrigger?.classList.add('hidden');
    }
}

function verificarStatusConexao() {
    if (isConnected) {
        registrarStatusConexao(true, "Firebase Cloud Firestore Conectado");
    } else {
        registrarStatusConexao(false, "Modo Local Resiliente Ativo");
    }
}

function registrarStatusConexao(online, mensagem) {
    if (DOM.statusDot) {
        DOM.statusDot.className = online ? "status-dot" : "status-dot offline";
    }
    if (DOM.statusText) {
        DOM.statusText.textContent = mensagem;
    }
}
