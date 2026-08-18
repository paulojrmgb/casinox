/* =========================================================
   CASINOX — CONTA v0.4
   =========================================================
   Cadastro local de demonstração:

   NOME
   ID / TELEFONE
   SENHA

   Esta versão utiliza somente créditos virtuais.
   A conta é armazenada localmente no dispositivo.

   IMPORTANTE:
   Esta é uma implementação de protótipo.
   Para produção, a autenticação deverá migrar para backend.
   ========================================================= */

(function () {

  "use strict";


  /* =========================================================
     ELEMENTO PRINCIPAL
     ========================================================= */

  const app =
    document.getElementById("app");


  /* =========================================================
     FUNÇÕES AUXILIARES
     ========================================================= */

  function esc(value) {

    return String(value || "")
      .replace(/[&<>"']/g, function (char) {

        const map = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;"
        };

        return map[char];

      });

  }


  function normalizePhone(value) {

    return String(value || "")
      .replace(/\D/g, "");

  }


  /* =========================================================
     HASH DA SENHA
     ========================================================= */

  async function sha256(value) {

    const data =
      new TextEncoder().encode(value);

    const hash =
      await crypto.subtle.digest(
        "SHA-256",
        data
      );

    return Array
      .from(new Uint8Array(hash))
      .map(function (byte) {

        return byte
          .toString(16)
          .padStart(2, "0");

      })
      .join("");

  }


  /* =========================================================
     CONTA
     ========================================================= */

  function getAccount() {

    try {

      return JSON.parse(
        localStorage.getItem(
          "casinox_account"
        ) || "null"
      );

    }

    catch {

      return null;

    }

  }


  function setAccount(account) {

    localStorage.setItem(
      "casinox_account",
      JSON.stringify(account)
    );

  }


  function isLogged() {

    return (
      localStorage.getItem(
        "casinox_logged_in"
      ) === "1"
    );

  }


  function setLogged(value) {

    localStorage.setItem(
      "casinox_logged_in",
      value ? "1" : "0"
    );

  }


  /* =========================================================
     SALDO VIRTUAL
     ========================================================= */

  function getBalance() {

    return Number(
      localStorage.getItem(
        "casinox_balance"
      ) || 10000
    );

  }


  /* =========================================================
     FAVORITOS
     ========================================================= */

  function getFavoriteCount() {

    try {

      return JSON.parse(
        localStorage.getItem(
          "casinox_favorites"
        ) || "[]"
      ).length;

    }

    catch {

      return 0;

    }

  }


  /* =========================================================
     TOAST
     ========================================================= */

  function showToast(message) {

    const toast =
      document.getElementById("toast");

    if (!toast) {
      return;
    }

    toast.textContent =
      message;

    toast.classList.add("show");

    clearTimeout(
      window.casinoXAccountToast
    );

    window.casinoXAccountToast =
      setTimeout(function () {

        toast.classList.remove("show");

      }, 2300);

  }


  /* =========================================================
     TELA PRINCIPAL DA CONTA
     ========================================================= */

  function openAccount() {

    if (!app) {
      return;
    }


    const account =
      getAccount();


    /* =====================================================
       USUÁRIO LOGADO
       ===================================================== */

    if (
      account &&
      isLogged()
    ) {

      app.innerHTML = `

        <section
          class="section"
          style="
            max-width:560px;
            margin:0 auto;
          "
        >

          <!-- CABEÇALHO DO PERFIL -->

          <div
            style="
              display:flex;
              align-items:center;
              gap:14px;
              margin-bottom:20px;
            "
          >

            <div
              style="
                width:62px;
                height:62px;
                display:grid;
                place-items:center;
                border-radius:20px;
                background:
                  linear-gradient(
                    135deg,
                    #f5c451,
                    #d89b24
                  );
                font-size:30px;
              "
            >
              👤
            </div>


            <div>

              <h1
                style="
                  margin:0;
                "
              >
                ${esc(account.name)}
              </h1>


              <p
                style="
                  margin:4px 0 0;
                  color:var(--muted);
                "
              >
                ID:
                ${esc(account.phone)}
              </p>

            </div>

          </div>


          <!-- INFORMAÇÕES -->

          <div
            class="list"
            style="
              margin-bottom:16px;
            "
          >

            <!-- SALDO -->

            <div class="row">

              <div>

                <b>
                  💰 Créditos virtuais
                </b>

                <p>
                  Saldo deste dispositivo.
                </p>

              </div>


              <strong>

                ${getBalance()
                  .toLocaleString("pt-BR")}

              </strong>

            </div>


            <!-- FAVORITOS -->

            <div class="row">

              <div>

                <b>
                  ⭐ Favoritos
                </b>

                <p>
                  Jogos salvos.
                </p>

              </div>


              <strong>

                ${getFavoriteCount()}

              </strong>

            </div>

          </div>


          <!-- BOTÕES -->

          <div
            style="
              display:grid;
              gap:10px;
            "
          >

            <button
              class="primary"
              id="accountGames"
            >
              🎰 Voltar aos jogos
            </button>


            <button
              id="accountLogout"
              style="
                min-height:48px;
                border:
                  1px solid
                  var(--line);
                border-radius:12px;
                background:
                  rgba(
                    255,
                    255,
                    255,
                    .04
                  );
                color:#fff;
                font-weight:800;
              "
            >
              🚪 Sair da conta
            </button>

          </div>


          <p
            style="
              margin-top:18px;
              text-align:center;
              color:var(--muted);
              font-size:12px;
            "
          >
            CasinoX • protótipo • créditos virtuais
          </p>

        </section>

      `;


      /* VOLTAR PARA OS JOGOS */

      document
        .getElementById(
          "accountGames"
        )
        ?.addEventListener(
          "click",
          function () {

            if (
              typeof navigate ===
              "function"
            ) {

              navigate("home");

            }

          }
        );


      /* LOGOUT */

      document
        .getElementById(
          "accountLogout"
        )
        ?.addEventListener(
          "click",
          function () {

            setLogged(false);

            showToast(
              "Você saiu da conta."
            );

            openAccount();

          }
        );


      return;

    }


    /* =====================================================
       USUÁRIO NÃO LOGADO
       ===================================================== */

    app.innerHTML = `

      <section
        class="section"
        style="
          max-width:520px;
          margin:0 auto;
        "
      >

        <div
          style="
            text-align:center;
            margin-bottom:24px;
          "
        >

          <div
            style="
              width:72px;
              height:72px;
              margin:
                0 auto 14px;
              display:grid;
              place-items:center;
              border-radius:22px;
              background:
                linear-gradient(
                  135deg,
                  #f5c451,
                  #d89b24
                );
              font-size:34px;
            "
          >
            👤
          </div>


          <h1
            style="
              margin:0;
            "
          >
            Sua conta
          </h1>


          <p
            style="
              color:var(--muted);
              margin:
                8px 0 0;
            "
          >
            Entre ou crie sua conta CasinoX.
          </p>

        </div>


        <div
          style="
            display:grid;
            gap:10px;
          "
        >

          <button
            class="primary"
            id="accountLogin"
          >
            🔐 Entrar
          </button>


          <button
            id="accountRegister"
            style="
              min-height:48px;
              border:
                1px solid
                var(--line);
              border-radius:12px;
              background:
                rgba(
                  255,
                  255,
                  255,
                  .04
                );
              color:#fff;
              font-weight:800;
            "
          >
            ✨ Criar conta
          </button>

        </div>

      </section>

    `;


    /* LOGIN */

    document
      .getElementById(
        "accountLogin"
      )
      ?.addEventListener(
        "click",
        showLogin
      );


    /* CADASTRO */

    document
      .getElementById(
        "accountRegister"
      )
      ?.addEventListener(
        "click",
        showRegister
      );

  }


  /* =========================================================
     TELA DE CADASTRO
     ========================================================= */

  function showRegister() {

    if (!app) {
      return;
    }


    app.innerHTML = `

      <section
        class="section"
        style="
          max-width:520px;
          margin:0 auto;
        "
      >


        <button
          id="accountBack"
          style="
            border:0;
            background:none;
            color:var(--muted);
            padding:0;
            margin-bottom:18px;
            font-size:14px;
          "
        >
          ← Voltar
        </button>


        <h1>
          Criar conta
        </h1>


        <p
          style="
            color:var(--muted);
            margin-bottom:22px;
          "
        >
          Cadastro rápido.
        </p>


        <form
          id="registerForm"
          style="
            display:grid;
            gap:12px;
          "
        >


          <!-- NOME -->

          <label>

            Nome

            <input
              id="accountName"
              type="text"
              autocomplete="name"
              placeholder="Seu nome"
              required
              style="
                width:100%;
                margin-top:6px;
              "
            >

          </label>


          <!-- TELEFONE -->

          <label>

            ID / Telefone

            <input
              id="accountPhone"
              type="tel"
              inputmode="tel"
              autocomplete="tel"
              placeholder="(11) 99999-9999"
              required
              style="
                width:100%;
                margin-top:6px;
              "
            >

          </label>


          <!-- SENHA -->

          <label>

            Senha

            <input
              id="accountPassword"
              type="password"
              autocomplete="new-password"
              minlength="6"
              placeholder="Mínimo 6 caracteres"
              required
              style="
                width:100%;
                margin-top:6px;
              "
            >

          </label>


          <!-- BOTÃO -->

          <button
            class="primary"
            type="submit"
          >
            Criar minha conta
          </button>


          <p
            id="registerMessage"
            style="
              min-height:20px;
              color:var(--muted);
            "
          >
          </p>


        </form>

      </section>

    `;


    document
      .getElementById(
        "accountBack"
      )
      ?.addEventListener(
        "click",
        openAccount
      );


    document
      .getElementById(
        "registerForm"
      )
      ?.addEventListener(
        "submit",
        createAccount
      );

  }


  /* =========================================================
     CRIAR CONTA
     ========================================================= */

  async function createAccount(event) {

    event.preventDefault();


    const name =
      document
        .getElementById(
          "accountName"
        )
        .value
        .trim();


    const id =
      normalizePhone(
        document
          .getElementById(
            "accountPhone"
          )
          .value
      );


    const password =
      document
        .getElementById(
          "accountPassword"
        )
        .value;


    const message =
      document.getElementById(
        "registerMessage"
      );


    /* NOME */

    if (
      name.length < 2
    ) {

      message.textContent =
        "Digite um nome válido.";

      return;

    }


    /* TELEFONE */

    if (
      id.length < 10
    ) {

      message.textContent =
        "Digite um telefone válido.";

      return;

    }


    /* SENHA */

    if (
      password.length < 6
    ) {

      message.textContent =
        "A senha precisa ter pelo menos 6 caracteres.";

      return;

    }


    /* VERIFICA CONTA EXISTENTE */

    const existing =
      getAccount();


    if (
      existing &&
      existing.phone === id
    ) {

      message.textContent =
        "Esse ID já está cadastrado neste dispositivo.";

      return;

    }


    /* HASH */

    const passwordHash =
      await sha256(password);


    /* SALVA CONTA */

    setAccount({

      name:
        name,

      phone:
        id,

      passwordHash:
        passwordHash,

      createdAt:
        Date.now()

    });


    /* COMPATIBILIDADE */

    localStorage.setItem(
      "casinox_player",
      name
    );


    localStorage.setItem(
      "casinox_phone",
      id
    );


    /* LOGIN */

    setLogged(true);


    showToast(
      "Conta criada com sucesso!"
    );


    openAccount();

  }


  /* =========================================================
     TELA DE LOGIN
     ========================================================= */

  function showLogin() {

    if (!app) {
      return;
    }


    app.innerHTML = `

      <section
        class="section"
        style="
          max-width:520px;
          margin:0 auto;
        "
      >


        <button
          id="accountBack"
          style="
            border:0;
            background:none;
            color:var(--muted);
            padding:0;
            margin-bottom:18px;
            font-size:14px;
          "
        >
          ← Voltar
        </button>


        <h1>
          Entrar
        </h1>


        <p
          style="
            color:var(--muted);
            margin-bottom:22px;
          "
        >
          Informe seu ID / telefone e senha.
        </p>


        <form
          id="loginForm"
          style="
            display:grid;
            gap:12px;
          "
        >


          <!-- TELEFONE -->

          <label>

            ID / Telefone

            <input
              id="loginPhone"
              type="tel"
              inputmode="tel"
              autocomplete="tel"
              placeholder="(11) 99999-9999"
              required
              style="
                width:100%;
                margin-top:6px;
              "
            >

          </label>


          <!-- SENHA -->

          <label>

            Senha

            <input
              id="loginPassword"
              type="password"
              autocomplete="current-password"
              placeholder="Sua senha"
              required
              style="
                width:100%;
                margin-top:6px;
              "
            >

          </label>


          <button
            class="primary"
            type="submit"
          >
            Entrar
          </button>


          <p
            id="loginMessage"
            style="
              min-height:20px;
              color:var(--muted);
            "
          >
          </p>


        </form>

      </section>

    `;


    document
      .getElementById(
        "accountBack"
      )
      ?.addEventListener(
        "click",
        openAccount
      );


    document
      .getElementById(
        "loginForm"
      )
      ?.addEventListener(
        "submit",
        login
      );

  }


  /* =========================================================
     LOGIN
     ========================================================= */

  async function login(event) {

    event.preventDefault();


    const id =
      normalizePhone(
        document
          .getElementById(
            "loginPhone"
          )
          .value
      );


    const password =
      document
        .getElementById(
          "loginPassword"
        )
        .value;


    const message =
      document.getElementById(
        "loginMessage"
      );


    const account =
      getAccount();


    /* SEM CONTA */

    if (!account) {

      message.textContent =
        "Nenhuma conta cadastrada neste dispositivo.";

      return;

    }


    /* HASH */

    const passwordHash =
      await sha256(password);


    /* VALIDA */

    if (
      account.phone !== id ||
      account.passwordHash !== passwordHash
    ) {

      message.textContent =
        "ID/telefone ou senha incorretos.";

      return;

    }


    /* LOGIN */

    localStorage.setItem(
      "casinox_player",
      account.name
    );


    localStorage.setItem(
      "casinox_phone",
      account.phone
    );


    setLogged(true);


    showToast(
      `Bem-vindo, ${account.name}!`
    );


    openAccount();

  }


  /* =========================================================
     CONECTA OS BOTÕES EXISTENTES
     ========================================================= */

  function attachAccountButtons() {

    const desktop =
      document.getElementById(
        "login"
      );


    const mobile =
      document.getElementById(
        "mobile-profile"
      );


    if (desktop) {

      desktop.onclick =
        openAccount;

    }


    if (mobile) {

      mobile.onclick =
        openAccount;

    }

  }


  /* =========================================================
     INICIALIZAÇÃO
     ========================================================= */

  attachAccountButtons();


  /* =========================================================
     API GLOBAL
     ========================================================= */

  window.CasinoXAccount = {

    open:
      openAccount

  };


})();
