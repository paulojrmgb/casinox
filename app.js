const games = [
  {
    id: "slots",
    n: "Lucky Stars",
    i: "🎰",
    d: "Slot social",
    t: "Popular"
  },
  {
    id: "roulette",
    n: "Roleta Royale",
    i: "🎡",
    d: "Roleta virtual",
    t: "Clássico"
  },
  {
    id: "blackjack",
    n: "Blackjack Pro",
    i: "🃏",
    d: "21 contra a banca",
    t: "Clássico"
  },
  {
    id: "crash",
    n: "Rocket Crash",
    i: "🚀",
    d: "Suba o multiplicador",
    t: "Novo"
  },
  {
    id: "baccarat",
    n: "Baccarat",
    i: "♠️",
    d: "Mesa clássica",
    t: "Premium"
  },
  {
    id: "dice",
    n: "Dice",
    i: "🎲",
    d: "Dados virtuais",
    t: "Rápido"
  },
  {
    id: "poker",
    n: "Poker Social",
    i: "♣️",
    d: "Mesa de demonstração",
    t: "Social"
  },
  {
    id: "wheel",
    n: "Prize Wheel",
    i: "🎯",
    d: "Gire a roda",
    t: "Bônus"
  }
];

let balance =
  Number(
    localStorage.getItem("cx_balance") || 10000
  );

let player =
  localStorage.getItem("cx_player") || "";

const app =
  document.querySelector("#app");

const bal =
  document.querySelector("#balance");

const fmt =
  n =>
    Math.floor(n)
      .toLocaleString("pt-BR");

function save() {

  localStorage.setItem(
    "cx_balance",
    balance
  );

  bal.textContent =
    fmt(balance);
}

function toast(text) {

  const e =
    document.querySelector("#toast");

  e.textContent = text;

  e.classList.add("show");

  clearTimeout(window.tt);

  window.tt =
    setTimeout(
      () =>
        e.classList.remove("show"),
      2200
    );
}

function cards(list = games) {

  return list.map(g => `
    <article
      class="card"
      data-game="${g.id}"
    >

      <div class="art">
        ${g.i}
      </div>

      <h3>
        ${g.n}
      </h3>

      <p>
        ${g.d}
      </p>

      <span class="tag">
        ${g.t}
      </span>

    </article>
  `).join("");
}

function view(v) {

  if (v === "casino") {

    app.innerHTML = `

      <div class="title">

        <h1>🎰 Cassino</h1>

        <p>
          Jogos demonstrativos
          com créditos virtuais.
        </p>

      </div>

      <div class="grid">
        ${cards()}
      </div>

    `;
  }

  else if (v === "promos") {

    app.innerHTML = `

      <div class="title">

        <h1>🎁 Promoções</h1>

        <p>
          Conteúdo demonstrativo
          da versão 0.1.
        </p>

      </div>

      <div class="list">

        <div class="row">

          <div>

            <b>
              Boas-vindas
            </b>

            <p>
              10.000 créditos
              virtuais iniciais.
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
              Uma recompensa
              social por dia.
            </p>

          </div>

          <button
            class="primary"
            id="daily"
          >
            Resgatar
          </button>

        </div>

      </div>
    `;
  }

  else if (v === "ranking") {

    const players = [

      ["1", "LuckyPlayer", "98.420"],
      ["2", "Queen21", "87.650"],
      ["3", "RocketBR", "81.300"],
      ["4", "CasinoFan", "76.210"],
      [
        "5",
        player || "Você",
        fmt(balance)
      ]

    ];

    app.innerHTML = `

      <div class="title">

        <h1>🏆 Ranking</h1>

        <p>
          Ranking demonstrativo.
        </p>

      </div>

      <div class="list">

        ${players.map(x => `

          <div class="row">

            <b>
              #${x[0]}
             　
              ${x[1]}
            </b>

            <strong>
              ${x[2]}
            </strong>

          </div>

        `).join("")}

      </div>
    `;
  }

  else {

    app.innerHTML = `

      <section class="hero">

        <div>

          <div class="eyebrow">
            Cassino social • versão 0.1
          </div>

          <h1>
            Entre na mesa.<br>
            Jogue por diversão.
          </h1>

          <p>
            Experimente uma plataforma
            moderna de cassino usando
            apenas créditos virtuais.
            Sem depósitos ou saques
            nesta versão.
          </p>

          <button
            class="primary"
            id="explore"
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
              Escolha uma mesa e comece.
            </p>

          </div>

          <button
            class="primary"
            id="all"
          >
            Ver todos
          </button>

        </div>

        <div class="grid">

          ${cards(games.slice(0,4))}

        </div>

      </section>

      <section class="section features">

        <div class="feature">

          <h3>
            💎 Créditos virtuais
          </h3>

          <p>
            Comece com 10.000 créditos
            para testar.
          </p>

        </div>

        <div class="feature">

          <h3>
            🏆 Ranking social
          </h3>

          <p>
            Compare pontuações
            fictícias.
          </p>

        </div>

        <div class="feature">

          <h3>
            🛡️ Base preparada
          </h3>

          <p>
            Estrutura pronta para
            backend futuro.
          </p>

        </div>

      </section>

    `;
  }

  bind();

  document
    .querySelector("#explore")
    ?.addEventListener(
      "click",
      () => view("casino")
    );

  document
    .querySelector("#all")
    ?.addEventListener(
      "click",
      () => view("casino")
    );

  document
    .querySelector("#daily")
    ?.addEventListener(
      "click",
      daily
    );
}

function bind() {

  document
    .querySelectorAll("[data-game]")
    .forEach(
      e =>
        e.onclick =
          () => game(e.dataset.game)
    );
}

function stake() {

  return `
    <input
      id="stake"
      type="number"
      min="10"
      value="100"
    >
  `;
}

function pay(value) {

  value =
    Number(value);

  if (
    !Number.isFinite(value) ||
    value < 10 ||
    value > balance
  ) {

    toast(
      "Créditos insuficientes ou valor inválido."
    );

    return false;
  }

  balance -=
    Math.floor(value);

  save();

  return true;
}

function win(value) {

  balance +=
    Math.floor(value);

  save();
}

function game(id) {

  const g =
    games.find(
      x => x.id === id
    );

  const modal =
    document.createElement("div");

  modal.className = "modal";

  modal.innerHTML = `

    <div class="box">

      <div class="modalhead">

        <h2>
          ${g.i}
          ${g.n}
        </h2>

        <button class="close">
          ×
        </button>

      </div>

      <div
        class="stage"
        id="stage"
      ></div>

    </div>

  `;

  document.body.appendChild(modal);

  modal
    .querySelector(".close")
    .onclick =
      () => modal.remove();

  const stage =
    modal.querySelector("#stage");

  if (id === "slots")
    slots(stage);

  else if (id === "roulette")
    roulette(stage);

  else if (id === "blackjack")
    blackjack(stage);

  else if (id === "crash")
    crash(stage);

  else {

    stage.innerHTML = `

      <div>

        <div style="font-size:80px">
          ${g.i}
        </div>

        <h3>
          Em breve
        </h3>

        <p>
          Este jogo entra na
          próxima versão.
        </p>

      </div>

    `;
  }
}

function slots(stage) {

  stage.innerHTML = `

    <div>

      <div class="reels">

        <div class="reel">🍒</div>
        <div class="reel">⭐</div>
        <div class="reel">7️⃣</div>

      </div>

      <div class="controls">

        ${stake()}

        <button
          class="primary"
          id="go"
        >
          Girar
        </button>

      </div>

      <p id="r"></p>

    </div>
  `;

  stage
    .querySelector("#go")
    .onclick = () => {

      const value =
        Number(
          stage.querySelector(
            "#stake"
          ).value
        );

      if (!pay(value))
        return;

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
        (x, i) =>
          reels[i].textContent = x
      );

      let multiplier = 0;

      if (
        result[0] === result[1] &&
        result[1] === result[2]
      )
        multiplier = 5;

      else if (
        result[0] === result[1] ||
        result[1] === result[2] ||
        result[0] === result[2]
      )
        multiplier = 2;

      const prize =
        value * multiplier;

      if (prize)
        win(prize);

      stage.querySelector("#r")
        .textContent =
          prize
            ? `Você ganhou ${fmt(prize)} créditos!`
            : "Não foi dessa vez.";
    };
}

function roulette(stage) {

  stage.innerHTML = `

    <div>

      <div class="wheel">

        <b id="num">
          ?
        </b>

      </div>

      <div class="controls">

        ${stake()}

        <button
          class="primary"
          id="go"
        >
          Girar
        </button>

      </div>

      <p id="r"></p>

    </div>

  `;

  stage
    .querySelector("#go")
    .onclick = () => {

      const value =
        Number(
          stage.querySelector(
            "#stake"
          ).value
        );

      if (!pay(value))
        return;

      const number =
        Math.floor(
          Math.random() * 37
        );

      const prize =
        number === 0
          ? value * 10
          : value * 2;

      win(prize);

      stage.querySelector("#num")
        .textContent =
          number;

      stage.querySelector("#r")
        .textContent =
          `Número ${number}. Retorno virtual: ${fmt(prize)} créditos.`;
    };
}

function blackjack(stage) {

  stage.innerHTML = `

    <div>

      <div style="font-size:80px">
        🃏
      </div>

      <p>
        Versão simplificada.
      </p>

      <div class="controls">

        ${stake()}

        <button
          class="primary"
          id="go"
        >
          Distribuir
        </button>

      </div>

      <p id="r"></p>

    </div>

  `;

  stage
    .querySelector("#go")
    .onclick = () => {

      const value =
        Number(
          stage.querySelector(
            "#stake"
          ).value
        );

      if (!pay(value))
        return;

      const playerScore =
        12 +
        Math.floor(
          Math.random() * 10
        );

      const dealerScore =
        15 +
        Math.floor(
          Math.random() * 7
        );

      const result =
        stage.querySelector("#r");

      if (playerScore > 21) {

        result.textContent =
          `Você: ${playerScore}. Estourou.`;
      }

      else if (
        dealerScore > 21 ||
        playerScore > dealerScore
      ) {

        win(value * 2);

        result.textContent =
          `Você: ${playerScore} • Banca: ${dealerScore}. Vitória! +${fmt(value * 2)}.`;
      }

      else if (
        playerScore === dealerScore
      ) {

        win(value);

        result.textContent =
          "Empate. Créditos devolvidos.";
      }

      else {

        result.textContent =
          `Você: ${playerScore} • Banca: ${dealerScore}. A banca venceu.`;
      }
    };
}

function crash(stage) {

  stage.innerHTML = `

    <div>

      <div
        id="mult"
        style="
          font-size:72px;
          font-weight:900;
          color:var(--gold)
        "
      >
        1.00x
      </div>

      <p>
        Multiplicador demonstrativo.
      </p>

      <div class="controls">

        ${stake()}

        <button
          class="primary"
          id="go"
        >
          Entrar
        </button>

      </div>

      <p id="r"></p>

    </div>

  `;

  stage
    .querySelector("#go")
    .onclick = () => {

      const value =
        Number(
          stage.querySelector(
            "#stake"
          ).value
        );

      if (!pay(value))
        return;

      let multiplier = 1;

      const target =
        1 +
        Math.random() * 4.5;

      const timer =
        setInterval(() => {

          multiplier += .1;

          stage.querySelector(
            "#mult"
          ).textContent =
            multiplier.toFixed(2)
            + "x";

          if (
            multiplier >= target
          ) {

            clearInterval(timer);

            if (
              Math.random() > .3
            ) {

              win(
                value * multiplier
              );

              stage.querySelector(
                "#r"
              ).textContent =
                `Saída em ${multiplier.toFixed(2)}x. +${fmt(value * multiplier)} créditos.`;
            }

            else {

              stage.querySelector(
                "#r"
              ).textContent =
                `Crash em ${multiplier.toFixed(2)}x.`;
            }
          }

        }, 70);
    };
}

function daily() {

  const last =
    Number(
      localStorage.getItem(
        "cx_daily"
      ) || 0
    );

  if (
    Date.now() - last <
    86400000
  ) {

    toast(
      "Recompensa já resgatada hoje."
    );

    return;
  }

  balance += 500;

  localStorage.setItem(
    "cx_daily",
    Date.now()
  );

  save();

  toast(
    "+500 créditos virtuais!"
  );
}

document
  .querySelectorAll("nav button")
  .forEach(
    button =>
      button.onclick =
        () =>
          view(
            button.dataset.view
          )
  );

document
  .querySelector("#login")
  .onclick = () => {

    if (player) {

      toast(
        `Olá, ${player}!`
      );

      return;
    }

    const name =
      prompt(
        "Nome do jogador:"
      );

    if (
      name &&
      name.trim()
    ) {

      player =
        name.trim();

      localStorage.setItem(
        "cx_player",
        player
      );

      toast(
        "Perfil criado no protótipo."
      );
    }
  };

save();

view("home");
