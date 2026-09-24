# 🎮 Life Sim

> **Um simulador de vida e sobrevivência desenvolvido com HTML5, CSS3 e JavaScript Vanilla.**

O **Life Sim** é um jogo de simulação desenvolvido para praticar e consolidar fundamentos do desenvolvimento web, principalmente **JavaScript, manipulação do DOM, estruturas de dados, eventos e lógica de programação**.

No jogo, o jogador precisa administrar seus recursos e tomar decisões para sobreviver o maior número de dias possível.

---

## 🕹️ Sobre o Jogo

Você começa sua jornada com recursos limitados e precisa cuidar de diferentes aspectos da sua vida:

❤️ **Vida**
🍔 **Fome**
😴 **Sono**
💰 **Dinheiro**
🧊 **Estoque de alimentos**
💊 **Saúde**

O tempo passa continuamente e os recursos são consumidos. Para sobreviver, é necessário **trabalhar, ganhar dinheiro, comprar comida, descansar e tratar doenças**.

Cada decisão pode fazer diferença na sua sobrevivência.

---

## ✨ Funcionalidades

### 📊 Sistema de Status

Barras de status são atualizadas dinamicamente durante o jogo:

* ❤️ Vida
* 🍔 Fome
* 😴 Sono
* 💰 Dinheiro
* 📅 Dias sobrevividos

Os atributos sofrem alterações conforme o tempo passa e conforme as ações do jogador.

---

### 💼 Agência de Empregos

O jogador pode procurar diferentes oportunidades de trabalho.

O sistema possui:

* 👷 Diferentes profissões
* 💰 Salários
* ⏰ Pagamentos periódicos
* 🎯 Mini-jogos/tarefas para conseguir dinheiro extra
* 📈 Sistema de progressão financeira

---

### 🛒 Mercado

O mercado permite comprar alimentos e outros itens necessários para a sobrevivência.

Os produtos possuem:

* Nome
* Preço
* Quantidade
* Identificação

O sistema também permite controlar a quantidade de itens comprados.

---

### 🧊 Geladeira / Inventário

Os alimentos comprados podem ser armazenados na geladeira.

O inventário trabalha com **empilhamento de itens**, permitindo que várias unidades do mesmo produto sejam armazenadas.

Exemplo:

```text
🍎 Maçã x5
🍞 Pão x3
🥛 Leite x2
```

---

### 🤒 Sistema de Doenças

Durante o jogo, doenças podem surgir aleatoriamente.

Alguns exemplos:

* 🤧 Gripe
* 🦟 Dengue
* 🦠 Covid
* 🤒 Outras doenças

As doenças podem causar **perda contínua de vida** até que o jogador encontre e utilize o medicamento adequado.

---

### ⏱️ Sistema de Tempo

O jogo possui um ciclo de tempo que controla diferentes acontecimentos.

O tempo é utilizado para:

* Reduzir os status
* Gerar eventos
* Controlar doenças
* Processar salários
* Avançar os dias
* Controlar determinadas ações

A implementação utiliza principalmente `setInterval()`.

---

### 💀 Game Over

Quando a vida chega a `0`, o jogador perde a partida.

Uma tela de **Game Over** é apresentada com a possibilidade de iniciar uma nova partida.

Ao reiniciar, o estado do jogo é restaurado para os valores iniciais.

---

## 🧠 Objetivo do Projeto

O principal objetivo do **Life Sim** não é apenas criar um jogo, mas utilizar o desenvolvimento como forma de aprendizado.

O projeto foi criado para praticar conceitos fundamentais de:

* JavaScript
* HTML
* CSS
* DOM
* Arrays
* Objetos
* Funções
* Eventos
* Temporizadores
* Manipulação de elementos
* Gerenciamento de estado
* Organização de código

A ideia é evoluir o projeto gradualmente conforme novos conhecimentos são adquiridos.

---

## 🛠️ Tecnologias

| Tecnologia         | Utilização                                |
| ------------------ | ----------------------------------------- |
| 🟠 HTML5           | Estrutura das páginas e elementos do jogo |
| 🔵 CSS3            | Layout, responsividade e efeitos visuais  |
| 🟡 JavaScript ES6+ | Lógica e funcionamento do jogo            |
| 🔔 Toastify JS     | Notificações e mensagens                  |
| 🧰 Git             | Controle de versão                        |
| 🐙 GitHub          | Hospedagem do código                      |

---

## 📚 Conceitos de JavaScript Aplicados

### 🌐 Manipulação do DOM

O jogo utiliza JavaScript para alterar dinamicamente os elementos da página.

Exemplos:

```javascript
element.innerHTML
element.style.width
element.classList.add()
element.classList.remove()
```

---

### 📦 Arrays e Métodos

O projeto utiliza diversos métodos de arrays, como:

```javascript
.find()
.filter()
.map()
.forEach()
```

Eles são utilizados para pesquisar, modificar, remover e percorrer dados do jogo.

---

### 🗂️ Objetos e Estruturas de Dados

Informações como produtos, empregos, doenças e estado do jogador são organizadas utilizando **objetos e arrays**.

Exemplo:

```javascript
const player = {
    health: 100,
    hunger: 100,
    sleep: 100,
    money: 100
};
```

---

### ⏰ Temporizadores

O `setInterval()` é utilizado para criar acontecimentos que ocorrem automaticamente durante o jogo.

```javascript
setInterval(() => {
    // atualização do jogo
}, 1000);
```

Isso permite criar a sensação de passagem de tempo.

---

## 🎮 Fluxo Básico do Jogo

```text
            🎮 INÍCIO
                │
                ▼
        👤 Criar jogador
                │
                ▼
       📊 Gerenciar status
                │
        ┌───────┼────────┐
        ▼       ▼        ▼
      💼      🛒       😴
    Trabalhar  Comprar   Dormir
        │       │        │
        ▼       ▼        ▼
       💰     🧊       ❤️
     Dinheiro Geladeira Saúde
        │       │        │
        └───────┼────────┘
                ▼
          🤒 Eventos
                │
                ▼
       💊 Tratar doenças
                │
                ▼
          📅 Novo dia
                │
                ▼
        ❤️ Vida chegou a 0?
             /       \
           SIM       NÃO
            │         │
            ▼         └──────► Continuar
        💀 GAME OVER
```

---

## 🚀 Como Executar

O projeto utiliza **JavaScript Vanilla**, portanto não é necessário instalar Node.js, npm ou outras dependências para executar a versão básica.

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/teu-usuario/life-sim.git
```

### 2️⃣ Entre na pasta

```bash
cd life-sim
```

### 3️⃣ Execute o projeto

Abra o arquivo:

```text
index.html
```

Você pode simplesmente clicar duas vezes no arquivo ou utilizar uma extensão como **Live Server** no VS Code.

---

## 📂 Estrutura do Projeto

Uma possível organização:

```text
life-sim/
│
├── index.html
│
├── css/
│   └── style.css
│
├── js/
│   └── script.js
│
├── assets/
│   ├── images/
│   └── icons/
│
└── README.md
```

---

## 🔮 Próximas Ideias

O projeto pode continuar evoluindo com novos sistemas, por exemplo:

* 🏠 Sistema de casas
* 🚗 Sistema de veículos
* 🏦 Banco e contas
* 💳 Cartão de crédito
* 🛍️ Mais lojas
* 👨‍👩‍👧 Sistema de família
* 👥 NPCs
* ❤️ Sistema de relacionamentos
* 🎒 Inventário completo
* 🗺️ Mapa explorável
* 🎯 Mais mini-jogos
* 🏆 Conquistas
* 💾 Sistema de salvamento
* 🌙 Ciclo de dia e noite
* 📈 Sistema de evolução do personagem
* 🎨 Personalização do personagem

---

## 🎯 Objetivo de Aprendizado

Este projeto faz parte do meu processo de aprendizado em **Desenvolvimento de Software**.

A proposta é aprender colocando a mão na massa: criar uma funcionalidade, encontrar problemas, pesquisar a documentação, testar soluções e melhorar o código.

As principais referências utilizadas são as documentações oficiais e materiais de estudo, com auxílio pontual de Inteligência Artificial para **entender, refatorar e otimizar partes do projeto**.

---

## 🤝 Contribuições

Este projeto foi criado principalmente para fins educativos.

Sugestões, melhorias e ideias são bem-vindas!

Se quiser contribuir:

```bash
git clone https://github.com/teu-usuario/life-sim.git
```

Depois faça suas alterações e envie um Pull Request.

---

## 📜 Licença

Este projeto é livre para fins **educacionais e de aprendizado**.

Sinta-se à vontade para estudar, modificar e criar novas funcionalidades a partir dele.

---

<div align="center">

### 🎮 LIFE SIM

**Sobreviva. Trabalhe. Coma. Durma. Repita.**

☕ Desenvolvido com café e JavaScript.

</div>
