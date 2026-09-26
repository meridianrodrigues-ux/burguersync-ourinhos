# 🏗️ Arquitetura do Sistema - BurguerSync Ourinhos

## 📐 Visão Geral (Antigravity 3-Layer Architecture)

```mermaid
graph TD
    subgraph Layer1["Camada 1: Diretivas (SOPs)"]
        D1["/directives/projeto.md"]
        D2["/directives/design/design.md"]
        D3["Google Stitch Design System"]
    end

    subgraph Layer2["Camada 2: Orquestração"]
        O1["Google Antigravity Orquestrador"]
        O2["Self-Annealing & Safe Navigation"]
        O3["Routing & Gestão de Estado"]
    end

    subgraph Layer3["Camada 3: Execução Determinística"]
        E1["Frontend: HTML5 + CSS3 Neon Dark + JS ES6"]
        E2["Backend: Firebase Firestore SDK v10"]
        E3["Deploy: GitHub Pages + GitHub Actions"]
    end

    Layer1 --> Layer2
    Layer2 --> Layer3
```

---

## 🗄️ Esquema do Banco de Dados NoSQL (Firebase Firestore)

### Coleção: `pedidos`

| Campo | Tipo | Descrição | Exemplo |
| :--- | :--- | :--- | :--- |
| `cliente.nome` | String | Nome completo do cliente | "Lucas Ferreira" |
| `cliente.celular` | String | Telefone / WhatsApp de contato | "(14) 99876-5432" |
| `cliente.endereco` | String | Endereço de entrega | "Rua Paraná, 450 - Centro" |
| `cliente.obsEntrega` | String | Observações e referências | "Interfone 42" |
| `itens` | Array<Object> | Lista de produtos selecionados | `[{ nome: "...", preco: 28.00, quantidade: 2 }]` |
| `pagamento.metodo` | String | Forma de pagamento | "Pix", "Cartao_Entrega", "Dinheiro_Entrega" |
| `pagamento.troco` | String/Null | Troco solicitado em dinheiro | "R$ 50,00" ou `null` |
| `valores.subtotal` | Number | Soma dos itens | 56.00 |
| `valores.taxaEntrega` | Number | Taxa fixa de entrega | 5.00 |
| `valores.total` | Number | Valor final a pagar | 61.00 |
| `status` | String | Estado do pedido no Kanban | "Recebido", "Em Preparo", "Saiu para Entrega", "Entregue" |
| `horario` | Timestamp | Timestamp gerado pelo servidor | `serverTimestamp()` |

---

## 🔄 Fluxo de Atualização em Tempo Real

1. **Cliente:** Monta o carrinho na vitrine e clica em **Finalizar e Enviar Pedido**.
2. **Gravação:** Função `addDoc` persiste o documento na coleção `pedidos` do Firestore.
3. **Escuta Realtime:** O painel da cozinha, conectado via `onSnapshot(query(collection, orderBy("horario", "desc")))`, detecta a inserção instantaneamente sem necessidade de refresh (F5).
4. **Operação Kanban:** A equipe da cozinha clica em **Iniciar Preparo ➔**, disparando `updateDoc({ status: "Em Preparo" })`, movendo o card entre as colunas instantaneamente.
