/* =========================================================
   CASINOX
   VERSION 0.2
   MOBILE FIRST
   ========================================================= */


/* =========================================================
   CONFIGURAÇÃO DOS JOGOS
========================================================= */

const games = [

  {
    id: "slots",
    name: "Lucky Stars",
    icon: "🎰",
    description: "Slot social",
    tag: "Popular"
  },

  {
    id: "roulette",
    name: "Roleta Royale",
    icon: "🎡",
    description: "Roleta virtual",
    tag: "Clássico"
  },

  {
    id: "blackjack",
    name: "Blackjack Pro",
    icon: "🃏",
    description: "21 contra a banca",
    tag: "Clássico"
  },

  {
    id: "crash",
    name: "Rocket Crash",
    icon: "🚀",
    description: "Suba o multiplicador",
    tag: "Novo"
  },

  {
    id: "baccarat",
    name: "Baccarat",
    icon: "♠️",
    description: "Mesa clássica",
    tag: "Premium"
  },

  {
    id: "dice",
    name: "Dice",
    icon: "🎲",
    description: "Dados virtuais",
    tag: "Rápido"
  },

  {
    id: "poker",
    name: "Poker Social",
    icon: "♣️",
    description: "Mesa demonstrativa",
    tag: "Social"
  },

  {
    id: "wheel",
    name: "Prize Wheel",
    icon: "🎯",
    description: "Gire a roda",
    tag: "Bônus"
  }

];


/* =========================================================
   ESTADO DO JOGADOR
========================================================= */

let balance = Number(
  localStorage.getItem("casinox_balance") || 10000
);

let playerName =
  localStorage.getItem("casinox_player") || "";


/* =========================================================
   ELEMENTOS
========================================================= */

const app =
  document.getElementById("app");

const balanceElement =
  document.getElementById("balance");

const loginButton =
  document.getElementById("login");

const mobileProfile =
  document.getElementById("mobile-profile");

const toastElement =
  document.getElementById("toast");


/* =========================================================
   FORMATAÇÃO
========================================================= */

function formatCredits(value) {

  return Math.floor(value)
    .toLocaleString("pt-BR");

}


/* =========================================================
   SALVAR ESTADO
========================================================= */

function saveState() {

  localStorage.setItem(
    "casinox_balance",
    balance
  );

  localStorage.setItem(
    "casinox_player",
    playerName
  );

  updateBalance();

}


/* =========================================================
   ATUALIZAR SALDO
========================================================= */

function updateBalance() {

  if (!balanceElement) {
    return;
  }

  balanceElement.textContent =
    formatCredits(balance);

}


/* =========================================================
   NOTIFICAÇÃO
========================================================= */

function showToast(message) {

  if (!toastElement) {
    return;
  }

  toastElement.textContent =
    message;

  toastElement.classList.add("show");

  clearTimeout(window.casinoXToast);

  window.casinoXToast =
    setTimeout(() => {

      toastElement.classList.remove("show");

    }, 2300);

}


/* =========================================================
   CARTÕES DOS JOGOS
========================================================= */

function renderGameCards(list = games) {

  return list.map(game => {

    return `

      <article
        class="card"
        data-game="${game.id}"
        tabindex="0"
      >

        <div class="art">

          ${game.icon}

        </div>

        <h3>
          ${game.name}
        </h3>

        <p>
          ${game.description}
        </p>

        <span class="tag">
          ${game.tag}
        </span>

      </article>

    `;

  }).join("");

}


/* =========================================================
   MENU ATIVO
========================================================= */

function setActiveMenu(viewName) {

  document
    .querySelectorAll(
      ".mobile-nav button[data-view]"
    )
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.view === viewName
      );

    });

}


/* =========================================================
   NAVEGAÇÃO
========================================================= */

function navigate(viewName) {

  setActiveMenu(viewName);

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });


  /* =====================================================
     HOME
  ===================================================== */

  if (viewName === "home") {

    app.innerHTML = `

      <section class="hero">

        <div>

          <div class="eyebrow">
            CASSINO SOCIAL • VERSÃO 0.2
          </div>

          <h1>
            Entre na mesa.<br>
            Jogue por diversão.
          </h1>

          <p>
            Experimente uma plataforma moderna
            de cassino usando apenas créditos
            virtuais.
          </p>

          <button
            class="primary"
            id="exploreGames"
          >
            Explorar jogos →
          </button>

        </div>


        <div class="hero-art">

          <div class="chip">
            🎰
          </div>

        </div>

      </section>


      <section class="section">

        <div class="head">

          <div>

            <h2>
              🔥 Jogos em destaque
            </h2>

            <p>
              Toque em um jogo para começar.
            </p>

          </div>


          <button
            class="primary"
            id="showAllGames"
          >
            Ver todos
          </button>

        </div>


        <div class="grid">

          ${renderGameCards(
            games.slice(0, 4)
          )}

        </div>

      </section>


      <section class="section features">

        <div class="feature">

          <h3>
            💎 Créditos virtuais
          </h3>

          <p>
            Comece com 10.000 créditos
            para testar a plataforma.
          </p>

        </div>


        <div class="feature">

          <h3>
            🏆 Ranking social
          </h3>

          <p>
            Compare suas pontuações
            com outros jogadores.
          </p>

        </div>


        <div class="feature">

          <h3>
            📱 Mobile First
          </h3>

          <p>
            Interface preparada para
            smartphones e toque.
          </p>

        </div>

      </section>

    `;

  }


  /* =====================================================
     JOGOS
  ===================================================== */

  else if (viewName === "casino") {

    app.innerHTML = `

      <div class="title">

        <h1>
          🎰 Jogos
        </h1>

        <p>
          Escolha um jogo e toque para abrir.
        </p>

      </div>


      <div class="grid">

        ${renderGameCards()}

      </div>

    `;

  }


  /* =====================================================
     PROMOÇÕES
  ===================================================== */

  else if (viewName === "promos") {

    app.innerHTML = `

      <div class="title">

        <h1>
          🎁 Promoções
        </h1>

        <p>
          Recompensas da versão demonstrativa.
        </p>

      </div>


      <div class="list">


        <div class="row">

          <div>

            <b>
              Boas-vindas
            </b>

            <p>
              10.000 créditos virtuais iniciais.
            </p>

          </div>

          <span class="tag">
            ATIVO
          </span>

        </div>


        <div class="row">

          <div>

            <b>
              Giro diário
            </b>

            <p>
              Ganhe 500 créditos virtuais
              uma vez por dia.
            </p>

          </div>

          <button
            class="primary"
            id="dailyReward"
          >
            Resgatar
          </button>

        </div>


      </div>

    `;

  }


  /* =====================================================
     RANKING
  ===================================================== */

  else if (viewName === "ranking") {

    const ranking = [

      [
        "1",
        "LuckyPlayer",
        "98.420"
      ],

      [
        "2",
        "Queen21",
        "87.650"
      ],

      [
        "3",
        "RocketBR",
        "81.300"
      ],

      [
        "4",
        "CasinoFan",
        "76.210"
      ],

      [
        "5",
        playerName || "Você",
        formatCredits(balance)
      ]

    ];


    app.innerHTML = `

      <div class="title">

        <h1>
          🏆 Ranking
        </h1>

        <p>
          Ranking social demonstrativo.
        </p>

      </div>


      <div class="list">

        ${ranking.map(item => `

          <div class="row">

            <b>
              #${item[0]}
              ${item[1]}
            </b>

            <strong>
              ${item[2]}
            </strong>

          </div>

        `).join("")}

      </div>

    `;

  }


  bindPageEvents();

}


/* =========================================================
   EVENTOS DAS PÁGINAS
========================================================= */

function bindPageEvents() {


  /* Jogos */

  document
    .querySelectorAll("[data-game]")
    .forEach(card => {

      card.addEventListener(
        "click",
        () => {

          openGame(
            card.dataset.game
          );

        }
      );


      card.addEventListener(
        "keydown",
        event => {

          if (
            event.key === "Enter" ||
            event.key === " "
          ) {

            event.preventDefault();

            openGame(
              card.dataset.game
            );

          }

        }
      );

    });


  /* Explorar */

  const explore =
    document.getElementById(
      "exploreGames"
    );

  if (explore) {

    explore.onclick =
      () => navigate("casino");

  }


  /* Ver todos */

  const all =
    document.getElementById(
      "showAllGames"
    );

  if (all) {

    all.onclick =
      () => navigate("casino");

  }


  /* Recompensa */

  const daily =
    document.getElementById(
      "dailyReward"
    );

  if (daily) {

    daily.onclick =
      claimDailyReward;

  }

}


/* =========================================================
   PAGAMENTO VIRTUAL
========================================================= */

function chargeCredits(amount) {

  amount = Number(amount);


  if (
    !Number.isFinite(amount) ||
    amount < 10
  ) {

    showToast(
      "Digite um valor mínimo de 10 créditos."
    );

    return false;

  }


  if (amount > balance) {

    showToast(
      "Você não possui créditos suficientes."
    );

    return false;

  }


  balance -=
    Math.floor(amount);

  saveState();

  return true;

}


/* =========================================================
   GANHAR CRÉDITOS
========================================================= */

function addCredits(amount) {

  balance +=
    Math.floor(amount);

  saveState();

}


/* =========================================================
   CAMPO DE APOSTA
========================================================= */

function stakeInput() {

  return `

    <input
      id="stake"
      type="number"
      min="10"
      value="100"
      inputmode="numeric"
      aria-label="Quantidade de créditos"
    >

  `;

}


/* =========================================================
   MODAL DO JOGO
========================================================= */

function openGame(gameId) {

  const game =
    games.find(
      item => item.id === gameId
    );


  if (!game) {
    return;
  }


  const modal =
    document.createElement("div");


  modal.className =
    "modal";


  modal.innerHTML = `

    <div class="box">

      <div class="modalhead">

        <h2>
          ${game.icon}
          ${game.name}
        </h2>

        <button
          class="close"
          aria-label="Fechar jogo"
        >
          ×
        </button>

      </div>


      <div
        class="stage"
        id="gameStage"
      >
      </div>

    </div>

  `;


  document.body.appendChild(
    modal
  );


  modal
    .querySelector(".close")
    .onclick = () => {

      modal.remove();

    };


  const stage =
    modal.querySelector(
      "#gameStage"
    );


  if (gameId === "slots") {

    renderSlots(stage);

  }

  else if (gameId === "roulette") {

    renderRoulette(stage);

  }

  else if (gameId === "blackjack") {

    renderBlackjack(stage);

  }

  else if (gameId === "crash") {

    renderCrash(stage);

  }

  else {

    renderComingSoon(
      stage,
      game
    );

  }

}


/* =========================================================
   JOGO: SLOTS
========================================================= */

function renderSlots(stage) {

  stage.innerHTML = `

    <div>

      <div class="reels">

        <div class="reel">
          🍒
        </div>

        <div class="reel">
          ⭐
        </div>

        <div class="reel">
          7️⃣
        </div>

      </div>


      <div class="controls">

        ${stakeInput()}

        <button
          class="primary"
          id="spin"
        >
          Girar
        </button>

      </div>


      <p id="gameResult">
      </p>

    </div>

  `;


  stage
    .querySelector("#spin")
    .onclick = () => {

      const amount =
        Number(
          stage.querySelector(
            "#stake"
          ).value
        );


      if (
        !chargeCredits(amount)
      ) {

        return;

      }


      const symbols = [
        "🍒",
        "🍋",
        "⭐",
        "💎",
        "7️⃣"
      ];


      const reels =
        [...stage.querySelectorAll(
          ".reel"
        )];


      const result =
        reels.map(() => {

          return symbols[
            Math.floor(
              Math.random() *
              symbols.length
            )
          ];

        });


      result.forEach(
        (symbol, index) => {

          reels[index]
            .textContent =
            symbol;

        }
      );


      let multiplier = 0;


      if (
        result[0] === result[1] &&
        result[1] === result[2]
      ) {

        multiplier = 5;

      }

      else if (
        result[0] === result[1] ||
        result[1] === result[2] ||
        result[0] === result[2]
      ) {

        multiplier = 2;

      }


      const winnings =
        amount * multiplier;


      if (winnings > 0) {

        addCredits(winnings);

      }


      stage.querySelector(
        "#gameResult"
      ).textContent =
        winnings > 0

          ? `Você ganhou ${formatCredits(winnings)} créditos!`

          : "Não foi dessa vez.";

    };

}


/* =========================================================
   JOGO: ROLETA
========================================================= */

function renderRoulette(stage) {

  stage.innerHTML = `

    <div>

      <div class="wheel">

        <b id="rouletteNumber">
          ?
        </b>

      </div>


      <div class="controls">

        ${stakeInput()}

        <button
          class="primary"
          id="spinRoulette"
        >
          Girar
        </button>

      </div>


      <p id="gameResult">
      </p>

    </div>

  `;


  stage
    .querySelector("#spinRoulette")
    .onclick = () => {

      const amount =
        Number(
          stage.querySelector(
            "#stake"
          ).value
        );


      if (
        !chargeCredits(amount)
      ) {

        return;

      }


      const number =
        Math.floor(
          Math.random() * 37
        );


      const winnings =
        number === 0

          ? amount * 10

          : amount * 2;


      addCredits(winnings);


      stage.querySelector(
        "#rouletteNumber"
      ).textContent =
        number;


      stage.querySelector(
        "#gameResult"
      ).textContent =
        `Número ${number}. Retorno virtual: ${formatCredits(winnings)} créditos.`;

    };

}


/* =========================================================
   JOGO: BLACKJACK
========================================================= */

function renderBlackjack(stage) {

  stage.innerHTML = `

    <div>

      <div style="font-size:80px">
        🃏
      </div>

      <p>
        Versão demonstrativa.
      </p>


      <div class="controls">

        ${stakeInput()}

        <button
          class="primary"
          id="deal"
        >
          Distribuir
        </button>

      </div>


      <p id="gameResult">
      </p>

    </div>

  `;


  stage
    .querySelector("#deal")
    .onclick = () => {

      const amount =
        Number(
          stage.querySelector(
            "#stake"
          ).value
        );


      if (
        !chargeCredits(amount)
      ) {

        return;

      }


      const player =
        12 +
        Math.floor(
          Math.random() * 10
        );


      const dealer =
        15 +
        Math.floor(
          Math.random() * 7
        );


      const result =
        stage.querySelector(
          "#gameResult"
        );


      if (player > 21) {

        result.textContent =
          `Você: ${player}. Estourou.`;

        return;

      }


      if (
        dealer > 21 ||
        player > dealer
      ) {

        const winnings =
          amount * 2;

        addCredits(
          winnings
        );

        result.textContent =
          `Você: ${player} • Banca: ${dealer}. Vitória! +${formatCredits(winnings)}.`;

        return;

      }


      if (player === dealer) {

        addCredits(
          amount
        );

        result.textContent =
          "Empate. Créditos devolvidos.";

        return;

      }


      result.textContent =
        `Você: ${player} • Banca: ${dealer}. A banca venceu.`;

    };

}


/* =========================================================
   JOGO: CRASH
========================================================= */

function renderCrash(stage) {

  stage.innerHTML = `

    <div>

      <div
        id="multiplier"
        style="
          font-size:72px;
          font-weight:900;
          color:var(--gold);
        "
      >
        1.00x
      </div>


      <p>
        Multiplicador demonstrativo.
      </p>


      <div class="controls">

        ${stakeInput()}

        <button
          class="primary"
          id="launch"
        >
          Entrar
        </button>

      </div>


      <p id="gameResult">
      </p>

    </div>

  `;


  stage
    .querySelector("#launch")
    .onclick = () => {

      const amount =
        Number(
          stage.querySelector(
            "#stake"
          ).value
        );


      if (
        !chargeCredits(amount)
      ) {

        return;

      }


      const multiplier =
        stage.querySelector(
          "#multiplier"
        );


      const result =
        stage.querySelector(
          "#gameResult"
        );


      let current = 1;

      const crashPoint =
        1 +
        Math.random() * 4.5;


      const interval =
        setInterval(() => {

          current += 0.1;

          multiplier.textContent =
            current.toFixed(2) +
            "x";


          if (
            current >= crashPoint
          ) {

            clearInterval(
              interval
            );


            const win =
              Math.random() > 0.3;


            if (win) {

              const winnings =
                amount * current;

              addCredits(
                winnings
              );

              result.textContent =
                `Saída em ${current.toFixed(2)}x. +${formatCredits(winnings)} créditos.`;

            }

            else {

              result.textContent =
                `Crash em ${current.toFixed(2)}x.`;

            }

          }

        }, 70);

    };

}


/* =========================================================
   JOGOS FUTUROS
========================================================= */

function renderComingSoon(
  stage,
  game
) {

  stage.innerHTML = `

    <div>

      <div style="font-size:80px">
        ${game.icon}
      </div>

      <h3>
        ${game.name}
      </h3>

      <p>
        Este jogo será desenvolvido
        na próxima versão.
      </p>

    </div>

  `;

}


/* =========================================================
   RECOMPENSA DIÁRIA
========================================================= */

function claimDailyReward() {

  const last =
    Number(
      localStorage.getItem(
        "casinox_daily"
      ) || 0
    );


  const oneDay =
    24 * 60 * 60 * 1000;


  if (
    Date.now() - last <
    oneDay
  ) {

    showToast(
      "Recompensa já resgatada hoje."
    );

    return;

  }


  balance += 500;


  localStorage.setItem(
    "casinox_daily",
    Date.now()
  );


  saveState();


  showToast(
    "+500 créditos virtuais!"
  );

}


/* =========================================================
   PERFIL
========================================================= */

function openProfile() {

  if (playerName) {

    showToast(
      `Olá, ${playerName}!`
    );

    return;

  }


  const name =
    window.prompt(
      "Digite seu nome de jogador:"
    );


  if (
    name &&
    name.trim()
  ) {

    playerName =
      name.trim();


    saveState();


    showToast(
      `Perfil criado para ${playerName}.`
    );

  }

}


/* =========================================================
   EVENTOS DO MENU
========================================================= */

document
  .querySelectorAll(
    "[data-view]"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        navigate(
          button.dataset.view
        );

      }
    );

  });


/* =========================================================
   PERFIL
========================================================= */

if (loginButton) {

  loginButton.onclick =
    openProfile;

}


if (mobileProfile) {

  mobileProfile.onclick =
    openProfile;

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

updateBalance();

navigate("home");
