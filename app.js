/* =========================================================
   CASINOX — v0.5
   MOBILE FIRST
   LOBBY + PROVEDORES + CATEGORIAS + FAVORITOS
   ========================================================= */


/* =========================================================
   JOGOS DEMONSTRATIVOS
   ========================================================= */

const CASINOX_V08_GAMES = [
  {id:"lucky-rabbit",name:"Lucky Rabbit",provider:"PG",category:"Slots",img:"assets/characters/lucky-rabbit.jpg",tag:"HOT",icon:"🐰"},
  {id:"golden-bull",name:"Golden Bull",provider:"Fortunes",category:"Slots",img:"assets/characters/golden-bull.jpg",tag:"HOT",icon:"🐂"},
  {id:"dragon-fortune",name:"Dragon Fortune",provider:"PG",category:"Slots",img:"assets/characters/dragon-fortune.jpg",tag:"HOT",icon:"🐉"},
  {id:"tiger-riches",name:"Tiger Riches",provider:"Fortunes",category:"Slots",img:"assets/characters/tiger-riches.jpg",tag:"HOT",icon:"🐯"},
  {id:"lion-king",name:"Lion King",provider:"Pragmatic Play",category:"Slots",img:"assets/characters/lion-king.jpg",tag:"HOT",icon:"🦁"},
  {id:"royal-bunny",name:"Royal Bunny",provider:"PG",category:"Slots",img:"assets/characters/royal-bunny.jpg",tag:"HOT",icon:"🐰"},
  {id:"fox-fortune",name:"Fox Fortune",provider:"Fortunes",category:"Slots",img:"assets/characters/fox-fortune.jpg",tag:"HOT",icon:"🦊"},
  {id:"dragon-fire",name:"Dragon Fire",provider:"Pragmatic Play",category:"Slots",img:"assets/characters/dragon-fire.jpg",tag:"HOT",icon:"🐲"},
  {id:"golden-toad",name:"Golden Toad",provider:"PG",category:"Slots",img:"assets/characters/golden-toad.jpg",tag:"NEW",icon:"🐸"},
  {id:"treasure-panda",name:"Treasure Panda",provider:"Fortunes",category:"Slots",img:"assets/characters/treasure-panda.jpg",tag:"NEW",icon:"🐼"},
  {id:"moon-temple",name:"Moon Temple",provider:"PG",category:"Slots",img:"assets/games/moon-temple.svg",tag:"NEW",icon:"🌙"},
  {id:"neon-roulette",name:"Neon Roulette",provider:"Evolution",category:"Cassino",img:"assets/games/neon-roulette.svg",tag:"LIVE",icon:"◎"}
];


/* =========================================================
   PROVEDORES
========================================================= */

const games = CASINOX_V08_GAMES;

const providers = [

  {
    id: "all",
    name: "Todos",
    icon: "✨"
  },

  {
    id: "PG",
    name: "PG",
    icon: "🎰"
  },

  {
    id: "Fortunes",
    name: "Fortunes",
    icon: "💎"
  },

  {
    id: "Pragmatic Play",
    name: "Pragmatic",
    icon: "🔥"
  },

  {
    id: "Evolution",
    name: "Evolution",
    icon: "♠️"
  }

];


/* =========================================================
   CATEGORIAS
========================================================= */

const categories = [

  {
    id: "all",
    name: "Todos",
    icon: "✨"
  },

  {
    id: "popular",
    name: "Mais jogados",
    icon: "🔥"
  },

  {
    id: "slots",
    name: "Slots",
    icon: "🎰"
  },

  {
    id: "casino",
    name: "Cassino",
    icon: "🃏"
  }

];


/* =========================================================
   ESTADO
========================================================= */

let balance =
  Number(
    localStorage.getItem(
      "casinox_balance"
    ) || 10000
  );


let playerName =
  localStorage.getItem(
    "casinox_player"
  ) || "";


let favorites =
  JSON.parse(
    localStorage.getItem(
      "casinox_favorites"
    ) || "[]"
  );


let currentProvider =
  "all";


let currentCategory =
  "all";


let searchTerm =
  "";


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
  document.getElementById(
    "mobile-profile"
  );


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
   ESTADO
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


  localStorage.setItem(
    "casinox_favorites",
    JSON.stringify(
      favorites
    )
  );


  updateBalance();

}


/* =========================================================
   SALDO
========================================================= */

function updateBalance() {

  if (!balanceElement) {
    return;
  }

  balanceElement.textContent =
    formatCredits(balance);

}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

  if (!toastElement) {
    return;
  }


  toastElement.textContent =
    message;


  toastElement.classList.add(
    "show"
  );


  clearTimeout(
    window.casinoXToast
  );


  window.casinoXToast =
    setTimeout(() => {

      toastElement.classList.remove(
        "show"
      );

    }, 2300);

}


/* =========================================================
   FAVORITOS
========================================================= */

function isFavorite(gameId) {

  return favorites.includes(
    gameId
  );

}


function toggleFavorite(gameId) {

  if (
    isFavorite(gameId)
  ) {

    favorites =
      favorites.filter(
        id => id !== gameId
      );

    showToast(
      "Removido dos favoritos."
    );

  }

  else {

    favorites.push(
      gameId
    );

    showToast(
      "⭐ Adicionado aos favoritos."
    );

  }


  saveState();

  renderLobby();

}


/* =========================================================
   FILTRAR JOGOS
========================================================= */

function getFilteredGames() {

  return games.filter(game => {

    const providerOK =
      currentProvider === "all" ||
      game.provider === currentProvider;


    const categoryOK =
      currentCategory === "all" ||
      game.category === currentCategory;


    const searchOK =
      !searchTerm ||
      game.name
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        ) ||
      game.provider
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        );


    return (
      providerOK &&
      categoryOK &&
      searchOK
    );

  });

}


/* =========================================================
   CARD DO JOGO
========================================================= */

function gameCard(game) {
  const favorite = isFavorite(game.id);
  return `
    <article class="game-card" data-game="${game.id}" tabindex="0" aria-label="Abrir ${game.name}">
      <div class="game-art" style="background-image:url("${game.img}")">
        <span class="hot-badge">${game.tag}</span>
        <button class="heart-btn" data-favorite="${game.id}" aria-label="Favoritar ${game.name}" type="button">${favorite ? "♥" : "♡"}</button>
        <div class="art-shade"></div>
        <div class="card-title">${game.name}</div>
      </div>
      <div class="game-meta">
        <strong>${game.name}</strong>
        <small>${game.provider}</small>
      </div>
    </article>`;
}


function renderGameCards(list) {

  if (!list.length) {

    return `

      <div
        style="
          grid-column:1/-1;
          padding:35px 15px;
          text-align:center;
          color:var(--muted);
        "
      >

        <div
          style="font-size:45px;"
        >
          🔎
        </div>

        <h3>
          Nenhum jogo encontrado
        </h3>

        <p>
          Tente outro nome, categoria
          ou provedor.
        </p>

      </div>

    `;

  }


  return list
    .map(gameCard)
    .join("");

}


/* =========================================================
   BOTÕES DE PROVEDORES
========================================================= */

function renderProviders() {

  return providers
    .map(provider => {

      const active =
        currentProvider === provider.id;


      return `

        <button
          class="provider-btn"
          data-provider="${provider.id}"
          style="
            min-height:42px;
            padding:8px 13px;
            border:1px solid ${
              active
                ? "var(--gold)"
                : "var(--line)"
            };
            border-radius:11px;
            background:${
              active
                ? "rgba(245,196,81,.12)"
                : "var(--panel)"
            };
            color:${
              active
                ? "var(--gold-light)"
                : "var(--muted)"
            };
            white-space:nowrap;
          "
        >

          ${provider.icon}
          ${provider.name}

        </button>

      `;

    })
    .join("");

}


/* =========================================================
   BOTÕES DE CATEGORIA
========================================================= */

function renderCategories() {

  return categories
    .map(category => {

      const active =
        currentCategory === category.id;


      return `

        <button
          class="category-btn"
          data-category="${category.id}"
          style="
            min-height:40px;
            padding:8px 13px;
            border:0;
            border-radius:10px;
            background:${
              active
                ? "var(--gold)"
                : "rgba(255,255,255,.05)"
            };
            color:${
              active
                ? "#111"
                : "var(--muted)"
            };
            white-space:nowrap;
            font-weight:700;
          "
        >

          ${category.icon}
          ${category.name}

        </button>

      `;

    })
    .join("");

}


/* =========================================================
   LOBBY
========================================================= */

function renderLobby() {
  const filtered = getFilteredGames();
  const popular = games.slice(0, 8);
  const newest = games.slice(8, 12);
  const favoriteGames = games.filter(g => favorites.includes(g.id)).slice(0, 8);

  app.innerHTML = `
    <section class="hero-v10">
      <div class="hero-bg" aria-hidden="true"></div>
      <div class="hero-copy">
        <span class="hero-ribbon">JOGO EM DESTAQUE</span>
        <div class="hero-eyebrow">CASINOX • DEMO</div>
        <h1>DRAGON<br><span>FORTUNE</span></h1>
        <p>FORTUNA EM CHAMAS!</p>
        <small>A sorte queima mais forte para os corajosos.</small>
        <button class="hero-play" id="heroGames" type="button">▶ &nbsp; JOGAR AGORA</button>
      </div>
      <div class="hero-side-card">
        <img src="assets/characters/dragon-fortune.jpg" alt="Dragon Fortune">
        <div><b>🐉</b><strong>DRAGON<br>FORTUNE</strong><small>DEMO</small></div>
      </div>
      <button class="hero-arrow left" type="button" aria-label="Anterior">‹</button>
      <button class="hero-arrow right" type="button" aria-label="Próximo">›</button>
      <div class="hero-dots"><i></i><i class="active"></i><i></i><i></i><i></i><i></i></div>
    </section>

    <section class="catalog-section">
      <div class="section-head"><div><h2>🔥 EM ALTA</h2><p>Os destaques do momento</p></div><button class="link-btn" data-scroll-target="games-section">VER TODOS ›</button></div>
      <div class="game-rail">${popular.map(gameCard).join("")}</div>
    </section>

    <section class="catalog-section">
      <div class="section-head"><div><h2>🆕 NOVIDADES</h2><p>Novos títulos demonstrativos</p></div><button class="link-btn">VER TODOS ›</button></div>
      <div class="game-rail">${newest.map(gameCard).join("")}</div>
    </section>

    <section class="catalog-section all-games" id="games-section">
      <div class="section-head"><div><h2>🎮 TODOS OS JOGOS</h2><p>Escolha por provedor ou categoria</p></div></div>
      <div class="tools-row">
        <div class="filter-rail">${renderProviders()}</div>
        <input id="gameSearch" type="search" placeholder="🔎 Buscar jogo..." value="${searchTerm}" autocomplete="off" aria-label="Buscar jogos">
      </div>
      <div class="filter-rail categories-rail">${renderCategories()}</div>
      <div class="game-grid" id="gamesGrid">${renderGameCards(filtered)}</div>
    </section>

    ${favoriteGames.length ? `<section class="catalog-section"><div class="section-head"><div><h2>♥ FAVORITOS</h2><p>Salvos neste dispositivo</p></div></div><div class="game-rail">${favoriteGames.map(gameCard).join("")}</div></section>` : ""}

    <section class="demo-note"><b>CASINOX DEMO</b><span>Créditos virtuais • experiência social • sem depósitos ou saques nesta versão.</span></section>`;

  bindLobbyEvents();
  bindGameEvents();
}


function bindLobbyEvents() {


  /* Busca */

  const search =
    document.getElementById(
      "gameSearch"
    );


  if (search) {

    search.addEventListener(
      "input",
      event => {

        searchTerm =
          event.target.value;

        const grid =
          document.getElementById(
            "gamesGrid"
          );


        if (grid) {

          grid.innerHTML =
            renderGameCards(
              getFilteredGames()
            );

          bindGameEvents();

        }

      }
    );

  }


  /* Provedores */

  document
    .querySelectorAll(
      "[data-provider]"
    )
    .forEach(button => {

      button.onclick = () => {

        currentProvider =
          button.dataset.provider;

        renderLobby();

      };

    });


  /* Categorias */

  document
    .querySelectorAll(
      "[data-category]"
    )
    .forEach(button => {

      button.onclick = () => {

        currentCategory =
          button.dataset.category;

        renderLobby();

      };

    });


  /* Hero */

  const heroGames =
    document.getElementById(
      "heroGames"
    );


  if (heroGames) {

    heroGames.onclick = () => {

      document
        .getElementById(
          "gameSearch"
        )
        ?.focus();

    };

  }


  bindGameEvents();

}


/* =========================================================
   EVENTOS DOS JOGOS
========================================================= */

function bindGameEvents() {

  document
    .querySelectorAll(
      "[data-game]"
    )
    .forEach(card => {

      card.onclick =
        event => {

          if (
            event.target.closest(
              "[data-favorite]"
            )
          ) {

            return;

          }


          openGame(
            card.dataset.game
          );

        };


      card.onkeydown =
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

        };

    });


  document
    .querySelectorAll(
      "[data-favorite]"
    )
    .forEach(button => {

      button.onclick =
        event => {

          event.stopPropagation();

          toggleFavorite(
            button.dataset.favorite
          );

        };

    });

}


/* =========================================================
   NAVEGAÇÃO
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


function navigate(viewName) {

  setActiveMenu(
    viewName
  );


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });


  if (
    viewName === "home" ||
    viewName === "casino"
  ) {

    renderLobby();

  }


  else if (
    viewName === "promos"
  ) {

    renderPromos();

  }


  else if (
    viewName === "ranking"
  ) {

    renderRanking();

  }

}


/* =========================================================
   PROMOÇÕES
========================================================= */

function renderPromos() {

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
            🎉 Boas-vindas
          </b>

          <p>
            Você começa com
            10.000 créditos virtuais.
          </p>

        </div>

        <span class="tag">
          ATIVO
        </span>

      </div>


      <div class="row">

        <div>

          <b>
            🎁 Giro diário
          </b>

          <p>
            Receba 500 créditos
            virtuais por dia.
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


  document
    .getElementById(
      "dailyReward"
    )
    ?.addEventListener(
      "click",
      claimDailyReward
    );

}


/* =========================================================
   RANKING
========================================================= */

function renderRanking() {

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

      ${ranking.map(
        item => `

          <div class="row">

            <b>
              #${item[0]}
              ${item[1]}
            </b>

            <strong>
              ${item[2]}
            </strong>

          </div>

        `
      ).join("")}

    </div>

  `;

}


/* =========================================================
   CRÉDITOS
========================================================= */

function chargeCredits(amount) {

  amount =
    Number(amount);


  if (
    !Number.isFinite(amount) ||
    amount < 10
  ) {

    showToast(
      "Mínimo de 10 créditos."
    );

    return false;

  }


  if (
    amount > balance
  ) {

    showToast(
      "Créditos insuficientes."
    );

    return false;

  }


  balance -=
    Math.floor(amount);


  saveState();


  return true;

}


function addCredits(amount) {

  balance +=
    Math.floor(amount);

  saveState();

}


/* =========================================================
   ABRIR JOGO
========================================================= */

function openGame(gameId) {

  const game =
    games.find(
      item =>
        item.id === gameId
    );


  if (!game) {
    return;
  }


  const modal =
    document.createElement(
      "div"
    );


  modal.className =
    "modal";


  modal.innerHTML = `

    <div class="box">

      <div class="modalhead">

        <div>

          <h2>
            ${game.icon}
            ${game.name}
          </h2>

          <small
            style="color:var(--muted);"
          >
            ${game.provider}
          </small>

        </div>


        <button
          class="close"
          aria-label="Fechar"
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
    .querySelector(
      ".close"
    )
    .onclick = () => {

      modal.remove();

    };


  const stage =
    modal.querySelector(
      "#gameStage"
    );


  if (
    gameId === "lucky-stars"
  ) {

    renderSlots(stage);

  }

  else if (
    gameId === "royal-roulette"
  ) {

    renderRoulette(stage);

  }

  else if (
    gameId === "blackjack-pro" ||
    gameId === "live-blackjack"
  ) {

    renderBlackjack(stage);

  }

  else if (
    gameId === "rocket-crash"
  ) {

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
   INPUT DE APOSTA VIRTUAL
========================================================= */

function stakeInput() {

  return `

    <input
      id="stake"
      type="number"
      min="10"
      value="100"
      inputmode="numeric"
      aria-label="Créditos virtuais"
    >

  `;

}


/* =========================================================
   SLOTS
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
    .querySelector(
      "#spin"
    )
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
        [
          ...stage.querySelectorAll(
            ".reel"
          )
        ];


      const result =
        reels.map(
          () =>
            symbols[
              Math.floor(
                Math.random() *
                symbols.length
              )
            ]
        );


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


      if (
        winnings > 0
      ) {

        addCredits(
          winnings
        );

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
   ROLETA
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
    .querySelector(
      "#spinRoulette"
    )
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


      addCredits(
        winnings
      );


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
   BLACKJACK
========================================================= */

function renderBlackjack(stage) {

  stage.innerHTML = `

    <div>

      <div style="font-size:80px;">
        🃏
      </div>

      <p>
        Mesa demonstrativa.
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
    .querySelector(
      "#deal"
    )
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


      if (
        player > 21
      ) {

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


      if (
        player === dealer
      ) {

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
   CRASH
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
    .querySelector(
      "#launch"
    )
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
        setInterval(
          () => {

            current += 0.1;


            multiplier.textContent =
              current.toFixed(2) +
              "x";


            if (
              current >=
              crashPoint
            ) {

              clearInterval(
                interval
              );


              if (
                Math.random() > 0.3
              ) {

                const winnings =
                  amount *
                  current;


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

          },
          70
        );

    };

}


/* =========================================================
   JOGOS AINDA NÃO IMPLEMENTADOS
========================================================= */

function renderComingSoon(
  stage,
  game
) {

  stage.innerHTML = `

    <div>

      <div
        style="font-size:80px;"
      >
        ${game.icon}
      </div>


      <h3>
        ${game.name}
      </h3>


      <p>
        Provedor:
        <b>${game.provider}</b>
      </p>


      <p>
        Este jogo é um item demonstrativo
        do lobby. A integração real deverá
        utilizar uma fonte licenciada.
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
    24 *
    60 *
    60 *
    1000;


  if (
    Date.now() - last <
    oneDay
  ) {

    showToast(
      "Recompensa já resgatada hoje."
    );

    return;

  }


  balance +=
    500;


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

  if (
    playerName
  ) {

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
   MENU PRINCIPAL
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

if (
  loginButton
) {

  loginButton.onclick =
    openProfile;

}


if (
  mobileProfile
) {

  mobileProfile.onclick =
    openProfile;

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

updateBalance();

navigate(
  "home"
);


document.addEventListener("click", event => {
  const button = event.target.closest("[data-scroll-target]");
  if (!button) return;
  const target = document.getElementById(button.dataset.scrollTarget);
  if (target) target.scrollIntoView({behavior:"smooth", block:"start"});
});



window.CASINOX_VERSION="1.0";
