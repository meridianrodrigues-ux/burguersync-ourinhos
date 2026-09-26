Diretrizes de UI/UX e Engenharia Front-End: BurguerSync Ourinhos1. Visão Geral & Arquitetura VisualO BurguerSync Ourinhos é uma aplicação web de alta performance voltada para pedidos de hambúrgueres artesanais, combinando a agilidade e intuitividade de aplicativos como o iFood com um visual Dark Mode moderno, vibrante e neon.2. Paleta de Cores (Design System)A paleta de cores foi desenvolvida especificamente para garantir contraste acessível (WCAG AA/AAA), foco na foto dos alimentos e destaque para elementos de conversão (CTAs) em tons Neon.2.1 Cores Base (Dark Mode)Background Principal (--bg-main): #0F0F12 — Fundo escuro profundo para máximo contraste.Background de Cards / Elevação 1 (--bg-card): #18181C — Superfície neutra para cards e modais.Background Secundário / Elevação 2 (--bg-surface): #222226 — Inputs, hovers e divisores.Bordas Neutras (--border-color): #2E2E35 — Delimitação sutil de componentes.2.2 Cores Vibrantes & Acentos NeonLaranja Primário Neon (--primary): #FF8C00 — Botões de ação, links, seleções ativas.Amarelo Neon Accent (--accent-yellow): #FFD700 — Destaques de preços, observações importantes, ícones.Verde Confirmação / Sucesso Neon (--success): #00E676 — Botão de finalizar pedido, status "Entregue", feedbacks positivos.Vermelho Alerta / Erro (--danger): #FF3B30 — Remoção de itens, erros de validação, status "Cancelado".Azul Info / Processamento (--info): #00B0FF — Status "Em Preparo", badges informativos.2.3 Tipografia & Neutros de TextoTexto Principal (--text-primary): #F4F4F6 — Leitura principal de altíssima legibilidade.Texto Secundário (--text-secondary): #A0A0B0 — Descrições, rótulos e textos auxiliares.Texto Desabilitado (--text-disabled): #5E5E6E — Placeholders e estados inativos.3. Tipografia & Hierarquia VisualPara garantir leitura fluida tanto em telas de smartphones de baixa resolução quanto em monitores desktop de alta definição, utiliza-se a fonte Inter (ou Roboto / system-ui como fallback).Fonte Primária: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serifEscalamento de Fontes e Pesos (Mobile / Desktop)ElementoTamanho (Mobile)Tamanho (Desktop)Peso (Font-Weight)Altura de Linha (Line-Height)Uso PrincipalDisplay H11.75rem (28px)2.5rem (40px)Bold (700)1.2Títulos principais de tela e HeadersTítulo H21.35rem (21.6px)1.75rem (28px)Semi-Bold (600)1.3Nomes de seções, modais e títulos de cardsSubtítulo H31.1rem (17.6px)1.25rem (20px)Medium (500)1.4Nomes de lanches na vitrineBody (Texto Comum)0.95rem (15.2px)1.0rem (16px)Regular (400)1.5Descrições dos lanches, textos de apoioSmall / Captions0.8rem (12.8px)0.85rem (13.6px)Medium (500)1.4Badges de status, taxas, observaçõesPreços & Destaques1.2rem (19.2px)1.5rem (24px)Bold (700)1.1Valores monetários (R$ XX,XX)4. Estrutura de HTML5 SemânticoAbaixo está a arquitetura estrutural das duas visões principais do sistema: a Visão do Cliente e a Visão da Cozinha, priorizando semântica, acessibilidade e seletores claros.<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BurguerSync Ourinhos</title>
</head>
<body>

    <!-- Header Principal e Alternância de Visão -->
    <header class="main-header">
        <div class="logo-container">
            <h1 class="logo-text">BurguerSync <span>Ourinhos</span></h1>
        </div>
        <nav class="view-switch-nav">
            <button id="btnVisaoCliente" class="btn-switch active">🛍️ Cliente</button>
            <button id="btnVisaoCozinha" class="btn-switch">👨‍🍳 Cozinha</button>
        </nav>
    </header>

    <!-- VISÃO DO CLIENTE -->
    <main id="visaoCliente" class="view-section active">
        
        <!-- Categorias e Vitrine -->
        <section id="vitrine" class="vitrine-container">
            <h2 class="section-title">Nosso Cardápio</h2>
            <div id="listaLanches" class="burgers-grid">
                
                <!-- Card de Lanche (Exemplo) -->
                <article class="burger-card" data-id="1">
                    <div class="burger-image-wrapper">
                        <img src="assets/images/smash.jpg" alt="Ourinhos Smash Burguer" class="burger-img" loading="lazy">
                        <span class="badge-tag">Mais Pedido</span>
                    </div>
                    <div class="burger-info">
                        <h3 class="burger-title">Ourinhos Smash Burguer</h3>
                        <p class="burger-description">Pão brioche selado, 2x smash 80g de blend artesanal, queijo cheddar derretido e bacon crocante.</p>
                        <div class="burger-footer">
                            <span class="burger-price">R$ 28,00</span>
                            <button class="btn-add-cart" data-id="1">+ Adicionar</button>
                        </div>
                    </div>
                </article>

            </div>
        </section>

        <!-- Carrinho de Compras Flutuante / Drawer -->
        <aside id="carrinho" class="cart-drawer">
            <div class="cart-header">
                <h2>Seu Pedido</h2>
                <button id="btnFecharCarrinho" class="btn-close">&times;</button>
            </div>

            <ul id="listaItensCarrinho" class="cart-items-list">
                <!-- Item do Carrinho -->
                <li class="cart-item">
                    <div class="cart-item-details">
                        <span class="cart-item-title">Ourinhos Smash Burguer</span>
                        <span class="cart-item-price">R$ 28,00</span>
                        <input type="text" class="input-obs" placeholder="Obs: Sem cebola, pão bem selado...">
                    </div>
                    <div class="cart-item-qty">
                        <button class="btn-qty-minus">-</button>
                        <span class="qty-number">1</span>
                        <button class="btn-qty-plus">+</button>
                    </div>
                </li>
            </ul>

            <!-- Resumo Financeiro -->
            <div class="cart-summary">
                <div class="summary-line">
                    <span>Subtotal:</span>
                    <span id="subtotalValor">R$ 28,00</span>
                </div>
                <div class="summary-line">
                    <span>Taxa de Entrega:</span>
                    <span id="taxaEntrega">R$ 5,00</span>
                </div>
                <div class="summary-line total">
                    <span>Total:</span>
                    <span id="totalValor">R$ 33,00</span>
                </div>
            </div>

            <!-- Form de Cadastro e Pagamento -->
            <form id="formCheckout" class="checkout-form">
                <h3>Dados para Entrega</h3>
                <div class="form-group">
                    <label for="nomeCliente">Nome Completo</label>
                    <input type="text" id="nomeCliente" required placeholder="Digite seu nome">
                </div>
                
                <div class="form-group">
                    <label for="telefoneCliente">Celular / WhatsApp</label>
                    <input type="tel" id="telefoneCliente" required placeholder="(14) 99999-9999">
                </div>

                <div class="form-group">
                    <label for="enderecoCliente">Endereço de Entrega</label>
                    <input type="text" id="enderecoCliente" required placeholder="Rua, Nº e Bairro">
                </div>

                <div class="form-group">
                    <label for="obsEntrega">Instruções de Entrega</label>
                    <textarea id="obsEntrega" rows="2" placeholder="Ex: Deixar na portaria ou interfone 22"></textarea>
                </div>

                <h3>Forma de Pagamento</h3>
                <div id="tipoPagamento" class="payment-options">
                    <label class="payment-radio">
                        <input type="radio" name="pagamento" value="pix" checked>
                        <span>⚡ Pix (Aprovação Instantânea)</span>
                    </label>
                    <label class="payment-radio">
                        <input type="radio" name="pagamento" value="cartao">
                        <span>💳 Cartão na Entrega</span>
                    </label>
                    <label class="payment-radio">
                        <input type="radio" name="pagamento" value="dinheiro">
                        <span>💵 Dinheiro</span>
                    </label>
                </div>

                <div id="campoTroco" class="form-group hidden">
                    <label for="valorTroco">Precisa de troco para quanto?</label>
                    <input type="number" id="valorTroco" placeholder="Ex: 50,00">
                </div>

                <button type="submit" id="btnFinalizarPedido" class="btn-checkout">
                    Finalizar e Enviar Pedido
                </button>
            </form>
        </aside>

    </main>

    <!-- VISÃO DA COZINHA (Painel Kanban) -->
    <main id="visaoCozinha" class="view-section hidden">
        <div class="kitchen-dashboard">
            <h2 class="section-title">Painel da Cozinha em Tempo Real</h2>
            
            <div id="listaPedidos" class="kitchen-orders-grid">
                
                <!-- Card de Pedido Cozinha -->
                <article class="order-card" data-order-id="101">
                    <header class="order-card-header">
                        <span class="order-id">Pedido #101</span>
                        <span class="order-time">19:42</span>
                    </header>
                    <div class="order-customer-info">
                        <strong>João Silva</strong> - (14) 99876-5432
                        <p class="order-address">Rua Paraná, 450 - Centro</p>
                    </div>
                    <ul class="order-items-list">
                        <li>1x Ourinhos Smash Burguer <span class="item-obs">(Obs: Sem cebola)</span></li>
                        <li>1x Batata Rústica Suprema</li>
                    </ul>
                    <div class="order-status-control">
                        <span class="status-badge status-preparo">Em Preparo</span>
                        <div class="status-actions">
                            <button class="btn-status" data-next="Saiu para Entrega">Próximo ➔</button>
                        </div>
                    </div>
                </article>

            </div>
        </div>
    </main>

</body>
</html>
5. Estilo CSS3 Moderno (Responsive, Mobile-First & Neon Design)/* ==========================================================================
   1. VARIÁVEIS GLOBAIS E RESET
   ========================================================================== */
:root {
    --bg-main: #0F0F12;
    --bg-card: #18181C;
    --bg-surface: #222226;
    --border-color: #2E2E35;

    --primary: #FF8C00;
    --primary-hover: #FFA500;
    --primary-glow: rgba(255, 140, 0, 0.4);

    --accent-yellow: #FFD700;
    --success: #00E676;
    --success-glow: rgba(0, 230, 118, 0.4);
    --danger: #FF3B30;
    --info: #00B0FF;

    --text-primary: #F4F4F6;
    --text-secondary: #A0A0B0;
    --text-disabled: #5E5E6E;

    --font-family: 'Inter', system-ui, -apple-system, sans-serif;
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 20px;
    --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: var(--font-family);
}

body {
    background-color: var(--bg-main);
    color: var(--text-primary);
    line-height: 1.5;
    overflow-x: hidden;
}

.hidden {
    display: none !important;
}

/* ==========================================================================
   2. HEADER & NAVEGAÇÃO
   ========================================================================== */
.main-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    background-color: var(--bg-card);
    border-bottom: 1px solid var(--border-color);
    position: sticky;
    top: 0;
    z-index: 100;
}

.logo-text {
    font-size: 1.25rem;
    font-weight: 700;
}

.logo-text span {
    color: var(--primary);
}

.view-switch-nav {
    display: flex;
    gap: 0.5rem;
    background-color: var(--bg-surface);
    padding: 0.25rem;
    border-radius: var(--radius-sm);
}

.btn-switch {
    background: transparent;
    border: none;
    color: var(--text-secondary);
    padding: 0.5rem 0.85rem;
    font-weight: 600;
    font-size: 0.85rem;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: var(--transition);
}

.btn-switch.active {
    background-color: var(--primary);
    color: #000;
    box-shadow: 0 0 10px var(--primary-glow);
}

/* ==========================================================================
   3. VITRINE DE LANCHES (MOBILE-FIRST GRID)
   ========================================================================== */
.view-section {
    padding: 1.5rem;
    max-width: 1200px;
    margin: 0 auto;
}

.section-title {
    font-size: 1.5rem;
    margin-bottom: 1.25rem;
    color: var(--text-primary);
    position: relative;
}

.burgers-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.25rem;
}

/* Responsive Grid Desktop */
@media (min-width: 768px) {
    .burgers-grid {
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    }
}

.burger-card {
    background-color: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: var(--transition);
}

.burger-card:hover {
    transform: translateY(-4px);
    border-color: var(--primary);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.burger-image-wrapper {
    position: relative;
    width: 100%;
    height: 180px;
}

.burger-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.badge-tag {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: var(--primary);
    color: #000;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
}

.burger-info {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.burger-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.4rem;
}

.burger-description {
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin-bottom: 1rem;
    flex-grow: 1;
}

.burger-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.burger-price {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--accent-yellow);
}

.btn-add-cart {
    background-color: var(--primary);
    color: #000;
    border: none;
    font-weight: 700;
    padding: 0.6rem 1rem;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: var(--transition);
}

.btn-add-cart:hover {
    background-color: var(--primary-hover);
    box-shadow: 0 0 12px var(--primary-glow);
}

/* ==========================================================================
   4. CARRINHO DE COMPRAS & CHECKOUT
   ========================================================================== */
.cart-drawer {
    background-color: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 1.25rem;
    margin-top: 2rem;
}

.cart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 0.75rem;
    margin-bottom: 1rem;
}

.cart-items-list {
    list-style: none;
    margin-bottom: 1rem;
}

.cart-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--bg-surface);
}

.cart-item-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    width: 65%;
}

.cart-item-title {
    font-weight: 600;
    font-size: 0.95rem;
}

.cart-item-price {
    color: var(--accent-yellow);
    font-size: 0.85rem;
}

.input-obs {
    background-color: var(--bg-surface);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    padding: 0.4rem;
    font-size: 0.75rem;
    border-radius: 4px;
    margin-top: 0.25rem;
}

.cart-item-qty {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: var(--bg-surface);
    padding: 0.25rem;
    border-radius: 4px;
}

.btn-qty-minus, .btn-qty-plus {
    background: none;
    border: none;
    color: var(--primary);
    font-weight: bold;
    font-size: 1rem;
    cursor: pointer;
    padding: 0 0.4rem;
}

.cart-summary {
    background-color: var(--bg-surface);
    padding: 1rem;
    border-radius: var(--radius-sm);
    margin-bottom: 1.25rem;
}

.summary-line {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin-bottom: 0.4rem;
}

.summary-line.total {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-primary);
    border-top: 1px solid var(--border-color);
    padding-top: 0.5rem;
    margin-top: 0.5rem;
}

.checkout-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}

.form-group label {
    font-size: 0.85rem;
    color: var(--text-secondary);
}

.form-group input, .form-group textarea {
    background-color: var(--bg-surface);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    padding: 0.75rem;
    border-radius: var(--radius-sm);
    font-size: 0.9rem;
}

.form-group input:focus, .form-group textarea:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 5px var(--primary-glow);
}

.payment-options {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.payment-radio {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: var(--bg-surface);
    padding: 0.75rem;
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-size: 0.875rem;
    border: 1px solid var(--border-color);
}

.btn-checkout {
    background-color: var(--success);
    color: #000;
    font-weight: 700;
    font-size: 1rem;
    padding: 1rem;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: var(--transition);
    margin-top: 0.5rem;
}

.btn-checkout:hover {
    box-shadow: 0 0 15px var(--success-glow);
    transform: scale(1.01);
}

/* ==========================================================================
   5. PAINEL DA COZINHA (STATUS & NEON BADGES)
   ========================================================================== */
.kitchen-orders-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.25rem;
}

@media (min-width: 768px) {
    .kitchen-orders-grid {
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    }
}

.order-card {
    background-color: var(--bg-card);
    border-left: 4px solid var(--primary);
    border-radius: var(--radius-md);
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
}

.order-card-header {
    display: flex;
    justify-content: space-between;
    font-weight: 700;
}

.order-customer-info {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.order-address {
    color: var(--text-primary);
    font-size: 0.8rem;
}

.order-items-list {
    list-style-position: inside;
    background-color: var(--bg-surface);
    padding: 0.75rem;
    border-radius: var(--radius-sm);
    font-size: 0.875rem;
}

.item-obs {
    color: var(--accent-yellow);
    font-size: 0.75rem;
    display: block;
}

.status-badge {
    display: inline-block;
    padding: 0.35rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
}

.status-preparo {
    background-color: rgba(0, 176, 255, 0.15);
    color: var(--info);
    border: 1px solid var(--info);
    box-shadow: 0 0 8px rgba(0, 176, 255, 0.3);
}

.status-entrega {
    background-color: rgba(255, 140, 0, 0.15);
    color: var(--primary);
    border: 1px solid var(--primary);
    box-shadow: 0 0 8px var(--primary-glow);
}

.status-entregue {
    background-color: rgba(0, 230, 118, 0.15);
    color: var(--success);
    border: 1px solid var(--success);
    box-shadow: 0 0 8px var(--success-glow);
}

.btn-status {
    background-color: var(--bg-surface);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    padding: 0.5rem 1rem;
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 600;
    transition: var(--transition);
}

.btn-status:hover {
    border-color: var(--primary);
    color: var(--primary);
}
6. Checklist de Acessibilidade & Experiência de Usuário (UX)Feedback Visual Imediato: Todos os botões interativos contam com transição de hover e efeitos de iluminação (glow) Neon para reforçar a confirmação de clique.Campos Obrigatórios: Destaque em border-color avermelhado/laranja quando houver erro de validação.Persistência Visual: O resumo financeiro do carrinho permanece visível antes da submissão para evitar divergências.Modo Noturno Nativo: Uso de contrastes escuros reduz o cansaço visual do operador da cozinha em ambientes de pouca luz.