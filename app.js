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
  {id:"moon-temple",name:"Moon Temple",provider:"PG",category:"Slots",img:"assets/characters/moon-temple.jpg",tag:"NEW",icon:"🌙"},
  {id:"neon-roulette",name:"Neon Roulette",provider:"Evolution",category:"Cassino",img:"assets/characters/neon-roulette.jpg",tag:"LIVE",icon:"◎"}
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
      <div class="game-art">
        <img class="game-image" src="${game.img}" alt="${game.name}" loading="lazy" decoding="async" onerror="this.style.display='none';this.parentElement.classList.add('image-failed')">
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
  const game = games.find(item => item.id === gameId);
  if (!game) return;

  const modal = document.createElement("div");
  modal.className = "modal game-modal-v13";
  modal.innerHTML = `
    <div class="box game-box-v13">
      <div class="modalhead">
        <div class="game-head-v13">
          <img src="${game.img}" alt="${game.name}" class="game-head-img-v13">
          <div>
            <h2>${game.icon} ${game.name}</h2>
            <small>${game.provider} • DEMO • créditos virtuais</small>
          </div>
        </div>
        <button class="close" aria-label="Fechar">×</button>
      </div>
      <div class="stage stage-v13" id="gameStage"></div>
    </div>`;
  document.body.appendChild(modal);
  modal.querySelector(".close").onclick = () => modal.remove();
  modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });

  const stage = modal.querySelector("#gameStage");
  if (game.id === "neon-roulette") renderRouletteV13(stage, game);
  else renderCharacterSlotsV13(stage, game);
}

function renderCharacterSlotsV13(stage, game) {
  const themes = {
    "lucky-rabbit": ["🐰","💰","🥕","7️⃣","💎"],
    "golden-bull": ["🐂","🪙","💰","7️⃣","💎"],
    "dragon-fortune": ["🐉","🔥","🪙","7️⃣","💎"],
    "tiger-riches": ["🐯","💰","🪙","7️⃣","💎"],
    "lion-king": ["🦁","👑","💰","7️⃣","💎"],
    "royal-bunny": ["🐰","👑","💎","7️⃣","🪙"],
    "fox-fortune": ["🦊","🔮","💰","7️⃣","💎"],
    "dragon-fire": ["🐲","🔥","💰","7️⃣","💎"],
    "golden-toad": ["🐸","🪙","💰","7️⃣","💎"],
    "treasure-panda": ["🐼","🎁","🪙","7️⃣","💎"],
    "moon-temple": ["🌙","🐰","🔮","7️⃣","💎"],
    "neon-roulette": ["🎡","💎","7️⃣","🪙","✨"]
  };
  const symbols = themes[game.id] || [game.icon,"💰","⭐","7️⃣","💎"];
  stage.innerHTML = `
    <div class="slot-machine-v14">
      <div class="slot-banner-v14">
        <img src="${game.img}" alt="${game.name}">
        <div><b>${game.name.toUpperCase()}</b><span>DEMO • CRÉDITOS VIRTUAIS</span></div>
      </div>
      <div class="reel-window-v14">
        <div class="payline-v14"></div>
        <div class="reels reels-v14">${[0,1,2,3,4].map(i=>`<div class="reel reel-v14" data-reel="${i}"><span>${symbols[(i+1)%symbols.length]}</span><span>${symbols[i%symbols.length]}</span><span>${symbols[(i+2)%symbols.length]}</span></div>`).join("")}</div>
      </div>
      <div class="slot-status-v14"><span>APOSTA</span><strong id="stakeDisplay">100</strong><span>créditos</span><b id="balanceInGame">Saldo ${formatCredits(balance)}</b></div>
      <div class="controls controls-v14">
        <button class="bet-btn" data-bet="-">−</button>
        <input id="stake" type="number" min="10" step="10" value="100" inputmode="numeric" aria-label="Valor da aposta">
        <button class="bet-btn" data-bet="+">+</button>
        <button class="primary spin-btn-v14" id="spin">GIRAR</button>
      </div>
      <p id="gameResult" class="game-result-v14">Boa sorte! Escolha sua aposta e gire.</p>
      <div class="paytable-v14"><span>5 iguais <b>10x</b></span><span>4 iguais <b>5x</b></span><span>3 iguais <b>2x</b></span><span>2 iguais <b>1x</b></span></div>
    </div>`;

  const input=stage.querySelector('#stake'), display=stage.querySelector('#stakeDisplay'), bal=stage.querySelector('#balanceInGame');
  const update=()=>{ let v=Math.max(10,Math.floor(Number(input.value)||10)); input.value=v; display.textContent=formatCredits(v); };
  input.addEventListener('input',update);
  stage.querySelectorAll('[data-bet]').forEach(b=>b.onclick=()=>{input.value=Math.max(10,Math.floor(Number(input.value)||100)+(b.dataset.bet==='+'?50:-50));update();});
  const refreshBalance=()=>{bal.textContent='Saldo '+formatCredits(balance);updateBalance();};
  stage.querySelector('#spin').onclick=()=>{
    const amount=Math.max(10,Math.floor(Number(input.value)||10));
    if(!chargeCredits(amount)) return;
    const reels=[...stage.querySelectorAll('.reel-v14')];
    const btn=stage.querySelector('#spin'); btn.disabled=true; btn.textContent='GIRANDO...';
    let ticks=0;
    const timer=setInterval(()=>{
      reels.forEach(r=>{ r.classList.add('rolling-v14'); r.querySelectorAll('span').forEach(x=>x.textContent=symbols[Math.floor(Math.random()*symbols.length)]); });
      if(++ticks>=18){
        clearInterval(timer);
        const result=[];
        reels.forEach((r,i)=>{r.classList.remove('rolling-v14'); const chosen=symbols[Math.floor(Math.random()*symbols.length)]; r.querySelectorAll('span').forEach(x=>x.textContent=chosen); result.push(chosen);});
        const counts={}; result.forEach(x=>counts[x]=(counts[x]||0)+1);
        const best=Math.max(...Object.values(counts));
        const mult=best>=5?10:best>=4?5:best>=3?2:best>=2?1:0;
        const winnings=amount*mult;
        if(winnings)addCredits(winnings);
        stage.querySelector('#gameResult').innerHTML=winnings?`🎉 <b>${formatCredits(winnings)}</b> créditos de retorno virtual!`:'Sem prêmio nesta rodada. Tente novamente.';
        btn.disabled=false; btn.textContent='GIRAR'; refreshBalance();
      }
    },70);
  };
}

function renderRouletteV13(stage, game) {
  stage.innerHTML=`
    <div class="roulette-v13">
      <div class="roulette-art-v13"><img src="${game.img}" alt="${game.name}"><div class="wheel wheel-v13"><b id="rouletteNumber">?</b></div></div>
      <p>Roleta demonstrativa • créditos virtuais</p>
      <div class="controls controls-v13">${stakeInput()}<button class="primary spin-btn-v13" id="spinRoulette">GIRAR ROLETA</button></div>
      <p id="gameResult" class="game-result-v13">Escolha sua aposta.</p>
    </div>`;
  stage.querySelector('#spinRoulette').onclick=()=>{
    const amount=Number(stage.querySelector('#stake').value); if(!chargeCredits(amount))return;
    const btn=stage.querySelector('#spinRoulette');btn.disabled=true;btn.textContent='GIRANDO...';
    const wheel=stage.querySelector('.wheel-v13'); let n=0;
    const timer=setInterval(()=>{n+=45;wheel.style.transform=`rotate(${n}deg)`;},45);
    setTimeout(()=>{clearInterval(timer);const number=Math.floor(Math.random()*37);const winnings=number===0?amount*10:amount*2;addCredits(winnings);stage.querySelector('#rouletteNumber').textContent=number;stage.querySelector('#gameResult').innerHTML=`Número <b>${number}</b> • retorno virtual <b>${formatCredits(winnings)}</b> créditos.`;btn.disabled=false;btn.textContent='GIRAR ROLETA';updateBalance();},1300);
  };
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



window.CASINOX_VERSION="1.8";

/* CASINOX v1.7 — GAME ENGINE IMERSIVO / OFFLINE DEMO */
(function(){
  const games={
    "Lucky Rabbit":{img:"assets/characters/lucky-rabbit.jpg",tag:"FORTUNE RABBIT",accent:"gold",symbols:["🐰","🧧","🪙","🥇","💎","👑","🍀","7️⃣"],pay:"🐰 3× = 2x • 4× = 5x • 5× = 12x"},
    "Golden Bull":{img:"assets/characters/golden-bull.jpg",tag:"GOLDEN BULL",accent:"red",symbols:["🐂","🧧","🪙","🥇","💎","👑","🔥","7️⃣"],pay:"🐂 3× = 2x • 4× = 6x • 5× = 15x"},
    "Dragon Fortune":{img:"assets/characters/dragon-fortune.jpg",tag:"DRAGON FORTUNE",accent:"red",symbols:["🐉","🏮","🪙","🥇","💎","👑","🔥","7️⃣"],pay:"🐉 3× = 2x • 4× = 7x • 5× = 20x"},
    "Tiger Riches":{img:"assets/characters/tiger-riches.jpg",tag:"TIGER RICHES",accent:"orange",symbols:["🐯","🧧","🪙","🥇","💎","👑","🔥","7️⃣"],pay:"🐯 3× = 2x • 4× = 6x • 5× = 18x"},
    "Lion King":{img:"assets/characters/lion-king.jpg",tag:"LION KING",accent:"gold",symbols:["🦁","👑","🪙","🥇","💎","🔥","🍀","7️⃣"],pay:"🦁 3× = 2x • 4× = 6x • 5× = 16x"},
    "Royal Bunny":{img:"assets/characters/royal-bunny.jpg",tag:"ROYAL BUNNY",accent:"pink",symbols:["🐇","👑","🪙","🥇","💎","💖","🍀","7️⃣"],pay:"🐇 3× = 2x • 4× = 5x • 5× = 14x"},
    "Fox Fortune":{img:"assets/characters/fox-fortune.jpg",tag:"FOX FORTUNE",accent:"orange",symbols:["🦊","🧧","🪙","🥇","💎","🔥","🍀","7️⃣"],pay:"🦊 3× = 2x • 4× = 6x • 5× = 16x"},
    "Dragon Fire":{img:"assets/characters/dragon-fire.jpg",tag:"DRAGON FIRE",accent:"red",symbols:["🐲","🔥","🪙","🥇","💎","👑","🏮","7️⃣"],pay:"🐲 3× = 2x • 4× = 7x • 5× = 20x"}
  };
  const fallback={img:"assets/characters/dragon-fortune.jpg",tag:"CASINOX ORIGINAL",accent:"gold",symbols:["⭐","🪙","💎","👑","🔥","🍀","7️⃣"],pay:"3× = 2x • 4× = 5x • 5× = 10x"};
  let overlay=null, balance=Number(localStorage.getItem('casinox_balance')||10000), bet=Number(localStorage.getItem('casinox_bet')||100), autoTimer=null, spinning=false;
  const money=n=>Number(n||0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
  const save=()=>{localStorage.setItem('casinox_balance',String(balance));localStorage.setItem('casinox_bet',String(bet));};
  const cfg=name=>games[name]||fallback;
  const randomSymbol=s=>s[Math.floor(Math.random()*s.length)];
  function resultGrid(c){return Array.from({length:5},()=>Array.from({length:3},()=>randomSymbol(c.symbols)));}
  function winFor(g,c){
    const mid=g.map(col=>col[1]); const counts={}; mid.forEach(x=>counts[x]=(counts[x]||0)+1);
    const best=Math.max(...Object.values(counts));
    let mult=best>=5?10:best>=4?5:best>=3?2:0;
    if(best>=5 && mid.every(x=>x===c.symbols[0])) mult+=2;
    return {best,mult,pick:mid.find(x=>counts[x]===best)||mid[0]};
  }
  function cellMarkup(sym){return `<div class="cx17-cell"><span>${sym}</span></div>`}
  function renderGrid(g){
    if(!overlay)return;
    overlay.querySelectorAll('.cx17-reel').forEach((r,i)=>{r.innerHTML=g[i].map(cellMarkup).join('')});
  }
  function updateHUD(){
    if(!overlay)return;
    overlay.querySelector('[data-balance]').textContent=money(balance);
    overlay.querySelector('[data-bet]').textContent=money(bet);
    overlay.querySelector('[data-credit]').textContent=money(balance);
  }
  function close(){
    if(autoTimer){clearInterval(autoTimer);autoTimer=null}
    if(overlay){overlay.remove();overlay=null;document.body.style.overflow=''}
  }
  function adjustBet(delta){bet=Math.max(1,Math.min(Math.max(1,balance),bet+delta));save();updateHUD()}
  function setMessage(text,kind=''){if(!overlay)return;const m=overlay.querySelector('[data-message]');m.textContent=text;m.className='cx17-message '+kind}
  function beep(freq=420,dur=.06){try{const A=window.AudioContext||window.webkitAudioContext;if(!A)return;const a=new A(),o=a.createOscillator(),g=a.createGain();o.frequency.value=freq;o.type='sine';g.gain.value=.025;o.connect(g);g.connect(a.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+dur);o.stop(a.currentTime+dur)}catch(e){}}
  function spin(){
    if(!overlay||spinning)return;
    if(balance<bet){setMessage('Saldo virtual insuficiente. Reduza a aposta.','bad');beep(150,.12);return}
    spinning=true; balance-=bet; save(); updateHUD(); setMessage('Girando…','rolling');
    const reels=[...overlay.querySelectorAll('.cx17-reel')]; reels.forEach(r=>r.classList.add('is-spinning'));
    const turbo=overlay.querySelector('[data-turbo]').classList.contains('active'); const step=turbo?85:145;
    let tick=0; const max=turbo?9:15;
    const timer=setInterval(()=>{
      reels.forEach((r,i)=>{if(tick>=Math.min(max,6+i*2))return; r.innerHTML=Array.from({length:3},()=>cellMarkup(randomSymbol(cfg(overlay.dataset.game).symbols))).join('')});
      tick++; if(tick>=max){clearInterval(timer); const c=cfg(overlay.dataset.game),g=resultGrid(c); renderGrid(g); reels.forEach((r,i)=>setTimeout(()=>r.classList.remove('is-spinning'),i*90));
        const w=winFor(g,c), prize=bet*w.mult; if(prize)balance+=prize; save(); updateHUD();
        if(prize){setMessage(`✨ ${w.pick} • PRÊMIO + ${money(prize)} créditos`,'win');overlay.querySelector('.cx17-stage').classList.add('big-win');setTimeout(()=>overlay?.querySelector('.cx17-stage')?.classList.remove('big-win'),900);beep(760,.1);setTimeout(()=>beep(980,.12),90)}
        else setMessage('Boa rodada. Gire novamente!');
        spinning=false;
      }
    },step);
  }
  function toggleAuto(){
    if(!overlay)return;const b=overlay.querySelector('[data-auto]');b.classList.toggle('active');
    if(b.classList.contains('active')){setMessage('AUTO ativado • rodadas virtuais','rolling');autoTimer=setInterval(()=>{if(!spinning)spin()},1300)}
    else {clearInterval(autoTimer);autoTimer=null;setMessage('AUTO desativado')}
  }
  function toggleTurbo(){if(!overlay)return;overlay.querySelector('[data-turbo]').classList.toggle('active')}
  function open(name){
    close(); const c=cfg(name); overlay=document.createElement('section'); overlay.className='cx17-shell'; overlay.dataset.game=name;
    overlay.innerHTML=`
      <div class="cx17-backdrop" style="background-image:linear-gradient(180deg,rgba(9,4,17,.12),rgba(8,3,10,.74) 48%,#08050a 100%),url('${c.img}')"></div>
      <header class="cx17-top">
        <button class="cx17-icon" data-back aria-label="Voltar">‹</button>
        <div class="cx17-brand"><small>CASINOX ORIGINAL</small><strong>${c.tag}</strong></div>
        <div class="cx17-top-balance">💰 <b data-balance>${money(balance)}</b></div>
      </header>
      <main class="cx17-main">
        <div class="cx17-hero"><img src="${c.img}" alt="${c.tag}"><div><span>DEMO • OFFLINE</span><strong>${name}</strong><small>Créditos virtuais</small></div></div>
        <div class="cx17-jackpot"><span>PRÊMIO DA RODADA</span><strong data-credit>${money(balance)}</strong></div>
        <section class="cx17-stage" aria-label="Máquina de caça-níquel">
          <div class="cx17-frame-glow"></div><div class="cx17-reels">${Array.from({length:5},()=>'<div class="cx17-reel"></div>').join('')}<div class="cx17-payline"></div></div>
        </section>
        <div class="cx17-message" data-message>Pronto para girar.</div>
      </main>
      <footer class="cx17-controls">
        <div class="cx17-stats"><div><small>SALDO</small><b data-credit>${money(balance)}</b></div><div><small>APOSTA</small><b data-bet>${money(bet)}</b></div><div><small>PRÊMIO</small><b data-prize>0,00</b></div></div>
        <div class="cx17-control-row"><button class="cx17-round" data-minus>−</button><button class="cx17-spin" data-spin><span>GIRAR</span><small>RODADA VIRTUAL</small></button><button class="cx17-round" data-plus>+</button></div>
        <div class="cx17-tools"><button data-turbo>⚡ TURBO</button><button data-auto>⟳ AUTO</button><button data-pay>🏆 PRÊMIOS</button></div>
        <div class="cx17-payline-text">${c.pay}</div>
      </footer>`;
    document.body.appendChild(overlay);document.body.style.overflow='hidden';renderGrid(resultGrid(c));updateHUD();
    overlay.querySelector('[data-back]').onclick=(e)=>{e.stopPropagation();close();}; overlay.querySelector('[data-minus]').onclick=(e)=>{e.stopPropagation();adjustBet(-10);}; overlay.querySelector('[data-plus]').onclick=(e)=>{e.stopPropagation();adjustBet(10);}; overlay.querySelector('[data-spin]').onclick=(e)=>{e.stopPropagation();spin();}; overlay.querySelector('[data-turbo]').onclick=(e)=>{e.stopPropagation();toggleTurbo();}; overlay.querySelector('[data-auto]').onclick=(e)=>{e.stopPropagation();toggleAuto();};
    overlay.querySelector('[data-pay]').onclick=(e)=>{e.stopPropagation();setMessage(c.pay,'win');};
  }
  document.addEventListener('click',e=>{
     // IMPORTANT: never treat clicks inside the game shell as a request to open a game.
     // The shell itself has data-game, so the old capture handler reopened the game
     // when the user tapped Back, Spin, Turbo, Auto, or even empty areas.
     if(e.target.closest('.cx17-shell')) return;
     const el=e.target.closest('[data-game]');
     if(!el) return;
     const n=el.dataset.game;
     if(!n) return;
     e.preventDefault();
     e.stopPropagation();
     open(n);
   },false);
  window.CasinoXDemoGame={open,close};
})();

/* CASINOX v1.6 — lobby dinâmica */
(function(){
const G=[
["Lucky Rabbit","assets/characters/lucky-rabbit.jpg","Slots"],["Golden Bull","assets/characters/golden-bull.jpg","Slots"],
["Dragon Fortune","assets/characters/dragon-fortune.jpg","Slots"],["Tiger Riches","assets/characters/tiger-riches.jpg","Slots"],
["Lion King","assets/characters/lion-king.jpg","Slots"],["Royal Bunny","assets/characters/royal-bunny.jpg","Slots"],
["Fox Fortune","assets/characters/fox-fortune.jpg","Slots"],["Dragon Fire","assets/characters/dragon-fire.jpg","Slots"],
["Golden Toad","assets/characters/golden-toad.jpg","Slots"],["Treasure Panda","assets/characters/treasure-panda.jpg","Slots"],
["Moon Temple","assets/characters/moon-temple.jpg","Slots"],["Neon Roulette","assets/characters/neon-roulette.jpg","Casino"],
["Rocket Cash","assets/characters/rocket-cash.jpg","Slots"],["Fortune Gems","assets/characters/fortune-gems.jpg","Slots"],
["Golden Pearls","assets/characters/golden-pearls.jpg","Slots"],["Wild Jungle","assets/characters/wild-jungle.jpg","Slots"]];
const KF="casinox_favorites",KR="casinox_recent";
const get=k=>{try{return JSON.parse(localStorage.getItem(k)||"[]")}catch(e){return[]}},put=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const find=n=>G.find(g=>g[0].toLowerCase()===n.toLowerCase());
let selected="Todos",query="";
function openGame(name){
if(window.CasinoXDemoGame?.open)window.CasinoXDemoGame.open(name);
let r=get(KR).filter(x=>x!==name);r.unshift(name);put(KR,r.slice(0,8));render();
}
function toggle(name){let f=get(KF);f=f.includes(name)?f.filter(x=>x!==name):[...f,name];put(KF,f);render()}
function card(g){
const fav=get(KF).includes(g[0]),e=document.createElement("article");e.className="casinox-lobby-card";
e.innerHTML=`<button class="casinox-fav ${fav?"active":""}">${fav?"♥":"♡"}</button><img src="${g[1]}" alt="${g[0]}" loading="lazy"><div class="lobby-card-info"><strong>${g[0]}</strong><span>${g[2]} • demo</span></div>`;
e.querySelector(".casinox-fav").onclick=x=>{x.stopPropagation();toggle(g[0])};e.onclick=()=>openGame(g[0]);return e;
}
function section(title,items,grid=false){
const s=document.createElement("section");s.innerHTML=`<div class="casinox-section-head"><h2>${title}</h2></div>`;
const r=document.createElement("div");r.className=grid?"casinox-game-grid":"casinox-rail";
items.forEach(g=>r.appendChild(card(g)));if(!items.length)r.innerHTML='<div class="casinox-empty">Nenhum jogo encontrado.</div>';s.appendChild(r);return s;
}
function render(){
const host=document.getElementById("casinox-dynamic-lobby");if(!host)return;host.innerHTML="";
const c=document.createElement("section");c.innerHTML='<div class="casinox-section-head"><h2>🎮 Explorar</h2></div><input class="casinox-search" placeholder="Buscar jogo..."><div class="casinox-chip-row"></div>';
const chips=c.querySelector(".casinox-chip-row");["Todos","Slots","Casino","Favoritos"].forEach(x=>{let b=document.createElement("button");b.className="casinox-chip "+(selected===x?"active":"");b.textContent=x;b.onclick=()=>{selected=x;render()};chips.appendChild(b)});
const inp=c.querySelector(".casinox-search");inp.value=query;inp.oninput=e=>{query=e.target.value;render()};host.appendChild(c);
const fav=get(KF),recent=get(KR),pool=G.filter(g=>(!query||g[0].toLowerCase().includes(query.toLowerCase()))&&(selected==="Todos"||selected==="Favoritos"?selected==="Todos"||fav.includes(g[0]):g[2]===selected));
if(!query&&selected==="Todos"){
const rec=recent.map(find).filter(Boolean),ft=fav.map(find).filter(Boolean);
if(rec.length)host.appendChild(section("🕘 Jogados recentemente",rec));
if(ft.length)host.appendChild(section("❤️ Favoritos",ft));
host.appendChild(section("🔥 Em alta",pool.slice(0,8)));host.appendChild(section("🆕 Novidades",pool.slice(8,14)));host.appendChild(section("🎰 Todos os jogos",pool,true));
}else host.appendChild(section("🔎 Resultados",pool,true));
}
function mount(){if(document.getElementById("casinox-dynamic-lobby"))return;let main=document.querySelector("main")||document.body,h=document.createElement("div");h.id="casinox-dynamic-lobby";main.appendChild(h);render()}
document.addEventListener("DOMContentLoaded",mount);setTimeout(mount,500);setTimeout(mount,1500);
})();


/* CASINOX v2.0 — engine visual próprio. O sistema de toque da v1.9 permanece intacto. */
(function(){
  const symbols=["🐰","🪙","💎","🧧","👑","🥕","🔔","🟡","🌸","💰"];
  const payoutMap={3:2,4:5,5:10};
  let shell=null,balance=Number(localStorage.getItem("casinox_balance")||10000),bet=Number(localStorage.getItem("casinox_bet")||100);
  let turbo=false,auto=false,autoTimer=null,spinning=false;

  function save(){localStorage.setItem("casinox_balance",String(balance));localStorage.setItem("casinox_bet",String(bet))}
  function makeGrid(){
    const heights=[3,4,3];
    return heights.map(h=>Array.from({length:h},()=>symbols[Math.floor(Math.random()*symbols.length)]));
  }
  function middleWin(g){
    const c={};g.forEach(r=>c[r[1]]=(c[r[1]]||0)+1);
    let sym="",max=0;Object.keys(c).forEach(k=>{if(c[k]>max){max=c[k];sym=k}});
    return {count:max,sym,pay:(payoutMap[max]||0)*bet};
  }
  function draw(g){
    shell?.querySelectorAll(".cx20-reel").forEach((r,i)=>{
      const col=g[i]||[];
      r.style.setProperty("--cells", String(col.length));
      r.innerHTML=col.map((symbol,j)=>`<div class="cx20-symbol cell-${j+1}">${symbol}</div>`).join("");
    });
  }
  function open(name){
    close();
    shell=document.createElement("section");shell.className="cx20-shell";
    const gameKey=(()=>{
      const n=String(name||"").toLowerCase();
      if(n.includes("golden bull")) return "golden-bull";
      if(n.includes("dragon fire")) return "dragon-fire";
      if(n.includes("dragon")) return "dragon-fortune";
      if(n.includes("tiger")) return "tiger-riches";
      if(n.includes("lion")) return "lion-king";
      if(n.includes("panda")) return "treasure-panda";
      return "lucky-rabbit";
    })();
    const bgMap={
      "lucky-rabbit":"assets/reference/lucky-rabbit-reference.png",
      "golden-bull":"assets/characters/bg-golden-bull.jpg",
      "dragon-fortune":"assets/characters/bg-dragon-fortune.jpg",
      "dragon-fire":"assets/characters/bg-dragon-fire.jpg",
      "tiger-riches":"assets/characters/bg-tiger-riches.jpg",
      "lion-king":"assets/characters/bg-lion-king.jpg",
      "treasure-panda":"assets/characters/bg-treasure-panda.jpg"
    };
    shell.dataset.game=gameKey;
    shell.style.setProperty("--cx34-bg", `url("${bgMap[gameKey]||bgMap["lucky-rabbit"]}")`);
    shell.innerHTML=`
      <header class="cx20-top">
        <button class="cx20-back" type="button">‹</button>
        <div class="cx20-brand"><b>${name}</b><small>CASINOX • CRÉDITOS VIRTUAIS</small></div>
        <span class="cx34-version">v3.5</span>
        <div class="cx20-wallet">🪙 <span class="cx20-wallet-value">${balance.toLocaleString("pt-BR")}</span></div>
      </header>
      <main class="cx20-stage">
        <div class="cx20-glow"></div>
        <div class="cx34-art-anchor" aria-hidden="true"></div>
        <div class="cx20-machine"><div class="cx20-machine-inner"><div class="cx20-reels cx20-reels-343">
          <div class="cx20-reel cx20-reel-side"></div>
          <div class="cx20-reel cx20-reel-center"></div>
          <div class="cx20-reel cx20-reel-side"></div>
          <div class="cx20-line"></div>
        </div></div></div>
        <div class="cx20-prize">BOA SORTE</div>
        <div class="cx20-stats"><div class="cx20-stat"><small>SALDO</small><b class="st-balance">${balance.toLocaleString("pt-BR")}</b></div><div class="cx20-stat"><small>APOSTA</small><b class="st-bet">${bet.toLocaleString("pt-BR")}</b></div><div class="cx20-stat"><small>GANHO</small><b class="st-win">0</b></div></div>
      </main>
      <section class="cx20-controls">
        <div class="cx20-main-controls">
          <div class="cx20-bet"><button class="cx20-minus" type="button">−</button><div class="cx20-bet-value"><small>APOSTA</small><b>${bet}</b></div><button class="cx20-plus" type="button">+</button></div>
          <button class="cx20-spin" type="button">GIRAR</button>
        </div>
        <div class="cx20-tools"><button class="cx20-tool" data-tool="turbo" type="button">⚡ TURBO</button><button class="cx20-tool" data-tool="auto" type="button">🔄 AUTO</button><button class="cx20-tool" data-tool="pay" type="button">🏆 PRÊMIOS</button></div>
      </section>
      <div class="cx20-paytable"><div class="cx20-paypanel"><button class="cx20-tool pay-close" type="button">FECHAR</button><h3>Tabela de prêmios</h3><div class="cx20-payrow"><span>3 símbolos iguais</span><b>2× aposta</b></div><div class="cx20-payrow"><span>4 símbolos iguais</span><b>5× aposta</b></div><div class="cx20-payrow"><span>5 símbolos iguais</span><b>10× aposta</b></div><div class="cx20-payrow"><span>👑 🐰 💎 🪙</span><b>Combinações demo</b></div></div></div>`;
    document.body.appendChild(shell);document.body.style.overflow="hidden";draw(makeGrid());

    shell.querySelector(".cx20-back").addEventListener("click",e=>{e.preventDefault();e.stopPropagation();close()});
    shell.querySelector(".cx20-minus").addEventListener("click",e=>{e.stopPropagation();bet=Math.max(10,bet-10);sync();save()});
    shell.querySelector(".cx20-plus").addEventListener("click",e=>{e.stopPropagation();bet=Math.min(Math.max(10,balance),bet+10);sync();save()});
    shell.querySelector(".cx20-spin").addEventListener("click",e=>{e.stopPropagation();spin()});
    shell.querySelector('[data-tool="turbo"]').addEventListener("click",e=>{e.stopPropagation();turbo=!turbo;e.currentTarget.classList.toggle("active",turbo)});
    shell.querySelector('[data-tool="auto"]').addEventListener("click",e=>{e.stopPropagation();toggleAuto()});
    shell.querySelector('[data-tool="pay"]').addEventListener("click",e=>{e.stopPropagation();shell.querySelector(".cx20-paytable").classList.add("show")});
    shell.querySelector(".pay-close").addEventListener("click",e=>{e.stopPropagation();shell.querySelector(".cx20-paytable").classList.remove("show")});
  }
  function sync(){
    if(!shell)return;
    shell.querySelector(".cx20-wallet-value").textContent=balance.toLocaleString("pt-BR");
    shell.querySelector(".st-balance").textContent=balance.toLocaleString("pt-BR");
    shell.querySelector(".st-bet").textContent=bet.toLocaleString("pt-BR");
    shell.querySelector(".cx20-bet-value b").textContent=bet;
  }
  function spin(){
    if(!shell||spinning)return;
    if(balance<bet){shell.querySelector(".cx20-prize").textContent="SALDO INSUFICIENTE";return}
    spinning=true;balance-=bet;sync();
    const button=shell.querySelector(".cx20-spin");button.disabled=true;
    shell.querySelector(".cx20-prize").textContent="GIRANDO…";
    const cycles=turbo?4:12, delay=turbo?45:85;let n=0;
    const timer=setInterval(()=>{draw(makeGrid());if(++n>=cycles){clearInterval(timer);finish(button)}},delay);
  }
  function finish(button){
    const g=makeGrid();draw(g);const w=middleWin(g);balance+=w.pay;sync();
    shell.querySelector(".st-win").textContent=w.pay.toLocaleString("pt-BR");
    const p=shell.querySelector(".cx20-prize");
    p.textContent=w.pay?`✨ PRÊMIO +${w.pay.toLocaleString("pt-BR")}`:"Boa rodada — tente novamente!";
    p.classList.toggle("win",!!w.pay);setTimeout(()=>p.classList.remove("win"),1300);
    button.disabled=false;spinning=false;save();
    if(auto)autoTimer=setTimeout(spin,700);
  }
  function toggleAuto(){
    auto=!auto;const b=shell.querySelector('[data-tool="auto"]');b.classList.toggle("active",auto);
    if(auto&&!spinning)spin();else if(!auto&&autoTimer){clearTimeout(autoTimer);autoTimer=null}
  }
  function close(){
    if(autoTimer){clearTimeout(autoTimer);autoTimer=null}auto=false;spinning=false;
    if(shell){shell.remove();shell=null;document.body.style.overflow=""}
  }
  window.CasinoXSpin=spin;
  window.CasinoXPremiumGame={open,close};
  const old=window.CasinoXDemoGame?.open;
  if(window.CasinoXDemoGame)window.CasinoXDemoGame.open=function(name){open(name)};
})();


/* CASINOX v2.1 PATCH — mobile stability */
(function(){
  const oldPremium=window.CasinoXPremiumGame;
  if(!oldPremium) return;

  // Keep the existing premium UI but replace the slow/random spin controller
  // with a lightweight, non-blocking controller.
  const originalOpen=oldPremium.open;

  oldPremium.open=function(name){
    originalOpen(name);
    const shell=document.querySelector(".cx20-shell");
    if(!shell)return;

    // Prevent the old global card/game handlers from seeing any game-screen touch.
    shell.addEventListener("click",function(e){e.stopPropagation()},true);
    shell.addEventListener("pointerdown",function(e){e.stopPropagation()},true);
    shell.addEventListener("touchstart",function(e){e.stopPropagation()},true);

    // Replace spin button with a stable handler.
    const btn=shell.querySelector(".cx20-spin");
    if(btn){
      const fresh=btn.cloneNode(true);
      btn.replaceWith(fresh);
      fresh.disabled=false;
      fresh.addEventListener("click",function(e){
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
        if(typeof window.CasinoXSpin==="function") window.CasinoXSpin();
      }, true);
    }

    // Make the paytable explicit and readable.
    const pay=shell.querySelector(".cx20-paytable");
    const payPanel=shell.querySelector(".cx20-paypanel");
    if(payPanel){
      payPanel.style.fontSize="15px";
      payPanel.style.color="#fff";
      payPanel.querySelectorAll(".cx20-payrow").forEach(r=>{
        r.style.fontSize="15px"; r.style.padding="13px 4px";
      });
      const close=payPanel.querySelector(".pay-close");
      if(close){close.textContent="FECHAR";close.style.fontSize="13px";close.style.marginBottom="8px"}
    }
    if(pay){
      pay.addEventListener("click",e=>{
        if(e.target===pay)pay.classList.remove("show");
      });
    }

    // Back must only close the current game and return to the current lobby DOM.
    const back=shell.querySelector(".cx20-back");
    if(back){
      const freshBack=back.cloneNode(true);
      back.replaceWith(freshBack);
      freshBack.addEventListener("click",function(e){
        e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();
        if(window.CasinoXPremiumGame?.close)window.CasinoXPremiumGame.close();
        else {shell.remove();document.body.style.overflow=""}
      });
    }
  };
})();


/* =========================================================
   CASINOX v2.2
   DEV CREDITS + ROBUST GAME BACK/CLOSE
   ========================================================= */
(function(){
  function removeGameLayers(){
    document.querySelectorAll(".cx20-shell").forEach(el=>el.remove());

    // Remove only common game/modal layers when they are clearly game UI.
    document.querySelectorAll(".cx20-paytable").forEach(el=>el.classList.remove("show"));

    document.body.style.overflow="";
    document.documentElement.style.overflow="";
  }

  function installV22(){
    const shell=document.querySelector(".cx20-shell");
    if(!shell || shell.dataset.v22Installed==="1") return;
    shell.dataset.v22Installed="1";

    /* ---- BACK: always close the current game layer ---- */
    const back=shell.querySelector(".cx20-back");
    if(back){
      const fresh=back.cloneNode(true);
      back.replaceWith(fresh);
      const goBack=function(e){
        if(e){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();}
        if(window.CasinoXPremiumGame && typeof window.CasinoXPremiumGame.close==="function"){
          window.CasinoXPremiumGame.close();
        }
        removeGameLayers();
      };
      fresh.addEventListener("click",goBack,true);
      fresh.addEventListener("pointerup",goBack,true);
      fresh.addEventListener("touchend",goBack,{passive:false});
    }

    /* ---- DEV CREDITS ---- */
    const tools=shell.querySelector(".cx20-tools");
    if(tools && !tools.querySelector(".cx22-dev")){
      const dev=document.createElement("button");
      dev.type="button";
      dev.className="cx20-tool cx22-dev";
      dev.textContent="💰 CRÉDITOS";
      tools.appendChild(dev);

      const modal=document.createElement("div");
      modal.className="cx22-credit-modal";
      modal.innerHTML=`
        <div class="cx22-credit-panel" role="dialog" aria-modal="true">
          <button class="cx22-close" type="button" aria-label="Fechar">×</button>
          <div class="cx22-credit-title">CRÉDITOS DE TESTE</div>
          <div class="cx22-credit-value">10.000</div>
          <div class="cx22-credit-sub">Somente virtual • offline • desenvolvimento</div>
          <div class="cx22-credit-actions">
            <button type="button" data-credit="1000">+ 1.000</button>
            <button type="button" data-credit="5000">+ 5.000</button>
            <button type="button" data-credit="10000">+ 10.000</button>
            <button type="button" data-credit="reset">RESETAR 10.000</button>
          </div>
        </div>`;
      shell.appendChild(modal);

      function updateCreditView(){
        const balance=Number(localStorage.getItem("casinox_balance")||10000);
        modal.querySelector(".cx22-credit-value").textContent=balance.toLocaleString("pt-BR");
        const wallet=shell.querySelector(".cx20-wallet-value");
        const stat=shell.querySelector(".st-balance");
        if(wallet) wallet.textContent=balance.toLocaleString("pt-BR");
        if(stat) stat.textContent=balance.toLocaleString("pt-BR");
      }

      function closeCredits(){
        modal.classList.remove("show");
      }

      dev.addEventListener("click",function(e){
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
        updateCreditView();
        modal.classList.add("show");
      },true);

      modal.querySelector(".cx22-close").addEventListener("click",function(e){
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
        closeCredits();
      },true);

      modal.addEventListener("click",function(e){
        if(e.target===modal){
          closeCredits();
          return;
        }
        const button=e.target.closest("[data-credit]");
        if(!button)return;
        e.preventDefault();
        e.stopPropagation();

        let balance=Number(localStorage.getItem("casinox_balance")||10000);
        balance=button.dataset.credit==="reset"
          ? 10000
          : balance+Number(button.dataset.credit);

        localStorage.setItem("casinox_balance",String(balance));
        updateCreditView();
      },true);

      updateCreditView();
    }

    /* Make the game layer explicitly mobile-safe. */
    shell.addEventListener("click",function(e){
      if(e.target===shell)e.stopPropagation();
    },true);
    shell.addEventListener("pointerdown",function(e){
      e.stopPropagation();
    },true);
  }

  const originalOpen=window.CasinoXPremiumGame && window.CasinoXPremiumGame.open;
  if(originalOpen){
    window.CasinoXPremiumGame.open=function(name){
      originalOpen(name);
      setTimeout(installV22,0);
    };
  }

  /* Browser/device back: close the game instead of leaving a stale layer. */
  window.addEventListener("popstate",function(){
    if(document.querySelector(".cx20-shell")){
      removeGameLayers();
    }
  });

  setTimeout(installV22,250);
})();


/* =========================================================
   CASINOX v2.3 — SINGLE GAME ENTRY / FIX BACK
   IMPORTANT: the older v13 modal and the v2.x premium shell
   were both opening from the same card click. The premium shell
   sat on top of the older modal, so BACK appeared to "go back"
   to an old version. This capture handler makes the premium game
   the only game opened from a lobby card.
   ========================================================= */
(function(){
  document.addEventListener("click", function(e){
    const target=e.target;
    if(!target || target.closest(".cx20-shell") || target.closest(".cx17-shell")) return;

    // Never hijack favorite buttons.
    if(target.closest("[data-favorite], .heart-btn, .casinox-fav")) return;

    const card=target.closest("[data-game]");
    if(!card) return;

    const name=card.dataset.game;
    if(!name) return;

    // Stop the legacy card onclick/document handlers before they can
    // create the old game-modal-v13 underneath the new game.
    e.preventDefault();
    e.stopImmediatePropagation();

    if(window.CasinoXPremiumGame && typeof window.CasinoXPremiumGame.open === "function"){
      window.CasinoXPremiumGame.open(name);
    }
  }, true);

  // Emergency cleanup: if an old v13 modal already exists, remove it
  // whenever a premium game is opened. This prevents the old layer from
  // being revealed by BACK on devices that retained an older DOM state.
  const oldOpen=window.CasinoXPremiumGame && window.CasinoXPremiumGame.open;
  if(oldOpen){
    window.CasinoXPremiumGame.open=function(name){
      document.querySelectorAll(".game-modal-v13, .modal.game-modal-v13").forEach(el=>el.remove());
      oldOpen(name);
      document.querySelectorAll(".game-modal-v13, .modal.game-modal-v13").forEach(el=>el.remove());
    };
  }
})();


/* =========================================================
   CASINOX v2.6 — AUTHORITATIVE MOBILE CONTROLS
   One delegated capture handler owns the game controls.
   This avoids cloning/replacing buttons and therefore preserves
   the handlers and DOM created by the game engine.
   ========================================================= */
(function(){
  const V="2.5";

  function money(n){
    return Number(n||0).toLocaleString("pt-BR");
  }

  function gameShell(){
    return document.querySelector(".cx20-shell");
  }

  function closeGame(shell){
    if(!shell)return;
    shell.querySelectorAll(".cx20-paytable").forEach(x=>x.classList.remove("show"));
    shell.querySelectorAll(".cx22-credit-modal").forEach(x=>x.classList.remove("show"));
    shell.remove();
    document.body.style.overflow="";
    document.documentElement.style.overflow="";
  }

  function state(shell){
    if(!shell.__cx25){
      shell.__cx25={
        balance:Number(localStorage.getItem("casinox_balance")||10000),
        bet:Number(localStorage.getItem("casinox_bet")||100),
        turbo:false,
        auto:false,
        spinning:false,
        timer:null,
        autoTimer:null
      };
    }
    return shell.__cx25;
  }

  function sync(shell){
    const s=state(shell);
    const value=money(s.balance);
    const bet=money(s.bet);

    const selectors=[
      ".cx20-wallet-value",
      ".st-balance"
    ];
    selectors.forEach(sel=>shell.querySelectorAll(sel).forEach(el=>el.textContent=value));
    shell.querySelectorAll(".st-bet").forEach(el=>el.textContent=bet);

    const betBox=shell.querySelector(".cx20-bet-value b");
    if(betBox)betBox.textContent=bet;

    localStorage.setItem("casinox_balance",String(s.balance));
    localStorage.setItem("casinox_bet",String(s.bet));

    const portal=document.querySelector("#balance");
    if(portal)portal.textContent=money(s.balance);
  }

  function message(shell,text){
    const p=shell.querySelector(".cx20-prize");
    if(p)p.textContent=text;
  }

  function gameTheme(name){
    const n=String(name||"").toLowerCase();
    if(n.includes("golden bull")) return {
      animal:"bull", img:"golden-bull.jpg", emoji:"🐂",
      symbols:["🪙","💰","7️⃣","💎"]
    };
    if(n.includes("dragon fire")) return {
      animal:"dragon-fire", img:"dragon-fire.jpg", emoji:"🐲",
      symbols:["🔥","🪙","7️⃣","💎"]
    };
    if(n.includes("dragon")) return {
      animal:"dragon", img:"dragon-fortune.jpg", emoji:"🐉",
      symbols:["🔥","🪙","7️⃣","💎"]
    };
    if(n.includes("tiger")) return {
      animal:"tiger", img:"tiger-riches.jpg", emoji:"🐯",
      symbols:["💰","🪙","7️⃣","💎"]
    };
    if(n.includes("lion")) return {
      animal:"lion", img:"lion-king.jpg", emoji:"🦁",
      symbols:["👑","💰","7️⃣","💎"]
    };
    if(n.includes("panda")) return {
      animal:"panda", img:"treasure-panda.jpg", emoji:"🐼",
      symbols:["🎁","🪙","7️⃣","💎"]
    };
    return {
      animal:"rabbit", img:"lucky-rabbit.jpg", emoji:"🐰",
      symbols:["🥕","💰","7️⃣","💎"]
    };
  }

  function draw(shell){
    const name=shell.querySelector(".cx20-brand b")?.textContent||"";
    const theme=gameTheme(name);
    shell.dataset.animal=theme.animal;
    const stage=shell.querySelector(".cx20-stage");
    if(stage){
      stage.classList.add("cx30-theme","cx32-responsive-game");
      const refBg = theme.animal === "rabbit"
        ? 'url("assets/reference/lucky-rabbit-reference.png")'
        : `url("assets/characters/bg-${theme.img}")`;
      stage.style.setProperty("--cx31-bg", refBg);
      stage.style.setProperty("--cx32-bg", refBg);
      stage.dataset.themeAnimal = theme.animal;
    }

    shell.querySelectorAll(".cx20-reel").forEach(reel=>{
      const pool=[`<img class="cx27-reel-animal" src="assets/characters/${theme.img}" alt="${theme.animal}">`,...theme.symbols];
      const pick=()=>pool[Math.floor(Math.random()*pool.length)];
      reel.innerHTML=[
        `<div class="cx20-symbol s1">${pick()}</div>`,
        `<div class="cx20-symbol s2">${pick()}</div>`,
        `<div class="cx20-symbol s3">${pick()}</div>`
      ].join("");
    });
  }

  function finishSpin(shell){
    const s=state(shell);
    if(s.timer){clearInterval(s.timer);s.timer=null}
    if(!shell.isConnected)return;

    const middle=[...shell.querySelectorAll(".cx20-reel .s2")].map(x=>x.textContent);
    const counts={};
    middle.forEach(x=>counts[x]=(counts[x]||0)+1);
    const max=Math.max(...Object.values(counts),0);
    const mult=max>=5?10:max>=4?5:max>=3?2:0;
    const win=s.bet*mult;

    s.balance+=win;
    s.spinning=false;

    const spin=shell.querySelector(".cx20-spin");
    if(spin){
      spin.disabled=false;
      spin.style.pointerEvents="auto";
      spin.textContent="GIRAR";
    }

    const winEl=shell.querySelector(".st-win");
    if(winEl)winEl.textContent=money(win);

    message(shell,win?`✨ PRÊMIO +${money(win)}`:"Boa rodada — tente novamente!");
    sync(shell);

    if(s.auto){
      s.autoTimer=setTimeout(()=>startSpin(shell),700);
    }
  }

  function startSpin(shell){
    const s=state(shell);
    if(s.spinning)return;

    if(s.balance<s.bet){
      message(shell,"SALDO INSUFICIENTE");
      s.auto=false;
      const auto=shell.querySelector('[data-tool="auto"]');
      if(auto)auto.classList.remove("active");
      return;
    }

    s.spinning=true;
    s.balance-=s.bet;
    sync(shell);

    const spin=shell.querySelector(".cx20-spin");
    if(spin){
      spin.disabled=true;
      spin.style.pointerEvents="none";
      spin.textContent="GIRANDO…";
    }

    message(shell,s.turbo?"⚡ TURBO":"GIRANDO…");

    let n=0;
    const total=s.turbo?6:14;
    const delay=s.turbo?42:78;

    s.timer=setInterval(()=>{
      if(!shell.isConnected){
        clearInterval(s.timer);
        s.timer=null;
        return;
      }
      draw(shell);
      n++;
      if(n>=total)finishSpin(shell);
    },delay);
  }

  function toggleTurbo(shell){
    const s=state(shell);
    s.turbo=!s.turbo;
    const b=shell.querySelector('[data-tool="turbo"]');
    if(b)b.classList.toggle("active",s.turbo);
    message(shell,s.turbo?"⚡ TURBO ATIVADO":"TURBO DESATIVADO");
  }

  function toggleAuto(shell){
    const s=state(shell);
    s.auto=!s.auto;
    const b=shell.querySelector('[data-tool="auto"]');
    if(b)b.classList.toggle("active",s.auto);

    if(s.auto){
      message(shell,"🔄 AUTO ATIVADO");
      if(!s.spinning)startSpin(shell);
    }else{
      if(s.autoTimer){clearTimeout(s.autoTimer);s.autoTimer=null}
      message(shell,"AUTO DESATIVADO");
    }
  }

  function openPrizes(shell){
    const p=shell.querySelector(".cx20-paytable");
    if(p)p.classList.add("show");
  }

  function closePrizes(shell){
    const p=shell.querySelector(".cx20-paytable");
    if(p)p.classList.remove("show");
  }

  function openCredits(shell){
    let modal=shell.querySelector(".cx22-credit-modal");
    if(!modal){
      modal=document.createElement("div");
      modal.className="cx22-credit-modal";
      modal.innerHTML=`
        <div class="cx22-credit-panel" role="dialog" aria-modal="true">
          <button class="cx22-close" type="button">×</button>
          <div class="cx22-credit-title">CRÉDITOS DE TESTE</div>
          <div class="cx22-credit-value">10.000</div>
          <div class="cx22-credit-sub">Somente virtual • offline • desenvolvimento</div>
          <div class="cx22-credit-actions">
            <button type="button" data-credit="1000">+ 1.000</button>
            <button type="button" data-credit="5000">+ 5.000</button>
            <button type="button" data-credit="10000">+ 10.000</button>
            <button type="button" data-credit="reset">RESETAR 10.000</button>
          </div>
        </div>`;
      shell.appendChild(modal);
    }
    const s=state(shell);
    const v=modal.querySelector(".cx22-credit-value");
    if(v)v.textContent=money(s.balance);
    modal.classList.add("show");
  }

  function creditAction(shell,button){
    const s=state(shell);
    const action=button.dataset.credit;
    s.balance=action==="reset"?10000:s.balance+Number(action);
    sync(shell);
    const modal=shell.querySelector(".cx22-credit-modal");
    if(modal){
      const v=modal.querySelector(".cx22-credit-value");
      if(v)v.textContent=money(s.balance);
    }
  }

  function install(shell){
    if(!shell || shell.dataset.cx25==="1")return;
    shell.dataset.cx25="1";
    state(shell);
    sync(shell);

    /*
      Capture on the shell fires before the old button handlers.
      We therefore do not clone, disable, or replace any controls.
    */
    shell.addEventListener("click",function(e){
      const target=e.target;
      const button=target.closest("button");
      if(!button || !shell.contains(button))return;

      const isControl =
        button.matches(".cx20-back,.cx20-minus,.cx20-plus,.cx20-spin,.pay-close,.cx22-close") ||
        button.matches('[data-tool="turbo"],[data-tool="auto"],[data-tool="pay"],[data-credit]') ||
        button.classList.contains("cx22-dev");

      if(!isControl)return;

      e.preventDefault();
      e.stopImmediatePropagation();

      if(button.matches(".cx20-back")){
        closeGame(shell);
        return;
      }

      if(button.matches(".cx20-minus")){
        const s=state(shell);
        s.bet=Math.max(10,s.bet-10);
        sync(shell);
        return;
      }

      if(button.matches(".cx20-plus")){
        const s=state(shell);
        s.bet=Math.min(Math.max(10,s.balance),s.bet+10);
        sync(shell);
        return;
      }

      if(button.matches(".cx20-spin")){
        startSpin(shell);
        return;
      }

      if(button.matches('[data-tool="turbo"]')){
        toggleTurbo(shell);
        return;
      }

      if(button.matches('[data-tool="auto"]')){
        toggleAuto(shell);
        return;
      }

      if(button.matches('[data-tool="pay"]')){
        openPrizes(shell);
        return;
      }

      if(button.matches(".pay-close")){
        closePrizes(shell);
        return;
      }

      if(button.classList.contains("cx22-dev")){
        openCredits(shell);
        return;
      }

      if(button.matches(".cx22-close")){
        const modal=shell.querySelector(".cx22-credit-modal");
        if(modal)modal.classList.remove("show");
        return;
      }

      if(button.matches("[data-credit]")){
        creditAction(shell,button);
        return;
      }
    },true);

    const pay=shell.querySelector(".cx20-paytable");
    if(pay){
      pay.addEventListener("click",function(e){
        if(e.target===pay)closePrizes(shell);
      },true);
    }
  }

  const observer=new MutationObserver(function(){
    const shell=gameShell();
    if(shell)install(shell);
  });

  observer.observe(document.body,{childList:true,subtree:true});
  const existing=gameShell();
  if(existing)install(existing);
})();



/* v3.2 portal badge — single authoritative version */
(function(){
  function add(){
    const top=document.querySelector(".topbar");
    if(!top || top.querySelector(".cx31-version"))return;
    const b=document.createElement("span");
    b.className="cx31-version";
    b.textContent="v3.2";
    top.appendChild(b);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",add);
  else add();
})();


(function(){
  function cleanGameArt(){
    document.querySelectorAll(
      '.cx27-character-card,.cx27-animal-card,.cx27-animal-logo,.cx27-game-art-card'
    ).forEach(el=>el.remove());

    // If the old visual card is identified by the old logo image, remove its wrapper.
    document.querySelectorAll('.cx20-stage img').forEach(img=>{
      const alt=(img.getAttribute('alt')||'').toLowerCase();
      const src=(img.getAttribute('src')||'').toLowerCase();
      if(
        alt.includes('dragon fortune') ||
        alt.includes('golden bull') ||
        alt.includes('lucky rabbit') ||
        alt.includes('tiger riches') ||
        alt.includes('lion king') ||
        alt.includes('treasure panda')
      ){
        const parent=img.closest('.cx27-character-card,.cx27-animal-card,.cx27-animal-logo,.cx27-game-art-card');
        if(parent) parent.remove();
      }
    });
  }
  const mo=new MutationObserver(cleanGameArt);
  mo.observe(document.body,{childList:true,subtree:true});
  cleanGameArt();
})();

/* =========================================================
   CASINOX v3.6 — ROLETE 3x4x3
   10 posições visíveis:
     coluna 1 = 3
     coluna 2 = 4
     coluna 3 = 3
   ========================================================= */
(function(){
  const CFG = Object.freeze({
    visibleRows: [3,4,3],
    totalSymbols: 10,
    centerRow: 1.5
  });

  function normalizeReels(){
    const root = document.querySelector(".cx20-stage");
    if(!root) return;

    const reels = root.querySelectorAll(
      ".cx20-reel, [data-reel], .reel, .slot-reel"
    );
    if(reels.length < 3) return;

    reels.forEach((reel, col)=>{
      reel.dataset.visibleRows = String(CFG.visibleRows[col] || 4);
      reel.classList.add("cx36-reel");
    });

    root.dataset.reelLayout = "3x4x3";
    root.dataset.reelSymbols = String(CFG.totalSymbols);
  }

  function enforceFourOnCenter(){
    const root = document.querySelector(".cx20-stage");
    if(!root) return;

    const reels = root.querySelectorAll(".cx20-reel, [data-reel], .reel, .slot-reel");
    if(reels.length < 3) return;

    // O algoritmo da coluna central precisa SEMPRE produzir 4 células.
    const center = reels[1];
    center.dataset.visibleRows = "4";

    const cells = center.querySelectorAll(
      ".cx20-symbol, .symbol, .reel-symbol, [data-symbol]"
    );

    // Não removemos células aqui: apenas garantimos que o container
    // tenha espaço físico para quatro símbolos.
    center.classList.add("cx36-center-four");
    center.style.setProperty("--cx36-count","4");
    center.style.setProperty("--cx36-cell-count", String(Math.max(4,cells.length)));
  }

  const observer = new MutationObserver(()=>{
    normalizeReels();
    enforceFourOnCenter();
  });

  observer.observe(document.body,{childList:true,subtree:true});
  normalizeReels();
  enforceFourOnCenter();
})();
