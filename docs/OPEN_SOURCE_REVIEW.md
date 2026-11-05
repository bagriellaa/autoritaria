# Análise dos projetos open source

Consulta realizada em **4 de novembro de 2026**. Foram consultados os repositórios públicos, metadados da API do GitHub, README, arquivos de licença, manifests e os módulos indicados abaixo. Esta é uma inspeção estática; não foram executadas as aplicações ou suas suítes. Datas de `pushed_at` não demonstram, por si sós, qualidade ou compromisso de manutenção.

## Atualização 0.2 — implementada em 5 de novembro

A decisão inicial abaixo foi revista conforme a ampliação solicitada. InkJS 2.4.0 agora executa o roteiro compilado de conversas; Yuka 0.7.8 calcula steering por Vehicle e ArriveBehavior. Os adaptadores estão em `src/dialogue/session.ts` e `src/game/navigation.ts`. Não são imports apenas declarativos: a interface usa as escolhas de Ink, e a simulação usa o movimento calculado por Yuka. Consequências ficam no save do jogo; velocidade de navegação também é serializada. Não há compilador Ink dentro do runtime distribuído.

Assets Kenney e texturas Poly Haven foram adquiridos e integrados; fontes, licenças e inventário estão em `ASSET_SOURCES.md`. Os outros quatro repositórios continuam como referências: não foram importados componentes incompatíveis ou aplicações inteiras. Licenças MIT de InkJS/Yuka e CC0 dos assets acompanham a distribuição.

## Decisão inicial para o protótipo 0.1

Usar **Three.js como dependência de execução**, com TypeScript e Vite no desenvolvimento. Implementar localmente o controlador com colisões, estados de clientes, transações e conteúdo narrativo. Não incorporar aplicações completas nem copiar código dos seis projetos nesta etapa. A decisão reduz dependências, evita importar telemetria e mantém uma única fonte de verdade para saldo, estoque e narrativa.

Isso é adequado ao recorte de uma loja com rotas fixas, três dias roteirizados e eventos parametrizados. Não significa que as bibliotecas sejam inadequadas em geral: **Yuka** e **InkJS** são candidatas fortes quando navegação ou autoria narrativa crescerem. Manter adaptadores e conteúdo separado permite essa troca.

| Projeto | Estado observado | Licença verificada | Versão no manifest | Último push informado pela API (UTC) |
|---|---|---|---|---|
| codedgar/three-psx | Público, não arquivado | MIT, codedgar, 2026 | 0.1.0 | 2026-08-04 04:32 |
| Photon1c/grocerystoresim | Público, arquivado em 23/06/2026 | MIT, Leslie Cuadra, 2025 | 0.0.0 (privado no npm) | 2025-06-17 23:38 |
| augustopolonio/first-person-starter-kit | Público, não arquivado | MIT, Augusto Polonio, 2026 | 1.0.0 | 2026-08-01 22:22 |
| Mugen87/yuka | Público, não arquivado | MIT, Yuka authors, 2023 | 0.7.8 | 2026-10-20 15:04 |
| y-lohse/inkjs | Público, não arquivado | MIT, inkle Ltd. e inkjs contributors, 2017 | 2.4.0 | 2026-11-01 13:11 |
| luzhenqian/overworld | Público, não arquivado | MIT, NoahLu, 2026 | raiz 0.9.0; pacotes inspecionados 3.2.0 | 2026-07-27 00:16 |

## 1. three-psx

[Repositório e documentação](https://github.com/codedgar/three-psx). Revisão: `72950152885a66406b344053c0566f5ce8644ffc`.

Arquivos examinados: `README.md`, `LICENSE`, `package.json`, `src/PSX.ts`, `src/shaders.ts`.

O módulo cria render target de baixa resolução, filtragem nearest, passe final de quantização/dithering e materiais próprios. Os shaders implementam snapping em coordenadas projetadas, UV afim, iluminação por vértice e neblina. O pipeline suporta uma luz direcional, ambiente e uma luz pontual; seu tratamento deliberado de gama difere de materiais padrão do Three.js. React/R3F e lil-gui são peers opcionais; Three.js >=0.150 é obrigatório. O desenvolvimento usa Three.js ^0.185 e Vite ^8.

**Decisão:** referência técnica, sem instalar. Para esta cena, efeitos leves locais e materiais do Three.js permitem preservar sombras e iluminação já controladas pelo jogo. A versão 0.1.0 e o pipeline próprio exigiriam validação de gama, luzes e descarte de recursos. Reavaliar quando houver orçamento para uma conversão integral de materiais. Não alegar emulação exata do PS1.

Fontes: [manifest](https://github.com/codedgar/three-psx/blob/72950152885a66406b344053c0566f5ce8644ffc/package.json), [pipeline](https://github.com/codedgar/three-psx/blob/72950152885a66406b344053c0566f5ce8644ffc/src/PSX.ts), [shaders](https://github.com/codedgar/three-psx/blob/72950152885a66406b344053c0566f5ce8644ffc/src/shaders.ts), [licença](https://github.com/codedgar/three-psx/blob/72950152885a66406b344053c0566f5ce8644ffc/LICENSE).

## 2. Grocery Store Simulation

[Repositório e documentação](https://github.com/Photon1c/grocerystoresim). Revisão: `61d7190c98c15aab48e540c1258a9f8f52293389`.

Arquivos examinados: `README.md`, `LICENSE`, `package.json`, `src/assets/logic/{agentController,inventory,pathfinding}.js` e trechos de estados/filas de `src/assets/agents/customer_agents.js`.

Usa Three.js ^0.177 e Vite ^6.3.5. Clientes possuem listas, waypoints por corredor, filas e tempo de checkout. Entretanto, `findPath` está explicitamente marcado como stub e retorna apenas origem/destino. `inventory.js` fornece nomes de produtos e sua associação a corredores, sem contabilidade de quantidades ou dinheiro. O README ainda lista coleta de itens e salvamento como trabalho futuro.

**Decisão:** não integrar. Aproveitar como referência conceitual o percurso entrada → procura → fila → caixa → saída. Implementar rotas verificadas para a geometria local e transações atômicas de estoque/saldo. A aplicação arquivada, de câmera isométrica/superior, não constitui uma base pronta para o comércio físico em primeira pessoa solicitado.

Fontes: [clientes](https://github.com/Photon1c/grocerystoresim/blob/61d7190c98c15aab48e540c1258a9f8f52293389/src/assets/agents/customer_agents.js), [navegação incompleta](https://github.com/Photon1c/grocerystoresim/blob/61d7190c98c15aab48e540c1258a9f8f52293389/src/assets/logic/pathfinding.js), [licença](https://github.com/Photon1c/grocerystoresim/blob/61d7190c98c15aab48e540c1258a9f8f52293389/LICENSE).

## 3. First Person Starter Kit

[Repositório e documentação](https://github.com/augustopolonio/first-person-starter-kit). Revisão: `d6c1746698030539bbb595e782f8ea520be7d900`.

Arquivos examinados: `README.md`, `LICENSE`, `package.json`, `src/core/Player.js`, `src/input/PointerLock.js`.

O controlador separa entrada, trava do ponteiro e jogador. Normaliza movimento diagonal, usa Euler YXZ para a câmera e mantém altura fixa. A implementação examinada move diretamente a posição, sem resolver colisões. O manifest traz Three.js ^0.170, lil-gui ^0.21 e @vercel/analytics ^2.0.1, além de Vite ^6. O README reconhece colisão como possível extensão. Assets Kenney são citados separadamente pelo projeto.

**Decisão:** implementar controlador compacto próprio com Pointer Lock, limites de pitch, colisão de paredes/móveis e liberação do mouse em diálogos. Não incorporar analytics, GUI de desenvolvimento nem assets. As técnicas de câmera são padrões; nenhum trecho foi copiado. A base é legível, mas importá-la não dispensaria a parte crítica de colisões deste jogo.

Fontes: [Player](https://github.com/augustopolonio/first-person-starter-kit/blob/d6c1746698030539bbb595e782f8ea520be7d900/src/core/Player.js), [manifest](https://github.com/augustopolonio/first-person-starter-kit/blob/d6c1746698030539bbb595e782f8ea520be7d900/package.json), [licença](https://github.com/augustopolonio/first-person-starter-kit/blob/d6c1746698030539bbb595e782f8ea520be7d900/LICENSE).

## 4. Yuka

[Repositório e documentação](https://github.com/Mugen87/yuka). Revisão: `10591304811222d6856020d5de129b39ef43b58d`.

Arquivos examinados: `README.md`, `LICENSE`, `package.json`, `src/fsm/StateMachine.js`, `src/steering/behaviors/FollowPathBehavior.js`.

Biblioteca independente do renderizador, sem dependências de execução declaradas. A máquina de estados mantém estado atual/anterior/global, IDs e serialização. FollowPath combina busca do waypoint com desaceleração na chegada final; a API também expõe grafos e navmesh. Há comandos de testes Mocha/nyc no manifest, mas não foram executados nesta análise.

**Decisão:** adiar dependência. Uma máquina pequena com estados serializáveis e rotas conhecidas atende à mercearia. Yuka passa a ser vantajosa com cidade explorável, objetivos concorrentes e navegação mais complexa. Nesse momento será necessário sincronizar transformações Three.js, colisores, rotas e IDs persistentes; instalar a biblioteca sozinha não implementa comportamento social ou comércio.

Fontes: [máquina de estados](https://github.com/Mugen87/yuka/blob/10591304811222d6856020d5de129b39ef43b58d/src/fsm/StateMachine.js), [seguir rota](https://github.com/Mugen87/yuka/blob/10591304811222d6856020d5de129b39ef43b58d/src/steering/behaviors/FollowPathBehavior.js), [licença](https://github.com/Mugen87/yuka/blob/10591304811222d6856020d5de129b39ef43b58d/LICENSE).

## 5. InkJS

[Repositório e documentação](https://github.com/y-lohse/inkjs). Revisão: `fdc440a2c5a69c1fdb1e7d9765490a06d4cd092b`.

Arquivos examinados: `README.md`, `LICENSE.md`, `package.json`, `src/engine/Story.ts` e métodos de serialização em `src/engine/StoryState.ts`.

Runtime narrativo sem dependências de execução declaradas, com export ESM e versão completa incluindo compilador. `Story` oferece escolhas, texto, tags e variáveis; `StoryState` possui `ToJson`/`LoadJson` e valida versão do save. A compatibilidade do formato compilado é explícita; no código examinado, versão Ink atual 21 e mínima 18.

**Decisão:** conteúdo em dados tipados para as nove cenas lineares e poucas ramificações. Não há necessidade de compilador Ink neste recorte. Reavaliar InkJS quando a escrita exigir ferramentas para autores, muitas condições, nós e contagem de visitas. Uma integração futura deverá salvar estado Ink junto ao estado econômico e garantir que efeitos de uma escolha não sejam aplicados duas vezes ao carregar.

Fontes: [Story](https://github.com/y-lohse/inkjs/blob/fdc440a2c5a69c1fdb1e7d9765490a06d4cd092b/src/engine/Story.ts), [salvamento](https://github.com/y-lohse/inkjs/blob/fdc440a2c5a69c1fdb1e7d9765490a06d4cd092b/src/engine/StoryState.ts), [licença](https://github.com/y-lohse/inkjs/blob/fdc440a2c5a69c1fdb1e7d9765490a06d4cd092b/LICENSE.md).

## 6. Overworld

[Repositório e documentação](https://github.com/luzhenqian/overworld). Revisão: `2fa9266542de81ef44bd6b858b6f8a825c1dc591`.

Arquivos examinados: README, LICENSE, manifests da raiz/core/dialogue/inventory, `packages/core/src/registry.ts`, `packages/dialogue/src/engine.ts`, `packages/inventory/src/createInventory.ts`, `examples/starter/src/game/engines.ts`.

O framework separa condições, efeitos, eventos, inventário e diálogo. O inventário oferece pilhas, capacidade e remoção integral; diálogo persiste relações e flags, mas não a conversa em andamento. Core/inventory exigem Zustand ^5 como peer; dialogue também declara React ^18. O exemplo combina muitos pacotes e desativa persistência em alguns motores. O registro ignora efeitos desconhecidos com aviso, enquanto condições desconhecidas retornam falso.

**Decisão:** não importar o framework para uma aplicação vanilla. Reaproveitar a ideia arquitetural de condições/efeitos orientados a dados, com uma implementação menor e validação de conteúdo no projeto. Manter economia e salvamento unificados evita conciliar vários stores. Os módulos são relevantes para expansão, mas acrescentariam convenções e dependências que este recorte não utiliza.

Fontes: [registros](https://github.com/luzhenqian/overworld/blob/2fa9266542de81ef44bd6b858b6f8a825c1dc591/packages/core/src/registry.ts), [inventário](https://github.com/luzhenqian/overworld/blob/2fa9266542de81ef44bd6b858b6f8a825c1dc591/packages/inventory/src/createInventory.ts), [diálogo](https://github.com/luzhenqian/overworld/blob/2fa9266542de81ef44bd6b858b6f8a825c1dc591/packages/dialogue/src/engine.ts), [licença](https://github.com/luzhenqian/overworld/blob/2fa9266542de81ef44bd6b858b6f8a825c1dc591/LICENSE).

## Atribuição e limites

As seis licenças consultadas são MIT e exigem preservar aviso de copyright e permissão ao distribuir cópias ou partes substanciais. Como não foi incorporado código desses projetos, esta lista documenta referências técnicas, não dependências. Qualquer futura extração deverá incluir o texto integral da licença e o autor correspondente. Assets externos têm de ser verificados individualmente; a licença do repositório não deve ser presumida para todo conteúdo de terceiros.

A licença do Three.js e as licenças das dependências efetivamente distribuídas devem acompanhar a entrega. Não foram importados modelos, áudio, marcas, dados, telemetria ou aplicações desses seis projetos.

Esta revisão não é um benchmark nem uma auditoria completa de segurança. Reavaliar versões e executar testes de integração antes de introduzir qualquer uma dessas bibliotecas no jogo.
