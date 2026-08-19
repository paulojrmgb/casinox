# CasinoX v2.3 — correção definitiva do botão VOLTAR

Correção principal:
- impede que o clique de um card abra simultaneamente o modal legado v13 e o jogo premium v2.x;
- o jogo premium passa a ser a única camada aberta pelo card;
- remove qualquer modal v13 residual ao abrir um jogo;
- preserva a base mobile da v2.2.

Teste prioritário: Lobby → jogo → VOLTAR. Deve retornar diretamente ao lobby, sem tela antiga intermediária.
