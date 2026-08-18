/* CasinoX v0.4 — Conta local (créditos virtuais) */
(function () {
  "use strict";

  const app = document.getElementById("app");
  const esc = v => String(v || "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));

  const normalizePhone = v => String(v || "").replace(/\D/g, "");

  async function sha256(v) {
    const data = new TextEncoder().encode(v);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, "0")).join("");
  }

  function getAccount() {
    try { return JSON.parse(localStorage.getItem("casinox_account") || "null"); }
    catch { return null; }
  }

  function setAccount(a) {
    localStorage.setItem("casinox_account", JSON.stringify(a));
  }

  function isLogged() {
    return localStorage.getItem("casinox_logged_in") === "1";
  }

  function setLogged(v) {
    localStorage.setItem("casinox_logged_in", v ? "1" : "0");
  }

  function balance() {
    return Number(localStorage.getItem("casinox_balance") || 10000);
  }

  function favs() {
    try { return JSON.parse(localStorage.getItem("casinox_favorites") || "[]").length; }
    catch { return 0; }
  }

  function toast(msg) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(window.casinoXAccountToast);
    window.casinoXAccountToast = setTimeout(() => el.classList.remove("show"), 2300);
  }

  function home() {
    const a = getAccount();

    if (a && isLogged()) {
      app.innerHTML = `
        <section class="section" style="max-width:560px;margin:0 auto;">
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px;">
            <div style="width:62px;height:62px;display:grid;place-items:center;border-radius:20px;background:linear-gradient(135deg,#f5c451,#d89b24);font-size:30px;">👤</div>
            <div>
              <h1 style="margin:0;">${esc(a.name)}</h1>
              <p style="margin:4px 0 0;color:var(--muted);">ID: ${esc(a.phone)}</p>
            </div>
          </div>
          <div class="list" style="margin-bottom:16px;">
            <div class="row"><div><b>💰 Créditos virtuais</b><p>Saldo deste dispositivo.</p></div><strong>${balance().toLocaleString("pt-BR")}</strong></div>
            <div class="row"><div><b>⭐ Favoritos</b><p>Jogos salvos.</p></div><strong>${favs()}</strong></div>
          </div>
          <div style="display:grid;gap:10px;">
            <button class="primary" id="accountGames">🎰 Voltar aos jogos</button>
            <button id="accountLogout" style="min-height:48px;border:1px solid var(--line);border-radius:12px;background:rgba(255,255,255,.04);color:#fff;font-weight:800;">🚪 Sair da conta</button>
          </div>
          <p style="margin-top:18px;text-align:center;color:var(--muted);font-size:12px;">CasinoX • protótipo • créditos virtuais</p>
        </section>`;

      document.getElementById("accountGames")?.addEventListener("click", () => {
        if (typeof navigate === "function") navigate("home");
      });
      document.getElementById("accountLogout")?.addEventListener("click", () => {
        setLogged(false); toast("Você saiu da conta."); home();
      });
      return;
    }

    app.innerHTML = `
      <section class="section" style="max-width:520px;margin:0 auto;">
        <div style="text-align:center;margin-bottom:24px;">
          <div style="width:72px;height:72px;margin:0 auto 14px;display:grid;place-items:center;border-radius:22px;background:linear-gradient(135deg,#f5c451,#d89b24);font-size:34px;">👤</div>
          <h1 style="margin:0;">Sua conta</h1>
          <p style="color:var(--muted);margin:8px 0 0;">Entre ou crie sua conta CasinoX.</p>
        </div>
        <div style="display:grid;gap:10px;">
          <button class="primary" id="accountLogin">🔐 Entrar</button>
          <button id="accountRegister" style="min-height:48px;border:1px solid var(--line);border-radius:12px;background:rgba(255,255,255,.04);color:#fff;font-weight:800;">✨ Criar conta</button>
        </div>
      </section>`;

    document.getElementById("accountLogin")?.addEventListener("click", loginScreen);
    document.getElementById("accountRegister")?.addEventListener("click", registerScreen);
  }

  function registerScreen() {
    app.innerHTML = `
      <section class="section" style="max-width:520px;margin:0 auto;">
        <button id="accountBack" style="border:0;background:none;color:var(--muted);padding:0;margin-bottom:18px;font-size:14px;">← Voltar</button>
        <h1>Criar conta</h1>
        <p style="color:var(--muted);margin-bottom:22px;">Cadastro rápido.</p>
        <form id="registerForm" style="display:grid;gap:12px;">
          <label>Nome<input id="accountName" type="text" autocomplete="name" placeholder="Seu nome" required style="width:100%;margin-top:6px;"></label>
          <label>ID / Telefone<input id="accountPhone" type="tel" inputmode="tel" autocomplete="tel" placeholder="(11) 99999-9999" required style="width:100%;margin-top:6px;"></label>
          <label>Senha<input id="accountPassword" type="password" autocomplete="new-password" minlength="6" placeholder="Mínimo 6 caracteres" required style="width:100%;margin-top:6px;"></label>
          <button class="primary" type="submit">Criar minha conta</button>
          <p id="registerMessage" style="min-height:20px;color:var(--muted);"></p>
        </form>
      </section>`;

    document.getElementById("accountBack")?.addEventListener("click", home);
    document.getElementById("registerForm")?.addEventListener("submit", createAccount);
  }

  async function createAccount(e) {
    e.preventDefault();
    const name = document.getElementById("accountName").value.trim();
    const id = normalizePhone(document.getElementById("accountPhone").value);
    const password = document.getElementById("accountPassword").value;
    const msg = document.getElementById("registerMessage");

    if (name.length < 2) return void (msg.textContent = "Digite um nome válido.");
    if (id.length < 10) return void (msg.textContent = "Digite um telefone válido.");
    if (password.length < 6) return void (msg.textContent = "A senha precisa ter pelo menos 6 caracteres.");

    const old = getAccount();
    if (old && old.phone === id) return void (msg.textContent = "Esse ID já está cadastrado neste dispositivo.");

    setAccount({ name, phone:id, passwordHash:await sha256(password), createdAt:Date.now() });
    localStorage.setItem("casinox_player", name);
    localStorage.setItem("casinox_phone", id);
    setLogged(true);
    toast("Conta criada com sucesso!");
    home();
  }

  function loginScreen() {
    app.innerHTML = `
      <section class="section" style="max-width:520px;margin:0 auto;">
        <button id="accountBack" style="border:0;background:none;color:var(--muted);padding:0;margin-bottom:18px;font-size:14px;">← Voltar</button>
        <h1>Entrar</h1>
        <p style="color:var(--muted);margin-bottom:22px;">Informe seu ID / telefone e senha.</p>
        <form id="loginForm" style="display:grid;gap:12px;">
          <label>ID / Telefone<input id="loginPhone" type="tel" inputmode="tel" autocomplete="tel" placeholder="(11) 99999-9999" required style="width:100%;margin-top:6px;"></label>
          <label>Senha<input id="loginPassword" type="password" autocomplete="current-password" placeholder="Sua senha" required style="width:100%;margin-top:6px;"></label>
          <button class="primary" type="submit">Entrar</button>
          <p id="loginMessage" style="min-height:20px;color:var(--muted);"></p>
        </form>
      </section>`;

    document.getElementById("accountBack")?.addEventListener("click", home);
    document.getElementById("loginForm")?.addEventListener("submit", login);
  }

  async function login(e) {
    e.preventDefault();
    const id = normalizePhone(document.getElementById("loginPhone").value);
    const password = document.getElementById("loginPassword").value;
    const msg = document.getElementById("loginMessage");
    const a = getAccount();

    if (!a) return void (msg.textContent = "Nenhuma conta cadastrada neste dispositivo.");

    if (a.phone !== id || a.passwordHash !== await sha256(password))
      return void (msg.textContent = "ID/telefone ou senha incorretos.");

    localStorage.setItem("casinox_player", a.name);
    localStorage.setItem("casinox_phone", a.phone);
    setLogged(true);
    toast(`Bem-vindo, ${a.name}!`);
    home();
  }

  function attach() {
    document.getElementById("login")?.addEventListener("click", home, { once:false });
    document.getElementById("mobile-profile")?.addEventListener("click", home, { once:false });
  }

  attach();
  window.CasinoXAccount = { open: home };
})();
