# Conversas em Ink

O runtime de `inkjs` executa o roteiro compilado `townspeople.json`. O compilador não faz parte do bundle do jogador. Para editar texto e condições, altere `townspeople.ink` e execute `node scripts/compile-dialogue.mjs`.

API de integração:

```ts
const session = new DialogueSession(state, customer.id);
const view = new ConversationView(session, {
  portrait: world.portrait(customer.id), // URL opcional, inclusive data URL
  textSpeed: settings.textSpeed,
  instant: settings.instant,
  onChange: () => { void save(); },
  onClose: () => { /* retomar mundo/câmera */ },
  onTrade: () => checkout(),
});
```

Pause o mundo e libere o mouse antes de abrir. `view.close()` remove listeners/timers e dispara onClose uma única vez. `view.element` / `.conversation-overlay` identifica a interface. Escape fecha, espaço/Enter revela fala e 1–6 seleciona respostas; eventos são capturados para não atingir o controle 3D.

Os 25 tópicos têm 75 respostas com conteúdo diferente. A saudação e o tópico íntimo de Elena são condicionais. O estado econômico existente recebe somente consequências explícitas; a primeira resolução de cada tópico cria flags `dialogue.<pessoa>.<tópico>` e `dialogue.<pessoa>.<tópico>.<tom>`. Isso conserva escolhas em saves antigos compatíveis e evita acumular confiança repetindo a mesma pergunta. Memórias e notas registram o resultado. Uma promessa de chá não concede produtos nem altera saldo.

A conversa em andamento não tem um slot próprio: fechar/recarregar retorna aos tópicos, reconstruindo contexto a partir das flags. Histórico exibido durante a conversa é local à sessão; memórias relevantes ficam no save.

Referências primárias: https://github.com/y-lohse/inkjs e https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md. InkJS 2.4.0, MIT; preservar LICENSE.md na distribuição.
