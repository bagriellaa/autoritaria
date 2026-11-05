# Validação da versão 0.2 — 5 de novembro de 2026

- Build: roteiro Ink compilado, TypeScript e Vite sem erros; dependências separadas em chunks.
- 29 testes automatizados passaram. Novos testes cobrem tópicos dos seis moradores, desbloqueios condicionais, efeitos idempotentes, continuidade de escolhas e trajetos Yuka sem atravessar balcão/prateleiras.
- Teste integrado Electron de atendimento passou: coleta por raycast, bandeja, recarga do save, caixa, conversa com retrato 3D, escolha Ink, efeito de confiança e venda real. Receita C$ 2,50, estoque reduzido e NPC saindo. Sem erros de renderer registrados nesse teste.
- Teste Electron do menu/prólogo/movimentação usa perfil separado, sem modificar o save do jogador. Resultados estão em `.preview/smoke-result.json`.
- Capturas reais do renderer foram inspecionadas. Madeira escura, escala do piso, conflito de estado da animação e shader duplicado foram encontrados e corrigidos durante QA.
- Os testes de desktop desativam throttling de janelas de teste e aguardam assets carregados; o aplicativo normal mantém pausa em segundo plano.

Limites: não houve playthrough humano longo nem validação de hardware variado. Personagens seguem a estética blocada do pack; Mira compartilha uma base feminina adaptada. Rotas são autorais, não uma navmesh de cidade. Um cliente é atendido por vez. Steamworks, controle, assinatura e lançamento comercial continuam fora desta versão.

---

# Validação do protótipo

- `npm run build`: TypeScript e build Vite concluídos.
- `npm test`: 22 testes passaram; economia em centavos, conservação de mercadorias, descontos, doações, documentos, suspeita/multas, três dias, modo infinito, navegação persistente e validação de saves.
- `tests/desktop-smoke.cjs`: executado no Electron com perfil separado. Menu, escolha feminina, digitação real, avanço de fala, confirmação de pulo, renderer WebGL, diário, movimento WASD, save em arquivo e ausência de erros no console do renderer passaram.
- `tests/desktop-trade.cjs`: executado no renderer real com posições iniciais controladas. Raycast de prateleira, coleta com E, recarga do item em mãos, depósito na bandeja, abertura do caixa e venda passaram. Saldo passou de C$ 85,00 para C$ 87,50; uma unidade saiu do estoque; bandeja esvaziou e NPC iniciou a saída.
- Capturas locais em `.preview/shop.png` e `.preview/prologue.png`. Cenário e composição de leitura inspecionados visualmente. O teste integrado lê a interface e o save reais, não um botão de demonstração.
- Quinze pinturas integradas; manifesto gerado com dimensões e tamanhos reais. Variantes inspecionadas durante produção. Não houve colagem ou recorte de storyboard.

Limites: a inspeção interativa pelo helper de Windows expirou aguardando aprovação; a validação prosseguiu pelo harness Electron local e capturas do próprio aplicativo. Não foi realizado um playthrough humano longo, nem teste de hardware variado, controle, Steamworks ou distribuição assinada. Resolução das pinturas abaixo do ideal solicitado registrada em ART_DIRECTION.md. O pacote é um protótipo local Windows, não uma versão pronta para publicação na Steam.
