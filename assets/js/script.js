/* ==========================================================================
LIFE SIM - SISTEMA PRINCIPAL DO JOGO
   ========================================================================== */

/* --------------------------------------------------------------------------
1. DADOS E CONFIGURAÇÕES
   -------------------------------------------------------------------------- */
const empregos = [
    { id: 1, cargo: "Lixeiro", salario: 1000, sono: 1, payday: 30000 },
    { id: 2, cargo: "Motorista", salario: 2000, sono: 1, payday: 30000 },
    { id: 3, cargo: "Desenvolvedor", salario: 3500, sono: 1, payday: 30000 },
    { id: 4, cargo: "Eletricista", salario: 3500, sono: 1, payday: 30000 },
    { id: 5, cargo: "Atendente", salario: 1500, sono: 1, payday: 30000 },
    { id: 6, cargo: "Operador", salario: 1700, sono: 1, payday: 30000 }
];

const produtos_mercado = [
    { id: 1, produto: "Hamburguer", valor: 30 },
    { id: 2, produto: "Pizza", valor: 35 },
    { id: 3, produto: "Agua", valor: 6 },
    { id: 4, produto: "Coca", valor: 12 },
    { id: 5, produto: "Arroz", valor: 20 },
    { id: 6, produto: "Feijao", valor: 20 },
    { id: 7, produto: "Bolacha", valor: 5 },
    { id: 8, produto: "Café", valor: 10 },
    { id: 9, produto: "Energetico", valor: 25 }
];

const loja_produtos = [
    { id: 1, produto: "Celular", valor: 30 },
    { id: 2, produto: "Carro", valor: 35 },
    { id: 3, produto: "Cama", valor: 6 },
    { id: 4, produto: "Moto", valor: 12 },
    { id: 5, produto: "CineGripe", valor: 12 },
    { id: 6, produto: "Dorflex", valor: 12 }
];

const VALORES_INICIAIS = { lifeFill: 100, hungryFill: 100, sleepFill: 100 };
const taxaDecaimento = { lifeFill: 1, hungryFill: 1, sleepFill: 1 };
const doencas = { Dor_de_Cabeca: -1, Febre: -1, Covid: -3, Dengue: -2, Gripe: -2 };
const recompensa = [300, 400, 500, 120, 23, 540, 200, 100];

const tarefasProfissoes = {
    Eletricista: [
        { instr: "⚡ A energia caiu! Ligue o disjuntor geral.", label: "Ligar Disjuntor" },
        { instr: "🔌 Resolver curto-circuito na sala.", label: "Consertar Curto" },
        { instr: "Ar-Condicionado parou de funcionar.", label: "Verificar Desarme" },
        { instr: "Motor não está funcionando.", label: "Rearmar Inversor" },
        { instr: "Emende 2 Cabos 2.5mm².", label: "Fazer Emenda" }
    ],
    Lixeiro: [
        { instr: "🗑️ Sacos de lixo acumulados na calçada.", label: "Recolher Lixo" },
        { instr: "🚛 Rota extra precisa ser feita hoje.", label: "Fazer Rota" }
    ],
    Desenvolvedor: [
        { instr: "🐛 Um bug crítico parou a produção!", label: "Corrigir Código" },
        { instr: "⚙️ Deploy travado, finalize o hotfix.", label: "Aplicar Hotfix" }
    ],
    Motorista: [{ instr: "🚚 Entrega atrasada, entregue rápido.", label: "Entregar Encomenda" }],
    Atendente: [{ instr: "🧾 Caixa cheio, organize e feche o turno.", label: "Fechar Caixa" }],
    Operador: [{ instr: "🔧 Ajuste na máquina principal.", label: "Ajustar Máquina" }]
};

/* --------------------------------------------------------------------------
   2. ESTADO DO JOGO
   -------------------------------------------------------------------------- */
let statusJogo = { ...VALORES_INICIAIS };
let jogoAtivo = true;
let dinheiro = 50;
let empregoAtual = null;
let intervaloSalario = null;
let dia = 0;
let doencaAtual = { nome: null, impacto: 0 };
let geladeira = [];

/* --------------------------------------------------------------------------
   3. SISTEMA DE MODAL ÚNICO
   -------------------------------------------------------------------------- */
function abrirModal(titulo, conteudo) {
    const modal = document.getElementById("modalJogo");
    const modalTitulo = document.getElementById("modalTitulo");
    const modalConteudo = document.getElementById("modalConteudo");

    if (!modal) return console.error("Modal principal não encontrado.");
    if (modalTitulo) modalTitulo.textContent = titulo;
    if (modalConteudo) modalConteudo.innerHTML = conteudo;

    modal.classList.remove("hidden");
}

function fecharModal() {
    const modal = document.getElementById("modalJogo");
    if (modal) modal.classList.add("hidden");
}

/* --------------------------------------------------------------------------
   4. SISTEMA FINANCEIRO E ATRIBUTOS
   -------------------------------------------------------------------------- */
function atualizarDinheiro(valorAlterado) {
    dinheiro += valorAlterado;
    if (dinheiro < 0) dinheiro = 0;

    const elementoDinheiro = document.getElementById("dinheiro");
    if (elementoDinheiro) elementoDinheiro.textContent = "R$ " + dinheiro;
}

function atualizarBarra(idDaBarra, valorAlterado) {
    if (!(idDaBarra in statusJogo)) return;

    statusJogo[idDaBarra] = Math.min(100, Math.max(0, statusJogo[idDaBarra] + valorAlterado));

    const elementoBarra = document.getElementById(idDaBarra);
    if (elementoBarra) elementoBarra.style.width = statusJogo[idDaBarra] + "%";

    if (idDaBarra === "lifeFill") {
        const textoVida = document.getElementById("lifebar");
        if (textoVida) textoVida.textContent = `Vida: ${statusJogo.lifeFill}%`;
    }
    if (idDaBarra === "hungryFill") {
        const textoFome = document.getElementById("hungrybar");
        if (textoFome) textoFome.textContent = `Fome: ${statusJogo.hungryFill}%`;
    }
    if (idDaBarra === "sleepFill") {
        const textoSono = document.getElementById("sleepbar");
        if (textoSono) textoSono.textContent = `Sono: ${statusJogo.sleepFill}%`;
    }

    if (statusJogo.lifeFill <= 0 && jogoAtivo) morrer();
}

/* --------------------------------------------------------------------------
   5. GERENCIAMENTO DE GAME OVER E RESTART
   -------------------------------------------------------------------------- */
function morrer() {
    jogoAtivo = false;
    if (intervaloSalario) {
        clearInterval(intervaloSalario);
        intervaloSalario = null;
    }
    fecharModal();

    const gameOverScreen = document.getElementById("gameOverScreen");
    if (gameOverScreen) gameOverScreen.style.display = "block";
}

function reiniciarJogo() {
    statusJogo = { ...VALORES_INICIAIS };
    jogoAtivo = true;
    dinheiro = 50;
    empregoAtual = null;
    dia = 0;
    geladeira = [];
    doencaAtual = { nome: null, impacto: 0 };

    if (intervaloSalario) {
        clearInterval(intervaloSalario);
        intervaloSalario = null;
    }

    const gameOverScreen = document.getElementById("gameOverScreen");
    if (gameOverScreen) gameOverScreen.style.display = "none";

    const profissao = document.getElementById("profissao");
    if (profissao) profissao.textContent = "Desempregado";

    const doencaTexto = document.getElementById("doencaTexto");
    if (doencaTexto) doencaTexto.textContent = "🤒: Nenhuma";

    const dayP = document.querySelector(".dayupdate");
    if (dayP) dayP.textContent = "📆 Dia: 0";

    atualizarBarra("lifeFill", 0);
    atualizarBarra("hungryFill", 0);
    atualizarBarra("sleepFill", 0);
    atualizarDinheiro(0);
    fecharModal();

    mostrarNotificacao("🔄 Jogo reiniciado!", "#4211c9");
}

/* --------------------------------------------------------------------------
   6. AÇÕES BÁSICAS DO JOGADOR
   -------------------------------------------------------------------------- */
function descansar() {
    if (!jogoAtivo) return;
    atualizarBarra("sleepFill", 2);
}

function comer() {
    if (!jogoAtivo) return;
    atualizarBarra("hungryFill", 2);
}

function dayUpdate(diaupdate) {
    if (!jogoAtivo) return;
    dia += diaupdate;

    const dayP = document.querySelector(".dayupdate");
    if (dayP) dayP.textContent = `📆 Dia: ${dia}`;
}

/* --------------------------------------------------------------------------
   7. SISTEMA DE SAÚDE E DOENÇAS
   -------------------------------------------------------------------------- */
function tomarRemedio() {
    if (doencaAtual.nome === null) {
        mostrarNotificacao("Você não está doente!", "#ff4757");
        return;
    }

    const nomeDoenca = doencaAtual.nome;
    doencaAtual.nome = null;
    doencaAtual.impacto = 0;

    const doencaUp = document.getElementById("doencaTexto");
    if (doencaUp) doencaUp.textContent = "🤒: Nenhuma";

    mostrarNotificacao(`💊 Você tomou o remédio e se curou de: ${nomeDoenca}`, "#0b87ec");
}

function abrirRemedio() {
    if (!jogoAtivo) return;

    if (!doencaAtual.nome) {
        abrirModal("💊 Remédios", `
            <div class="modal-action-content">
                <p>😊 Você não está doente.</p>
                <button class="minigame-action-button" style="justify-content: center;" onclick="fecharModal()">Fechar</button>
            </div>
        `);
        return;
    }

    abrirModal("💊 Farmácia", `
        <div class="modal-action-content">
            <p>🤒 Você está doente.</p>
            <h3>${doencaAtual.nome}</h3>
            <p>O medicamento custa R$ 10.</p>
            <button class="minigame-action-button" onclick="confirmarRemedio()">💊 Tomar Remédio - R$ 10</button>
        </div>
    `);
}

window.confirmarRemedio = function() {
    if (!jogoAtivo) return;
    if (dinheiro < 10) return mostrarNotificacao("💰 Dinheiro insuficiente!", "#ff4757");

    tomarRemedio();
    atualizarDinheiro(-10);
    fecharModal();
};

/* --------------------------------------------------------------------------
   8. SISTEMA DE EMPREGOS
   -------------------------------------------------------------------------- */
function abrirEmpregos() {
    if (!jogoAtivo) return;

    let conteudo = `
        <p style="margin-bottom: 15px; text-align: center;">Escolha uma profissão para trabalhar:</p>
        <div class="jobs-list">
    `;

    empregos.forEach(job => {
        conteudo += `
            <div class="job-card">
                <div class="job-info">
                    <span class="job-title">${job.cargo}</span>
                    <span class="job-salary">Salário: R$ ${job.salario}</span>
                </div>
                <button class="btn-candidatar" onclick="selecionarEmprego('${job.cargo}', ${job.salario})">Aceitar</button>
            </div>
        `;
    });

    conteudo += `</div>`;
    abrirModal("💼 Agência de Empregos", conteudo);
}

window.selecionarEmprego = function(cargo, salario) {
    if (!jogoAtivo) return;

    const vaga = empregos.find(emprego => emprego.cargo === cargo);
    if (!vaga) return;

    empregoAtual = { cargo: vaga.cargo, salario: vaga.salario, payday: vaga.payday };

    const profissao = document.getElementById("profissao");
    if (profissao) profissao.textContent = empregoAtual.cargo;

    if (intervaloSalario) clearInterval(intervaloSalario);

    mostrarNotificacao(`🎉 Você agora trabalha como: ${empregoAtual.cargo}!`, "#4211c9");
    atualizarBarra("sleepFill", -15);
    atualizarBarra("hungryFill", -10);

    const tempoPagamento = empregoAtual.payday || 30000;
    intervaloSalario = setInterval(() => {
        if (!jogoAtivo) return;
        atualizarDinheiro(empregoAtual.salario);
        mostrarNotificacao(`💰 Salário recebido: +R$ ${empregoAtual.salario}`, "#1e90ff");
    }, tempoPagamento);

    fecharModal();
};

/* --------------------------------------------------------------------------
   9. MINIGAME DE TRABALHO
   -------------------------------------------------------------------------- */
function abrirMinigameTrabalho() {
    if (!jogoAtivo) return;

    if (!empregoAtual) {
        mostrarNotificacao("Você está desempregado. Vá até a Agência de Empregos para conseguir um trabalho.", "#ff4757");
        return;
    }

    const lista = tarefasProfissoes[empregoAtual.cargo];
    if (!lista || lista.length === 0) {
        mostrarNotificacao("Sem tarefas disponíveis para sua profissão no momento.", "#ffb86b");
        return;
    }

    const tarefa = lista[Math.floor(Math.random() * lista.length)];
    const valorRecompensa = recompensa[Math.floor(Math.random() * recompensa.length)];

    abrirModal("💼 Tarefa do Trabalho", `
        <div class="modal-action-content">
            <p>${tarefa.instr}</p>
            <button id="btnConcluirTarefa" class="minigame-action-button">${tarefa.label}</button>
        </div>
    `);

    const btn = document.getElementById("btnConcluirTarefa");
    if (btn) {
        btn.addEventListener("click", () => concluirMinigame(valorRecompensa));
    }
}

function concluirMinigame(valorRecompensa) {
    if (!jogoAtivo) return;

    atualizarDinheiro(valorRecompensa);
    atualizarBarra("hungryFill", -1);
    atualizarBarra("sleepFill", -1);

    mostrarNotificacao(`💸 Você ganhou R$ ${valorRecompensa}`, "#00c853");
    fecharModal();
}

/* --------------------------------------------------------------------------
   10. SISTEMA DE MERCADO
   -------------------------------------------------------------------------- */
function abrirMercado() {
    if (!jogoAtivo) return;

    let conteudo = `
        <p style="margin-bottom: 15px; text-align: center;">🛒 Faça boas compras</p>
        <div class="market-list">
    `;

    produtos_mercado.forEach(produto => {
        conteudo += `
            <div class="market-card">
                <div class="market-info">
                    <span class="market-title">${produto.produto}</span>
                    <span class="market-salary">Valor: R$ ${produto.valor}</span>
                </div>
                <button class="btn-candidatar" onclick="selecionarMercado(${produto.id})">Comprar</button>
            </div>
        `;
    });

    conteudo += `</div>`;
    abrirModal("🛒 Mercadinho da Dona Cida", conteudo);
}

window.selecionarMercado = function(idDoProduto) {
    if (!jogoAtivo) return;

    const produtoSelecionado = produtos_mercado.find(produto => produto.id === idDoProduto);
    if (!produtoSelecionado) return console.log("Produto não encontrado!");

    if (dinheiro < produtoSelecionado.valor) {
        mostrarNotificacao("💰 Dinheiro insuficiente!", "#ff4757");
        return;
    }

    atualizarDinheiro(-produtoSelecionado.valor);

    const produtoNaGeladeira = geladeira.find(item => item.id === idDoProduto);
    if (produtoNaGeladeira) {
        produtoNaGeladeira.quantidade += 1;
    } else {
        geladeira.push({ ...produtoSelecionado, quantidade: 1 });
    }

    mostrarNotificacao(`🛒 Comprou ${produtoSelecionado.produto} por R$ ${produtoSelecionado.valor}!`, "#0000FF");
    console.log("Geladeira atual:", geladeira);
};

/* --------------------------------------------------------------------------
   11. GELADEIRA E ALIMENTAÇÃO
   -------------------------------------------------------------------------- */
function abrirGeladeira() {
    if (!jogoAtivo) return;

    let conteudo = `<p style="text-align: center; margin-bottom: 15px;">🧊 Alimentos disponíveis</p>`;

    if (geladeira.length === 0) {
        conteudo += `
            <div style="text-align: center; padding: 20px;">
                <p>😢 Sua geladeira está vazia.</p>
                <p>Vá ao mercado comprar alguma coisa!</p>
            </div>
        `;
    } else {
        conteudo += `<div class="refrigerator-list">`;
        geladeira.forEach(item => {
            conteudo += `
                <div class="market-card">
                    <div class="market-info">
                        <span class="market-title">${item.produto}</span>
                        <span class="market-salary">Quantidade: ${item.quantidade}</span>
                    </div>
                    <button class="btn-candidatar" onclick="comerDaGeladeira(${item.id})">🍽️ Comer</button>
                </div>
            `;
        });
        conteudo += `</div>`;
    }

    abrirModal("🧊 Geladeira", conteudo);
}

window.comerDaGeladeira = function(id) {
    if (!jogoAtivo) return;

    const produto = geladeira.find(item => item.id === id);
    if (!produto) return;

    if (produto.quantidade <= 0) {
        mostrarNotificacao("Você não possui esse alimento!", "#ff4757");
        return;
    }

    produto.quantidade--;
    atualizarBarra("hungryFill", 20);
    mostrarNotificacao(`🍽️ Você comeu ${produto.produto}!`, "#00c853");

    if (produto.quantidade === 0) {
        geladeira = geladeira.filter(item => item.id !== id);
    }

    abrirGeladeira();
};

function abrirComer() {
    if (!jogoAtivo) return;
    abrirModal("🍕 Comer", `
        <div class="modal-action-content">
            <p>Você está com fome?</p>
            <p>Escolha uma opção:</p>
            <button class="minigame-action-button" onclick="confirmarComer()">🍕 Fazer uma refeição</button>
            <button class="minigame-action-button" onclick="abrirGeladeira()">🧊 Abrir Geladeira</button>
        </div>
    `);
}
window.confirmarComer = function() {
    if (!jogoAtivo) return;

    comer();
    mostrarNotificacao("🍕 Você comeu!", "#00c853");
    fecharModal();
};

/* --------------------------------------------------------------------------
   12. DESCANSO E LOJA
   -------------------------------------------------------------------------- */
function abrirDormir() {
    if (!jogoAtivo) return;

    abrirModal("😴 Dormir", `
        <div class="modal-action-content">
            <p>Seu personagem precisa descansar.</p>
            <p>Dormir recuperará seu nível de Sono.</p>
            <button class="minigame-action-button" onclick="confirmarDormir()">🛏️ Dormir</button>
        </div>
    `);
}

window.confirmarDormir = function() {
    if (!jogoAtivo) return;
    descansar();
    mostrarNotificacao("😴 Você descansou!", "#4211c9");
};

function abrirLoja() {
    if (!jogoAtivo) return;

    let conteudo = `
        <p style="text-align: center; margin-bottom: 15px;">🏪 Produtos disponíveis na loja</p>
        <div class="market-list">
    `;

    loja_produtos.forEach(produto => {
        conteudo += `
            <div class="market-card">
                <div class="market-info">
                    <span class="market-title">${produto.produto}</span>
                    <span class="market-salary">Valor: R$ ${produto.valor}</span>
                </div>
                <button class="btn-candidatar" onclick="comprarProdutoLoja(${produto.id})">Comprar</button>
            </div>
        `;
    });

    conteudo += `</div>`;
    abrirModal("🏪 Loja", conteudo);
}

window.comprarProdutoLoja = function(idDoProduto) {
    if (!jogoAtivo) return;

    const produto = loja_produtos.find(item => item.id === idDoProduto);
    if (!produto) return;

    if (dinheiro < produto.valor) {
        mostrarNotificacao("💰 Dinheiro insuficiente!", "#ff4757");
        return;
    }

    atualizarDinheiro(-produto.valor);
    mostrarNotificacao(`🛍️ Você comprou ${produto.produto}!`, "#00c853");
};

/* --------------------------------------------------------------------------
   13. NOTIFICAÇÕES (TOASTIFY)
   -------------------------------------------------------------------------- */
function mostrarNotificacao(texto, corFundo = "#2ed573", tempo = 3000) {
    if (typeof Toastify === "function") {
        Toastify({
            text: texto,
            duration: tempo,
            gravity: "bottom",
            position: "right",
            stopOnFocus: true,
            style: {
                background: corFundo,
                borderRadius: "8px",
                fontFamily: "'Oswald', sans-serif",
                color: "#ffffff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.4)"
            }
        }).showToast();
    } else {
        console.log(`[Toastify Não Encontrado]: ${texto}`);
    }
}

/* --------------------------------------------------------------------------
   14. TIMERS E LOOPS (INTERVALS)
   -------------------------------------------------------------------------- */
// Sorteia Doenças (A cada 30 segundos)
setInterval(() => {
    if (!jogoAtivo) return;

    const listaDoencas = Object.entries(doencas);
    const indiceAleatorio = Math.floor(Math.random() * listaDoencas.length);
    const [doencaSorteada, impactoValor] = listaDoencas[indiceAleatorio];

    doencaAtual.nome = doencaSorteada;
    doencaAtual.impacto = impactoValor;

    const doencaUp = document.getElementById("doencaTexto");
    if (doencaUp) doencaUp.textContent = `🤒: ${doencaAtual.nome}`;

    mostrarNotificacao(`🤒 Nova doença contraída: ${doencaAtual.nome} (Impacto: ${doencaAtual.impacto}/s)`, "#0b87ec");
}, 30000);

// Decaimento dos Status (A cada 1 segundo)
setInterval(() => {
    if (!jogoAtivo) return;

    atualizarBarra("hungryFill", -taxaDecaimento.hungryFill);
    atualizarBarra("sleepFill", -taxaDecaimento.sleepFill);

    if (doencaAtual.impacto < 0) {
        atualizarBarra("lifeFill", doencaAtual.impacto);
    }

    if (statusJogo.hungryFill <= 0 && statusJogo.sleepFill <= 0) {
        atualizarBarra("lifeFill", -5);
    } else if (statusJogo.hungryFill <= 0) {
        atualizarBarra("lifeFill", -2);
    } else if (statusJogo.sleepFill <= 0) {
        atualizarBarra("lifeFill", -1);
    }
}, 1000);

// Passagem do Tempo (1 dia a cada 15 minutos)
setInterval(() => {
    if (!jogoAtivo) return;

    dayUpdate(1);
    mostrarNotificacao("+1 Dia se passou no jogo", "#eb31bc", 3000);
}, 900000);

/* --------------------------------------------------------------------------
   15. INICIALIZAÇÃO DOS EVENTOS (DOM LOAD)
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    const btnTrabalhar = document.getElementById("trabalhar");
    const btnMercado = document.getElementById("mercado");
    const btnGeladeira = document.getElementById("geladeira");
    const btnFazerTrabalho = document.getElementById("fazerTrabalho");
    const btnDescansar = document.getElementById("descansar");
    const btnComer = document.getElementById("comer");
    const btnRemedio = document.getElementById("remedio");
    const btnLoja = document.getElementById("loja");

    const modal = document.getElementById("modalJogo");
    const btnFecharModal = document.getElementById("fecharModalJogo");

    if (btnTrabalhar) btnTrabalhar.addEventListener("click", abrirEmpregos);
    if (btnMercado) btnMercado.addEventListener("click", abrirMercado);
    if (btnGeladeira) btnGeladeira.addEventListener("click", abrirGeladeira);
    if (btnFazerTrabalho) btnFazerTrabalho.addEventListener("click", abrirMinigameTrabalho);
    if (btnDescansar) btnDescansar.addEventListener("click", abrirDormir);
    if (btnComer) btnComer.addEventListener("click", abrirComer);
    if (btnRemedio) btnRemedio.addEventListener("click", abrirRemedio);
    if (btnLoja) btnLoja.addEventListener("click", abrirLoja);

    if (btnFecharModal) btnFecharModal.addEventListener("click", fecharModal);

    if (modal) {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) fecharModal();
        });
    }

    // Status Iniciais
    atualizarBarra("lifeFill", 0);
    atualizarBarra("hungryFill", 0);
    atualizarBarra("sleepFill", 0);
    atualizarDinheiro(0);

    console.log("🎮 Life Sim iniciado com sucesso!");
});