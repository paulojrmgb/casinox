# CasinoX v2.5

## Foco desta versão
Correção dos controles do jogo no celular e no PC sem substituir/clonar os botões existentes.

### Controles
- VOLTAR
- MENOS / MAIS
- GIRAR
- TURBO
- AUTO
- PRÊMIOS
- CRÉDITOS

### Endereço
O portal passa a usar endereço fixo, sem `?v=...`:
`https://paulojrmgb.github.io/casinox/`

### Versão visível
O portal mostra `v2.5` no topo e no rodapé.

### Cache/PWA
O Service Worker usa cache interno `casinox-v2.5`, faz atualização de `index.html`, `app.js`, `styles.css` e conta pela rede quando disponíveis e remove caches antigos.
