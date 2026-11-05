# Autoritária — uma vida do outro lado

Protótipo de desktop de um jogo narrativo em primeira pessoa, ambientado em uma mercearia fictícia em 1986. Interface e roteiro em português brasileiro.

## Versão 0.2

- InkJS executa 25 tópicos e 75 respostas, com condições e consequências persistentes.
- Conversas têm retratos 3D, texto progressivo, histórico, teclas 1–6 e acesso direto ao atendimento.
- Yuka controla a chegada dos clientes aos pontos da rota, com velocidade persistida no save.
- Personagens Kenney animados e objetos de Food/Furniture Kit, com materiais iluminados, substituem os placeholders principais. Texturas de madeira, reboco e piso são Poly Haven. Todos esses assets são CC0 e estão incluídos localmente.
- Conversão de cor corrigida, luz das janelas, materiais ajustados, destaque de objetos e caixa com resumo da compra.
- Salvamento agrupa solicitações concorrentes sem descartar a última decisão. Saves da versão 0.1 continuam compatíveis.

## Jogar neste computador

Dê dois cliques em **Jogar.cmd**, na pasta do projeto. Ele abre o aplicativo de desktop já compilado. Não precisa de internet para jogar.

Alternativa no terminal:

```powershell
npm run desktop
```

## Controles

- WASD: caminhar. Shift: andar mais rápido.
- Mouse: olhar. Clique no cenário para capturar o cursor. Arrastar e setas são alternativas.
- E: interagir com o objeto sob o ponto central.
- Tab: diário, inventário pessoal, relações e acontecimentos.
- Esc: pausar e liberar o cursor. H: ajuda.
- Conversas: Espaço revela a fala; 1–6 seleciona; Esc encerra.
- Prólogo: clique, Espaço ou Enter completa a fala; o próximo comando avança.

## Primeiro expediente

1. Explore a loja. O livro vermelho na mesa do fundo permite comprar estoque e ajustar preços.
2. Vire a placa junto à janela para abrir. A porta sozinha não inicia o expediente.
3. Aguarde o cliente entrar, visitar uma prateleira e chegar ao balcão.
4. Converse com ele. Pegue seu pedido na prateleira à esquerda e deposite na bandeja do balcão, usando E.
5. Opere a caixa registradora para cobrar, conceder desconto ou doar. Cada venda movimenta produtos e dinheiro reais da simulação.
6. Vire a placa novamente para encerrar, conferir as contas e avançar o dia.
7. No dia 2, Mira precisa de ajuda. No dia 3, leia o jornal e confira cartões de abastecimento.

O modo História tem três dias. O modo Infinito compartilha os sistemas e permite continuar indefinidamente. No fim da campanha também é possível continuar o mesmo estado no modo Infinito.

## Desenvolvimento

Node.js 22 ou posterior. `npm install` instala as dependências. `npm run dev` abre o servidor de desenvolvimento; `npm run desktop:dev` conecta o aplicativo a ele. `npm run build` verifica TypeScript e compila; `npm test` testa simulação e persistência. `npm run package:win` gera uma distribuição portátil Windows quando há espaço suficiente no disco.

O aplicativo usa Electron com isolamento de contexto, sandbox e Node desabilitado no renderer. A ponte expõe apenas leitura/gravação do save e tela cheia. Não há serviços remotos, autenticação, analytics ou IA em tempo real.

## Salvamento

Desktop: `%APPDATA%/autoritaria/campaign-v1.json` (o caminho concreto é definido por `app.getPath('userData')`). A gravação é serializada e usa arquivo temporário seguido de renomeação. No navegador de desenvolvimento, usa localStorage. Um novo jogo substitui o único slot após confirmação dentro do jogo.

O save inclui posição/câmera, dia, horário, estoque, produto em mãos, bandeja, saldo, preços, custos médios, NPC em trânsito, relações, escolhas, regras, suspeita, transações e progresso do prólogo. Configurações ficam no armazenamento local da instalação.

## Estrutura

- `src/game/`: simulação independente da apresentação, economia em centavos, condições/efeitos e persistência validada.
- `src/content.ts`: países e moeda provisórios, produtos, moradores, notícias e roteiro.
- `src/render/`: cenário low-poly, texturas locais procedurais, colisões, câmera e efeitos PSX.
- `src/dialogue/`: roteiro Ink e adaptador de consequências; o build recompila o roteiro.
- `src/ui/`: conversas e prólogo orientados a dados; `src/main.ts` conecta menus e interações à simulação.
- `src/audio.ts`: sons sintetizados locais, sem downloads em execução.
- `desktop/`: aplicativo e ponte de arquivos.
- `public/assets/cutscenes/`: pinturas individuais e manifesto de disponibilidade.
- `docs/OPEN_SOURCE_REVIEW.md`: avaliação dos seis repositórios solicitados.

## Estado e limites desta versão

É uma fundação jogável, não um produto pronto para a Steam. NPCs usam rotas autorais guiadas por Yuka e um atendimento por vez; animações usam os clipes dos modelos Kenney; não há cidade inteira explorável nem guerra em combate. As músicas e os efeitos são síntese simples. Não há Steamworks, conquistas, cloud saves, suporte a controle, localização adicional ou assinatura do executável.

O prólogo possui nove cenas com quinze pinturas individuais, incluindo as variantes feminina e masculina. As dimensões reais estão no manifesto de assets; a resolução produzida é inferior ao ideal de 1920 × 1080 e merece uma revisão para lançamento. As pinturas são substituíveis sem alterar o roteiro.

Electron permite distribuir o protótipo desktop; não obriga o projeto futuro a permanecer nesta tecnologia. A simulação separada e os conteúdos orientados a dados facilitam avaliar outro renderer ou engine na próxima etapa.
