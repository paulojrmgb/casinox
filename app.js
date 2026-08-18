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
    overlay.querySelector('[data-back]').onclick=close; overlay.querySelector('[data-minus]').onclick=()=>adjustBet(-10); overlay.querySelector('[data-plus]').onclick=()=>adjustBet(10); overlay.querySelector('[data-spin]').onclick=spin; overlay.querySelector('[data-turbo]').onclick=toggleTurbo; overlay.querySelector('[data-auto]').onclick=toggleAuto;
    overlay.querySelector('[data-pay]').onclick=()=>setMessage(c.pay,'win');
  }
  document.addEventListener('click',e=>{
    const el=e.target.closest('[data-game]'); if(!el)return; const n=el.dataset.game; if(!n)return; e.preventDefault();e.stopPropagation();open(n);
  },true);
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
