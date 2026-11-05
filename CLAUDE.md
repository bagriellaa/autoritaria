# Autoritária — continuidade do desenvolvimento

Leia README.md, docs/PROJETO_ORIGINAL.md e docs/PROLOGO_ORIGINAL.md antes de modificar o jogo. O usuário quer um jogo de desktop para futuro lançamento na Steam, em primeira pessoa, com estética PSX e interface em português brasileiro. O primeiro dia é acolhedor; a tensão política cresce gradualmente.

Estado: protótipo 0.2 em Three.js + TypeScript + Vite + Electron. Três dias de campanha e modo infinito compartilham economia, estoque, NPCs e persistência. InkJS executa conversas ramificadas; Yuka controla movimento em rotas autorais. Assets Kenney e Poly Haven são locais e CC0. Preserve atribuições.

Instalação: Node.js 22+, npm ci. Verificação: npm test e npm run build. Executar desktop: npm run desktop. Empacotar Windows: npm run package:win. Jogar.cmd funciona depois da instalação/build. release e node_modules não estão versionados.

O roteiro editável fica em src/dialogue/townspeople.ink e é recompilado no build. Estado econômico em centavos; consequências de diálogo são idempotentes. Preserve compatibilidade dos saves v1. Não introduza serviços pagos, autenticação, APIs de IA em runtime ou telemetria.

Consulte docs/VALIDATION.md, docs/ASSET_SOURCES.md e docs/OPEN_SOURCE_REVIEW.md para testes, limitações e decisões. Última validação: 29 testes passaram; testes Electron de prólogo, movimento, diálogo, coleta e venda passaram. Os scripts de desktop usam perfis separados em .preview. As capturas temporárias não estão versionadas.

Limites atuais: um cliente por vez, rotas fixas, personagens blocados com animações Kenney, Mira adaptada de uma base feminina, áudio sintetizado e ausência de Steamworks/controle. Não confunda este recorte com um produto pronto para lançamento. Priorize melhorias jogáveis e verificadas no aplicativo.
