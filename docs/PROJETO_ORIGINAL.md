# PROJETO: JOGO NARRATIVO DE SIMULAÇÃO, SOBREVIVÊNCIA E GUERRA — PROTÓTIPO JOGÁVEL

## 1. SUA MISSÃO

Você será o desenvolvedor principal de um jogo independente 3D, em primeira pessoa, com estética inspirada nos jogos de PlayStation 1 (PSX).

Quero que você compreenda profundamente a proposta, pesquise e analise projetos open source existentes e construa um **protótipo funcional, bonito, imersivo e expansível**, reutilizando código de terceiros quando isso for tecnicamente e legalmente apropriado.

**Não quero somente uma demonstração visual. Quero um pequeno jogo que eu possa abrir, explorar, jogar, tomar decisões e repetir.**

Leia todo este documento antes de começar.

---

# 2. VISÃO GERAL DO JOGO

Imagine uma mistura de:

- **Papers, Please:** burocracia, documentos, regras, decisões morais e consequências.
- **Simuladores de comércio:** comprar mercadorias, organizar prateleiras, atender clientes, cobrar, administrar dinheiro e desenvolver um negócio.
- **RPGs narrativos:** personagens recorrentes, relacionamentos, escolhas, amizades, romances e histórias pessoais.
- **Simuladores imersivos:** ambientes tridimensionais com objetos manipuláveis, exploração livre e interações físicas.

O diferencial do jogo será como essas mecânicas se transformam conforme a história avança.

Inicialmente, o jogador administra uma pequena loja e tenta reconstruir sua vida. Aos poucos, a tensão política e militar transforma o funcionamento da cidade, da economia e das relações humanas.

O jogo deve ser agradável e interessante mesmo quando nada dramático está acontecendo.

**Administrar a loja, organizar produtos e conversar com clientes precisa ser divertido por si só.**

A história acrescenta significado e consequências a essas ações.

---

# 3. CONTEXTO NARRATIVO

## Ambientação

A história acontece em meados dos anos 1980, em uma região fictícia inspirada em países europeus do período.

Existem dois países vizinhos que compartilham o idioma e muitas tradições culturais, mas possuem governos, identidades nacionais e disputas históricas diferentes.

Os nomes dos países, a moeda e os detalhes políticos ainda serão definidos. Utilize nomes provisórios quando necessário, mantendo tudo configurável.

## O protagonista

O jogador controla um jovem adulto, cuja aparência e gênero poderão ser personalizados futuramente.

Recentemente, o protagonista perdeu sua mãe, sua última familiar próxima.

Após receber uma herança generosa e sem motivos para permanecer em seu país natal, decidiu emigrar para o país vizinho, esperando encontrar uma vida mais tranquila.

Seu país de origem enfrentava uma grave tensão militar, com a possibilidade de uma guerra iminente.

No novo país, o protagonista alugou uma casa simples e um pequeno estabelecimento comercial, comprou seu primeiro estoque e começou uma nova vida.

Ele deseja estabilidade, independência, amizades e talvez encontrar alguém para amar.

## Desenvolvimento da história

O primeiro período do jogo será relativamente pacífico.

O jogador aprenderá a administrar a loja, conhecerá moradores, fará amizades e estabelecerá uma rotina.

A tensão política aparecerá gradualmente através de jornais, rádio, conversas, cartazes, mudanças de preços e acontecimentos na cidade.

Eventualmente, uma guerra começará.

O país onde o protagonista vive também será afetado. As fronteiras serão fechadas e pessoas nascidas em seu país de origem passarão a sofrer perseguição, detenções arbitrárias e deportações para campos de internamento.

O protagonista poderá perder tudo o que construiu.

O jogo explorará perda, discriminação, sobrevivência, crueldade, amor, amizade, esperança e superação.

**IMPORTANTE:** Não transforme o primeiro dia em um jogo de guerra. O contraste entre a vida tranquila e a tragédia posterior é fundamental.

---

# 4. DIREÇÃO ARTÍSTICA

## Gráficos

O jogo deve parecer um título independente moderno que utiliza deliberadamente estética PSX.

Características:

- Modelos 3D low-poly.
- Texturas pixeladas e de baixa resolução.
- Leve vertex snapping e distorção de texturas.
- Renderização com resolução interna reduzida.
- Dithering e neblina atmosférica.
- Iluminação agradável, com sombras e cores bem pensadas.
- Elementos arquitetônicos e objetos coerentes com os anos 1980.
- Personagens estilizados, mas com silhuetas e expressões reconhecíveis.

A estética não deve ser simplesmente feia ou tecnicamente limitada.

Ela precisa ser artisticamente bonita, atmosférica e intencional.

## Câmera

**Obrigatoriamente em primeira pessoa.**

O jogador controla livremente a câmera com o mouse e movimenta-se pelo ambiente.

Referência visual: um jogo 3D de PS1 moderno, com ambientes detalhados e altamente interativos.

## Interface

Quero uma interface minimalista e imersiva.

Evite barras gigantes de saúde e energia sem função, menus excessivos e elementos ocupando desnecessariamente a tela.

Utilize informações contextuais.

Exemplos:

- Aproximar-se de uma porta: "E — Abrir".
- Olhar para uma lata: "E — Pegar".
- Aproximar-se do caixa: "E — Operar caixa".
- Olhar para um cliente: "E — Conversar".

Diálogos devem aparecer em uma interface retrô elegante, com o nome do personagem, texto e opções de resposta.

Todo o jogo deve estar em português brasileiro.

---

# 5. GAMEPLAY PRINCIPAL

O jogo será organizado em ciclos de dias.

Cada dia terá quatro fases fundamentais.

## Fase A — Preparação

Antes de abrir a loja, o jogador poderá:

- Conferir o dinheiro disponível.
- Verificar o estoque.
- Receber ou comprar mercadorias.
- Organizar prateleiras.
- Ajustar preços.
- Consultar notícias.
- Decidir quando abrir o estabelecimento.

## Fase B — Expediente

Durante o expediente, clientes entrarão fisicamente no estabelecimento.

Eles deverão:

1. Entrar pela porta.
2. Caminhar até uma prateleira ou balcão.
3. Procurar produtos ou solicitar atendimento.
4. Fazer pedidos.
5. Aguardar a ação do jogador.
6. Realizar ou desistir da compra.
7. Sair do estabelecimento.

O jogador atenderá os clientes através de interações em primeira pessoa.

A operação deve parecer física, e não apenas um menu com botões.

## Fase C — Acontecimentos

Durante o expediente poderão ocorrer eventos cotidianos ou narrativos.

Exemplos:

- Um cliente precisa de um produto que está em falta.
- Uma vizinha pede um pequeno desconto.
- Uma pessoa conhecida aparece para conversar.
- Um fornecedor anuncia aumento de preços.
- Um cliente tenta pagar menos.
- Alguém pede ajuda.

Posteriormente, eventos muito mais graves aparecerão conforme a tensão política aumentar.

## Fase D — Encerramento

O jogador fechará a loja e receberá um resumo contendo:

- Faturamento.
- Custos.
- Lucro ou prejuízo.
- Produtos vendidos.
- Estoque restante.
- Acontecimentos importantes.

Ao avançar para o dia seguinte, todas as consequências relevantes devem ser preservadas.

---

# 6. SISTEMAS DE JOGABILIDADE

## 6.1. Interações físicas

Implementar um sistema genérico de interação 3D.

Os objetos interativos terão identificação, estado, ações disponíveis e feedback visual.

Exemplos:

- Portas que abrem e fecham.
- Gavetas.
- Prateleiras.
- Produtos coletáveis.
- Caixa registradora.
- Rádio.
- Jornais.
- Interruptores de iluminação.

O jogador deve conseguir olhar para um objeto e interagir com ele.

A arquitetura precisa permitir acrescentar novos tipos de objetos futuramente.

## 6.2. Inventário e manipulação

Criar dois conceitos distintos:

**Inventário pessoal:** itens que o protagonista carrega.

**Estoque da loja:** mercadorias disponíveis comercialmente.

Um produto deve possuir:

- Identificador.
- Nome.
- Categoria.
- Modelo ou representação visual.
- Preço de compra.
- Preço de venda.
- Quantidade.
- Peso ou volume, se necessário futuramente.

O jogador poderá pegar e depositar produtos em locais apropriados.

## 6.3. Clientes e NPCs

Esse sistema é uma das maiores prioridades.

Quero personagens que pareçam habitantes da cidade, não somente bonecos que aparecem aleatoriamente.

Cada NPC poderá possuir:

- Identidade.
- Nome.
- Aparência.
- Personalidade.
- Rotina.
- Preferências.
- Relação com o protagonista.
- Histórico de encontros.
- Informações e segredos conhecidos.
- Estados emocionais ou necessidades.
- Diálogos contextualizados.

Distinguir dois grupos:

**NPCs persistentes:** moradores importantes que retornam, possuem histórias e lembram decisões.

**NPCs genéricos:** clientes gerados a partir de arquétipos variados, para manter o comércio funcionando.

Não utilizar APIs de inteligência artificial para gerar diálogos em tempo real neste protótipo.

Utilizar comportamentos programados e sistemas de eventos reutilizáveis.

## 6.4. Sistema de diálogo

Implementar conversas com escolhas.

As respostas podem:

- Alterar confiança.
- Alterar afinidade.
- Desbloquear informações.
- Modificar acontecimentos.
- Mudar preços ou oportunidades.
- Abrir ou fechar possibilidades futuras.

Exemplo:

Uma cliente diz que não possui dinheiro suficiente para comprar comida.

O jogador pode:

A. Cobrar normalmente.

B. Conceder desconto.

C. Doar a mercadoria.

D. Recusar o atendimento.

Cada decisão deve alterar os estados correspondentes.

Nem todas as escolhas precisam ter consequências gigantescas. Pequenos detalhes cotidianos também importam.

## 6.5. Economia e comércio

Criar uma economia simples, porém funcional.

A loja terá:

- Saldo financeiro.
- Estoque.
- Preços.
- Compras.
- Vendas.
- Despesas.
- Lucro.
- Registro de transações.

Um cliente deve efetivamente solicitar, receber e pagar por produtos.

As quantidades e os valores devem ser atualizados corretamente.

Preparar o sistema para futuras mudanças econômicas: inflação, escassez, racionamento e mercado clandestino.

## 6.6. Documentos e burocracia

Inspirado no conceito de Papers, Please.

Conforme a história evoluir, o governo poderá introduzir novas regras comerciais.

Exemplos:

- Limites de compra.
- Cartões de racionamento.
- Autorizações para adquirir determinados produtos.
- Identificação obrigatória.
- Restrições comerciais.
- Fiscalizações.

O jogador poderá inspecionar fisicamente documentos e confrontar informações.

No protótipo, implementar pelo menos uma regra simples que possa ser obedecida ou violada.

O sistema de documentos precisa ser expansível, não um minijogo inteiramente separado.

## 6.7. Mundo e passagem do tempo

Criar um relógio interno.

O tempo avança durante as atividades e determina acontecimentos.

O ciclo de dia deve influenciar:

- Entrada de clientes.
- Horário de funcionamento.
- Iluminação.
- Rotina dos NPCs.
- Eventos disponíveis.

Preparar a arquitetura para clima e estações do ano, sem implementar tudo agora.

## 6.8. Persistência

Implementar salvamento local.

Persistir pelo menos:

- Dia e horário.
- Saldo financeiro.
- Estoque.
- Estado da loja.
- Relações com NPCs.
- Eventos concluídos.
- Escolhas narrativas.
- Regras vigentes.
- Histórico básico de transações.

O jogador não deve perder o progresso ao atualizar a página.

---

# 7. NARRATIVA DINÂMICA E CONSEQUÊNCIAS

A narrativa não deve ser apenas uma sequência fixa de cenas.

Quero uma arquitetura orientada a condições e consequências.

Por exemplo:

Um personagem possui uma variável de confiança.

Ajudá-lo aumenta essa confiança.

Prejudicá-lo pode reduzi-la.

Em determinado acontecimento, a confiança e o histórico de decisões determinarão sua reação.

Outro exemplo:

Se o jogador violar frequentemente regras governamentais, seu nível de suspeita poderá aumentar.

Esses valores devem afetar eventos e diálogos futuros.

Criar um sistema de condições, gatilhos, efeitos e flags narrativas, preferencialmente orientado a dados.

**Não é necessário criar centenas de eventos agora. É necessário criar a estrutura para comportá-los futuramente.**

---

# 8. MODO HISTÓRIA E MODO INFINITO

O jogo terá duas experiências.

## Modo História

Campanha narrativa com acontecimentos cuidadosamente planejados, personagens recorrentes, progressão histórica e diferentes consequências.

A administração da loja será uma das atividades centrais, mas futuramente também haverá exploração da cidade, relações pessoais e outras atividades.

## Modo Infinito

Modo sandbox com dias ilimitados.

Características desejadas:

- Clientes gerados continuamente.
- Economia variável.
- Pedidos diferentes.
- Eventos cotidianos aleatórios.
- NPCs persistentes.
- Evolução econômica.
- Decisões com consequências.
- Progressão comercial sem final obrigatório.

**Os dois modos devem reutilizar os mesmos sistemas básicos.**

Não quero dois jogos independentes dentro do mesmo projeto.

O Modo História utiliza eventos roteirizados.

O Modo Infinito utiliza combinações de eventos, regras e comportamentos reutilizáveis.

Ambos compartilham loja, inventário, economia, NPCs, tempo e interações.

---

# 9. PROJETOS OPEN SOURCE PARA ANALISAR

Antes de desenvolver sistemas do zero, inspecione estes repositórios:

### Gráficos PSX

https://github.com/codedgar/three-psx

Estudar seus efeitos visuais e verificar como integrá-los à renderização do protótipo.

### Simulador de supermercado

https://github.com/Photon1c/grocerystoresim

Analisar a lógica de clientes, produtos, filas, navegação e comércio.

Esse projeto pode estar arquivado ou incompleto. Não assuma que está pronto para integração.

### Base em primeira pessoa

https://github.com/augustopolonio/first-person-starter-kit

Analisar movimentação e controle de câmera.

### Comportamentos de NPCs

https://github.com/Mugen87/yuka

Estudar navegação, estados e movimentação de agentes.

### Narrativa ramificada

https://github.com/y-lohse/inkjs

Avaliar integração de variáveis, diálogos e escolhas persistentes.

### Framework de RPG

https://github.com/luzhenqian/overworld

Inspecionar os sistemas de RPG, inventário, diálogos e missões.

## Regras de integração

Não instale tudo cegamente.

Para cada projeto:

1. Verifique sua existência e disponibilidade.
2. Leia a documentação e examine o código.
3. Verifique licença e dependências.
4. Avalie manutenção, compatibilidade e qualidade.
5. Identifique exatamente o que vale reaproveitar.
6. Evite dependências desnecessárias.
7. Não importe aplicações inteiras quando um módulo pequeno resolver o problema.
8. Preserve atribuições e demais obrigações das licenças.

Se algum projeto for inadequado, implemente uma alternativa simples e documente a decisão.

---

# 10. TECNOLOGIAS

Prioridade para este primeiro protótipo:

- Three.js
- TypeScript
- Vite
- HTML/CSS para interfaces
- Armazenamento local para progresso

Não utilizar serviços pagos.

Não exigir Supabase, autenticação, servidores externos ou APIs de IA.

O projeto deve ser executável localmente e testável no navegador.

Usar uma organização modular, separando sistemas de gameplay, renderização, interface, conteúdo narrativo e persistência.

A arquitetura deve permitir futuras expansões sem depender de componentes monolíticos.

---

# 11. ESCOPO EXATO DO PRIMEIRO PROTÓTIPO

Quero um recorte vertical realmente jogável.

Não tente criar o jogo completo agora.

## Cenário inicial

Uma pequena mercearia em uma cidade fictícia dos anos 1980.

O cenário deve incluir:

- Balcão.
- Caixa registradora.
- Prateleiras com produtos.
- Porta de entrada.
- Janelas.
- Iluminação interna.
- Rádio.
- Objetos decorativos da época.
- Uma pequena rua visível do lado de fora.

O jogador deve poder caminhar dentro da loja e interagir com os elementos importantes.

Não é necessário criar uma cidade explorável completa nesta versão.

## Personagens iniciais

Criar pelo menos três personagens recorrentes:

**Dona Mira:** vizinha mais velha, gentil, preocupada com os acontecimentos políticos. Pode atuar como mentora informal do protagonista.

**Tomas:** cliente frequente, trabalhador comum, conhece boa parte dos moradores da região.

**Elena:** jovem moradora da cidade, comunicativa, potencial amizade importante e futura personagem de relacionamento.

Criar também clientes genéricos para o atendimento comercial.

As identidades são provisórias e poderão ser modificadas futuramente.

## Três dias de campanha

### Dia 1 — Um novo começo

Objetivo: ensinar o funcionamento da loja.

O jogador deverá:

- Explorar a mercearia.
- Preparar o estabelecimento.
- Abrir a loja.
- Atender clientes.
- Vender produtos.
- Conversar com pelo menos um morador.
- Encerrar o expediente.

O clima é acolhedor.

Pequenos detalhes no rádio podem sugerir a existência de tensões políticas distantes.

### Dia 2 — Notícias preocupantes

O jogador inicia outro expediente.

Algumas mercadorias estão mais caras.

Um cliente menciona problemas na fronteira.

Uma personagem conhecida enfrenta dificuldades para pagar por comida.

O jogador precisa tomar uma decisão que altere uma variável de relacionamento e produza uma reação verificável.

### Dia 3 — Novas regras

Uma nova regra de racionamento passa a vigorar.

O jogador deve conferir um cartão ou documento para realizar determinada venda.

Uma pessoa conhecida aparece sem documentação adequada.

O jogador poderá cumprir a regra, recusar o atendimento ou arriscar uma venda irregular.

A decisão altera estados persistentes.

A guerra ainda não precisa explodir visualmente neste protótipo. O objetivo é demonstrar o começo da transformação do mundo.

---

# 12. MODO INFINITO DO PROTÓTIPO

Além dos três dias narrativos, implementar uma versão simples do modo infinito.

Esse modo deverá utilizar:

- O mesmo cenário.
- O mesmo inventário.
- O mesmo atendimento.
- A mesma economia.
- O mesmo avanço de dias.
- Os mesmos sistemas de NPCs.

Criar pedidos variados e alguns eventos aleatórios.

O jogador deve conseguir completar vários expedientes consecutivos, economizar dinheiro, repor produtos e continuar sem um limite predefinido de dias.

Não é necessário gerar diálogos complexos infinitamente.

Utilize modelos de situações com parâmetros variáveis e condições de ocorrência.

---

# 13. PADRÃO DE QUALIDADE

O protótipo não deve parecer apenas um teste técnico com três cubos e um personagem parado.

Mesmo usando recursos simples, quero:

- Cenário visualmente coerente.
- Objetos identificáveis.
- Personagens low-poly com aparência distinguível.
- Animações básicas.
- Iluminação atmosférica.
- Sons de interação, quando disponíveis e licenciados.
- Feedback claro de ações.
- Transições suaves.
- Interface organizada.
- Controles agradáveis.
- Experiência funcional de ponta a ponta.

Priorize qualidade e consistência em vez de quantidade de funcionalidades.

Não use botões que apenas fingem executar uma mecânica.

Por exemplo: uma venda deve efetivamente descontar o produto do estoque e adicionar o valor correto ao caixa.

Se determinado sistema não puder ser concluído, implemente uma versão menor que funcione e documente a limitação.

---

# 14. CRITÉRIOS PARA CONSIDERAR O PROTÓTIPO CONCLUÍDO

O protótipo estará pronto quando eu conseguir:

1. Iniciar o jogo no navegador.
2. Escolher Modo História ou Modo Infinito.
3. Caminhar livremente pela loja em primeira pessoa.
4. Olhar para objetos e interagir com eles.
5. Abrir o estabelecimento.
6. Ver clientes entrando e se aproximando do atendimento.
7. Receber e concluir pedidos.
8. Manipular produtos.
9. Registrar vendas corretamente.
10. Conversar com NPCs.
11. Tomar pelo menos uma decisão com consequência persistente.
12. Fechar a loja.
13. Visualizar o resumo financeiro.
14. Avançar para o próximo dia.
15. Salvar e recuperar o progresso.
16. Continuar jogando expedientes no modo infinito.

Teste efetivamente essas funcionalidades.

Verifique também erros de console, navegação dos NPCs, colisões, cálculos financeiros e persistência.

---

# 15. FLUXO DE DESENVOLVIMENTO

Execute o trabalho na seguinte ordem:

**Etapa 1 — Análise técnica**

Inspecione os repositórios open source e escolha os componentes mais adequados.

**Etapa 2 — Fundação**

Configure o projeto, a renderização PSX, a câmera, a movimentação e o cenário inicial.

**Etapa 3 — Mecânicas essenciais**

Implemente interações, produtos, estoque, caixa e clientes.

**Etapa 4 — Narrativa**

Implemente diálogos, eventos, condições, escolhas e os três dias.

**Etapa 5 — Modo infinito**

Reutilize a arquitetura para permitir expedientes ilimitados.

**Etapa 6 — Polimento e validação**

Teste os sistemas, corrija erros e melhore a apresentação.

Não abandone o trabalho na etapa de planejamento.

**A entrega principal deve ser código executável e uma experiência jogável.**

Se alguma funcionalidade avançada comprometer o funcionamento do conjunto, reduza seu escopo e preserve uma versão jogável consistente.

---

# 16. VISÃO DE LONGO PRAZO

Este protótipo servirá de fundamento para um jogo muito maior.

No futuro, pretendo adicionar:

- Cidade explorável.
- Casa personalizável.
- Moradores com rotinas complexas.
- Relacionamentos e romances.
- Novos fornecedores.
- Expansão da loja.
- Eventos políticos.
- Transformações urbanas decorrentes da guerra.
- Sistema de documentos mais complexo.
- Mercado clandestino.
- Perseguições.
- Diferentes caminhos narrativos.
- Múltiplos finais.
- Sobrevivência fora do comércio.
- Atividades secundárias.
- Sistemas econômicos e sociais mais profundos.

Não implemente tudo isso agora.

Mas evite decisões arquiteturais que impeçam essas expansões.

## ORIENTAÇÃO FINAL

Quero construir um jogo cuja experiência comece de maneira aconchegante, quase como um simulador de vida, e gradualmente evolua para uma história profunda sobre sobrevivência e relações humanas durante uma guerra.

O jogador precisa se apegar ao cotidiano e às pessoas.

As mecânicas comerciais, os personagens e o mundo devem trabalhar juntos para construir esse vínculo.

Não quero apenas copiar Papers, Please ou qualquer outro jogo.

Quero criar uma experiência própria, em primeira pessoa, com forte identidade narrativa e sistemas interativos.

**Agora analise os projetos indicados, estabeleça a arquitetura e comece a implementação do primeiro protótipo jogável. Use sua autonomia técnica, mas respeite integralmente a visão descrita.**