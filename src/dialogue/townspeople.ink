VAR day = 1
VAR trust = 0
VAR affinity = 0
VAR female = true
VAR helped_mira = false
VAR refused_mira = false
VAR tea_promised = false
-> END

=== mira ===
{
- helped_mira:
    Você me ajudou quando eu mais precisava. Esta rua já sabe que pode contar com você.
- refused_mira:
    Bom dia. Hoje trouxe o dinheiro contado. Podemos conversar um pouco, se não estiver ocupada a loja.
- day == 2:
    O remédio levou quase toda a minha pensão. Hoje só consigo pagar metade do pão. Fiquei com vergonha de pedir.
- else:
    {female:Bem-vinda|Bem-vindo} à rua das tílias. Moro na casa verde. Ainda estou aprendendo o som da sua porta abrindo.
}
-> mira_menu
=== mira_menu ===
+ [Como é viver neste bairro?] -> mira_bairro
+ [Você conheceu quem tinha esta loja?] -> mira_loja
+ [Sente falta de alguém?] -> mira_memoria
+ [O que acha das notícias?] -> mira_noticias
+ [Vou cuidar do seu pedido.] -> END
=== mira_bairro ===
Aqui, todo mundo percebe uma janela que não abriu. Pode parecer intromissão. Às vezes é só cuidado.
+ [Gosto de pensar que alguém notaria minha falta.]
    Então já sabe por que moro aqui há quarenta anos. Amanhã, se vir a minha janela fechada, bata à porta. # effect: bairro:warm
    -> mira_menu
+ [Ainda estou descobrindo como as coisas funcionam.]
    Vá devagar. Ninguém aprende uma cidade inteira em um dia. # effect: bairro:neutral
    -> mira_menu
+ [Prefiro que cada um cuide da própria vida.]
    Entendo. Só espero que não confunda uma mão estendida com uma invasão. # effect: bairro:cold
    -> mira_menu
=== mira_loja ===
O senhor Arno mantinha um caderno de fiados. Sabia quem podia pagar na sexta e quem precisava esperar o mês acabar.
+ [Talvez eu possa encontrar meu próprio jeito de ajudar.]
    Ajudar sem se perder também é uma habilidade. Não esqueça de comer antes de alimentar a rua inteira. # effect: loja:warm
    -> mira_menu
+ [E ele conseguia manter as contas em dia?]
    Nem sempre. Mas anotava tudo, até os pequenos favores. Seu livro de estoque será um bom amigo. # effect: loja:neutral
    -> mira_menu
+ [Não quero que esperem favores de mim.]
    Então diga isso com delicadeza. As palavras também deixam marcas no balcão. # effect: loja:cold
    -> mira_menu
=== mira_memoria ===
Do meu marido. De como ele desafinava enquanto consertava uma cadeira. As coisas pequenas fazem mais falta.
+ [Minha mãe também se foi. Às vezes ainda espero ouvi-la.]
    Não precisa me contar tudo hoje. Podemos tomar um chá em silêncio. Eu sei como esse silêncio soa. # effect: memoria:warm
    -> mira_menu
+ [Parece uma boa lembrança para guardar.]
    É. Algumas lembranças acabam virando a casa onde a gente mora. # effect: memoria:neutral
    -> mira_menu
+ [Talvez seja melhor não olhar tanto para trás.]
    Talvez. Mas deixar a tristeza para trás não é o mesmo que esquecer uma pessoa. # effect: memoria:cold
    -> mira_menu
=== mira_noticias ===
{day < 2:A rádio fala de reuniões distantes. Hoje prefiro saber se vai chover na feira.|Quando os jornais começam a chamar vizinhos de estrangeiros, eu presto atenção. Já ouvi palavras assim antes.}
+ [Se as coisas piorarem, vamos cuidar uns dos outros.]
    Guarde essa frase. Não só para mim. Para o dia em que alguém mais precisar ouvi-la. # effect: noticias:warm
    -> mira_menu
+ [Quero entender melhor antes de tirar conclusões.]
    Leia o jornal. E escute quem está sentado ao seu lado. Nem sempre contam a mesma história. # effect: noticias:neutral
    -> mira_menu
+ [As autoridades devem saber o que estão fazendo.]
    Espero que sim. Mas esperança não deve impedir uma boa pergunta. # effect: noticias:cold
    -> mira_menu

=== tomas ===
{day < 2:Bom dia! Saí da estação com cheiro de carvão e uma fome que não cabe no casaco.|O trem da fronteira atrasou outra vez. O turno acaba; a preocupação vem para casa com a gente.}
-> tomas_menu
=== tomas_menu ===
+ [Como é trabalhar na estação?] -> tomas_trabalho
+ [Quem entrega as mercadorias daqui?] -> tomas_entregas
+ [Conhece algum lugar para descansar?] -> tomas_rio
+ [O que está acontecendo na fronteira?] -> tomas_fronteira
+ [Vou separar sua compra.] -> END
=== tomas_trabalho ===
Gosto de ver as pessoas chegando. Cada mala tem um peso que a balança não mede. A sua devia estar pesada.
+ [Mais do que parecia. Estou tentando deixá-la mais leve.]
    Se precisar conversar depois do turno, estarei no banco perto da estação. Não sou bom com conselhos, mas sei escutar. # effect: trabalho:warm
    -> tomas_menu
+ [Pelo menos já consegui abrir a loja.]
    E isso não é pouca coisa. Uma porta aberta dá coragem para a próxima. # effect: trabalho:neutral
    -> tomas_menu
+ [Prefiro não falar de onde vim.]
    Certo. Não vou insistir. Aqui você pode ser só a pessoa que vende um bom pão. # effect: trabalho:cold
    -> tomas_menu
=== tomas_entregas ===
A cooperativa abastece quase toda a rua. Compre lotes pequenos enquanto descobre o que vende. Dinheiro parado na prateleira também pesa.
+ [Obrigado. É bom ter alguém que conhece o caminho.]
    Posso avisar quando o caminhão chegar cedo. E carregar uma caixa, se sobrar tempo. # effect: entregas:warm
    -> tomas_menu
+ [Vou conferir meus custos no livro.]
    Isso. Comprar mercadoria não é a mesma coisa que perder dinheiro: parte do saldo agora está nas latas. # effect: entregas:neutral
    -> tomas_menu
+ [Se aumentar tudo, repasso o preço sem pensar.]
    Pode fazer. Mas o salário de quem compra não sobe junto com a etiqueta. # effect: entregas:cold
    -> tomas_menu
=== tomas_rio ===
Há uma ponte de pedra depois da praça. À noite dá para ouvir o rio por baixo dos trilhos. É onde tento esquecer o apito dos trens.
+ [Um dia podemos ir juntos depois do expediente.]
    Combinado. Levo um pão, você leva uma história. Sem obrigação de ser uma história feliz. # effect: rio:warm
    -> tomas_menu
+ [Vou guardar a indicação.]
    Vá quando puder. Descansar também faz parte do trabalho. # effect: rio:neutral
    -> tomas_menu
+ [Não tenho tempo para essas coisas.]
    Se esperar sobrar tempo, nunca vai conhecer o rio. Mas não sou eu quem fecha sua loja. # effect: rio:cold
    -> tomas_menu
=== tomas_fronteira ===
{day < 2:Por enquanto, boatos. Não vou fingir que sei mais do que o jornal.|Estão abrindo malas, conferindo nomes, atrasando cargas. Um colega ficou horas explicando por que nasceu do outro lado.}
+ [Nasci lá. Isso me preocupa.]
    Para mim você é a pessoa desta mercearia. Se ouvir algo concreto, venho avisar. # effect: fronteira:warm
    -> tomas_menu
+ [Vamos separar os fatos dos rumores.]
    Justo. A estação produz rumores quase tão rápido quanto fumaça. # effect: fronteira:neutral
    -> tomas_menu
+ [Se revistaram, algum motivo devem ter.]
    Às vezes o único motivo é um carimbo no lugar errado. Eu teria cuidado antes de julgar. # effect: fronteira:cold
    -> tomas_menu

=== elena ===
{tea_promised:Guardei aquele convite para o chá. Algumas promessas pequenas deixam o dia mais leve.|{affinity > 0:Lembrei da nossa última conversa. Passei na rua e quis entrar.|Você veio de Véspera? Minha avó nasceu lá. Talvez tenhamos mais em comum do que parece.}}
{day >= 3:Meu cartão venceu ontem. A repartição estava fechada. Não sei como resolver isso hoje.}
-> elena_menu
=== elena_menu ===
+ [O que gosta de fazer nesta cidade?] -> elena_cidade
+ [Sua avó falava de Véspera?] -> elena_origem
+ [Você gostaria de viajar?] -> elena_viagem
+ [Quer tomar um chá quando eu fechar?] -> elena_cha
+ {trust >= 3} [Você parece preocupada. Quer me contar?] -> elena_segredo
+ [Vou buscar seu pedido.] -> END
=== elena_cidade ===
Eu desenho as janelas da rua. Não as casas inteiras: só as janelas. Cada uma mostra um pedaço diferente da vida.
+ [Pode desenhar a minha quando quiser.]
    Posso? Vou tentar acertar a luz da manhã. E deixar espaço para as pessoas que ainda vão entrar. # effect: cidade:warm
    -> elena_menu
+ [Nunca tinha reparado nelas assim.]
    Comece pela janela verde da Mira. Ela troca as flores toda terça. # effect: cidade:neutral
    -> elena_menu
+ [Parece uma perda de tempo.]
    Pode ser. Mas é um tempo que escolhi perder. Gosto de ter pelo menos um desses. # effect: cidade:cold
    -> elena_menu
=== elena_origem ===
Falava do pão escuro, de uma praça com tílias e da chuva. Quando fechava os olhos, ainda sabia o caminho da escola.
+ [Minha mãe também guardava lugares assim na memória.]
    Talvez a gente possa trocar essas lembranças. Assim elas não ficam guardadas em uma pessoa só. # effect: origem:warm
    -> elena_menu
+ [Os costumes são mesmo muito parecidos.]
    É o que me espanta quando ouço dizerem que somos tão diferentes. # effect: origem:neutral
    -> elena_menu
+ [Prefiro deixar aquele país para trás.]
    Tudo bem. Não vou pedir que sinta saudade só porque minha avó sentia. # effect: origem:cold
    -> elena_menu
=== elena_viagem ===
Quero ver o mar. Nunca vi. Mas minha mãe precisa de ajuda na oficina, e sempre há alguma coisa mais urgente.
+ [Podemos planejar uma coisa pequena de cada vez.]
    Uma passagem não se compra com vontade, eu sei. Mas um plano começa assim. Obrigada por não rir. # effect: viagem:warm
    -> elena_menu
+ [Talvez uma viagem curta seja um começo.]
    A cidade do lago fica a duas horas. Seria um primeiro desenho fora deste caderno. # effect: viagem:neutral
    -> elena_menu
+ [Sonhar com isso só torna a rotina mais difícil.]
    Para mim é o contrário. Mas acho que cada pessoa aprende a atravessar os dias de um jeito. # effect: viagem:cold
    -> elena_menu
=== elena_cha ===
{affinity > 0:Quero. Só se você também sentar; não vale continuar trabalhando enquanto conversamos.|Seria bom. Ainda estamos nos conhecendo, mas uma xícara é um começo simples.}
+ [Combinado. Vou guardar um tempo para nós.]
    Então fica combinado. Gosto de um convite que cabe na vida de verdade. # effect: cha:warm
    ~ tea_promised = true
    -> elena_menu
+ [Podemos combinar um dia mais tranquilo.]
    Sem pressa. Não quero virar mais uma tarefa na sua lista. # effect: cha:neutral
    -> elena_menu
+ [Foi só modo de dizer.]
    Ah. Entendi. Então vou deixar você terminar o atendimento. # effect: cha:cold
    -> elena_menu
=== elena_segredo ===
Meu irmão escreve de Véspera. Faz duas semanas que não chega carta. Eu sorrio para minha mãe e digo que é atraso do correio.
+ [Você não precisa fingir tranquilidade comigo.]
    Obrigada. Não conte isso pela rua. Só precisava dizer em voz alta para alguém em quem confio. # effect: segredo:warm
    -> elena_menu
+ [Podemos perguntar a Ivo sobre as entregas.]
    Talvez ele saiba alguma coisa. Perguntar é melhor do que imaginar o pior sozinha. # effect: segredo:neutral
    -> elena_menu
+ [Não quero me envolver nisso.]
    Entendo. Desculpe ter colocado essa preocupação no seu balcão. # effect: segredo:cold
    -> elena_menu

=== ivo ===
Bom dia. Hoje trouxe mais cartas do que encomendas. Ainda gosto de pensar que isso é um bom sinal.
-> ivo_menu
=== ivo_menu ===
+ [As cartas da fronteira estão chegando?] -> ivo_cartas
+ [Você conhece todos os endereços?] -> ivo_rua
+ [Que chá prefere?] -> ivo_cha
+ [Como foi seu dia?] -> ivo_rotina
+ [Já separo sua compra.] -> END
=== ivo_cartas ===
{day < 2:Chegam, sim. Algumas viajam semanas para atravessar uma rua no mapa.|Há atrasos. Uma carta que não chegou ainda não é uma notícia ruim. Mas sei como é difícil esperar.}
+ [Vou lembrar disso quando alguém estiver preocupado.]
    Ajuda mais do que repetir boatos. Se houver uma mudança concreta, eu aviso. # effect: cartas:warm
    -> ivo_menu
+ [Obrigado pela informação.]
    É para isso que serve conhecer o carteiro do bairro. # effect: cartas:neutral
    -> ivo_menu
+ [Vocês deveriam trabalhar mais rápido.]
    Eu caminho o mais rápido que minhas pernas deixam. A fronteira não está na minha sacola. # effect: cartas:cold
    -> ivo_menu
=== ivo_rua ===
Quase todos. Quando alguém se muda, ainda passo semanas olhando para a janela antiga.
+ [Pode adicionar esta loja ao seu mapa.]
    Já adicionei. Tem uma porta que abre e alguém que diz bom dia. É fácil lembrar. # effect: rua:warm
    -> ivo_menu
+ [Deve ser difícil decorar tantos nomes.]
    Mais fácil quando a gente conhece as pessoas, não só os números. # effect: rua:neutral
    -> ivo_menu
+ [Prefiro não receber visitas sem encomenda.]
    Não se preocupe. Vou bater só quando houver uma carta. # effect: rua:cold
    -> ivo_menu
=== ivo_cha ===
O da montanha. Minha esposa diz que eu faço forte demais. Acho que gosto de sentir que o dia acabou.
+ [Vou tentar manter sempre um pouco na prateleira.]
    Então ganhou um freguês de fim de tarde. # effect: cha:warm
    -> ivo_menu
+ [Bom saber qual produto tem saída.]
    Quem diria que meus hábitos virariam pesquisa de mercado. # effect: cha:neutral
    -> ivo_menu
+ [Chá é tudo igual.]
    Diga isso para minha esposa. Eu não tenho coragem. # effect: cha:cold
    -> ivo_menu
=== ivo_rotina ===
Uma criança me entregou uma carta sem endereço. Era para o pai, que mora longe. Prometi ajudar a descobrir para onde mandar.
+ [Foi gentil da sua parte.]
    Era só uma folha. Mas ela segurava como se fosse uma ponte. # effect: rotina:warm
    -> ivo_menu
+ [Espero que consigam encontrar o endereço.]
    Amanhã vou conversar com a avó dela. Um passo de cada vez. # effect: rotina:neutral
    -> ivo_menu
+ [Isso nem deveria ser sua responsabilidade.]
    Talvez não. Ainda assim, eu era a pessoa na frente dela. # effect: rotina:cold
    -> ivo_menu

=== ana ===
Preciso voltar à oficina logo, mas posso respirar um instante. Aqui cheira a pão; lá só a tecido e ferro quente.
-> ana_menu
=== ana_menu ===
+ [O que está costurando?] -> ana_oficina
+ [Você conserta casacos antigos?] -> ana_casaco
+ [Como estão os negócios?] -> ana_negocio
+ [O que faz nas horas livres?] -> ana_descanso
+ [Vou atender seu pedido.] -> END
=== ana_oficina ===
Uniformes da escola. As crianças crescem antes de eu terminar a barra. É uma corrida que sempre perco.
+ [Deve ser bom ver seu trabalho andando pela cidade.]
    Nunca pensei assim. Amanhã vou reparar nas mangas em vez de só nas costuras tortas. # effect: oficina:warm
    -> ana_menu
+ [Parece que trabalho não falta.]
    Falta tempo, geralmente. E uma segunda máquina que não faça tanto barulho. # effect: oficina:neutral
    -> ana_menu
+ [Você poderia cobrar mais e trabalhar menos.]
    Poderia. Mas metade das famílias já parcela os uniformes. Não é uma conta tão simples. # effect: oficina:cold
    -> ana_menu
=== ana_casaco ===
Conserto. Roupa antiga tem uma vantagem: já aprendeu a caber em quem a usa.
+ [O meu veio comigo na mudança. Gostaria de conservá-lo.]
    Traga quando puder. Cuidarei dele como de uma história emprestada. # effect: casaco:warm
    -> ana_menu
+ [Vou conferir se há algum rasgo.]
    Olhe o forro e os cotovelos. É onde o tempo costuma aparecer primeiro. # effect: casaco:neutral
    -> ana_menu
+ [Só se for muito barato.]
    Digo o preço antes de começar. Meu tempo também precisa pagar o aluguel. # effect: casaco:cold
    -> ana_menu
=== ana_negocio ===
{day < 2:Estáveis. Não é a mesma coisa que fáceis, mas aprendi a agradecer um mês previsível.|O tecido subiu. A linha também. Cada fornecedor diz que é culpa de alguém mais distante.}
+ [Podemos trocar notícias dos fornecedores.]
    Boa ideia. Quem trabalha sozinho não precisa descobrir tudo sozinho. # effect: negocio:warm
    -> ana_menu
+ [Estou acompanhando os custos no meu livro.]
    Continue. Os gastos pequenos sabem se esconder muito bem. # effect: negocio:neutral
    -> ana_menu
+ [Cada comerciante que resolva o seu problema.]
    Claro. Só pensei que uma rua podia ser mais do que portas lado a lado. # effect: negocio:cold
    -> ana_menu
=== ana_descanso ===
Tenho uma horta em vasos. Os tomates não respeitam meus horários. Talvez por isso eu goste deles.
+ [Se sobrar algum, adoraria experimentar.]
    Quando amadurecerem, trago um. Sem etiqueta de preço. # effect: descanso:warm
    -> ana_menu
+ [Nunca tive muita habilidade com plantas.]
    Comece com hortelã. Ela perdoa quase tudo. # effect: descanso:neutral
    -> ana_menu
+ [Parece mais trabalho depois do trabalho.]
    Mas este eu posso fazer descalça. Faz uma diferença enorme. # effect: descanso:cold
    -> ana_menu

=== lucas ===
Consegui sair da estação antes do apito hoje. Ainda acho estranho ter uma hora inteira que não pertence a ninguém.
-> lucas_menu
=== lucas_menu ===
+ [Está aprendendo qual ofício?] -> lucas_oficio
+ [O que faria com uma tarde livre?] -> lucas_tarde
+ [Tomas é um bom colega?] -> lucas_tomas
+ [O que acha do bairro?] -> lucas_bairro
+ [Vou separar sua compra.] -> END
=== lucas_oficio ===
Mecânica. Hoje consegui montar uma válvula sem pedir ajuda. Ninguém percebeu, mas eu fiquei orgulhoso.
+ [Eu perceberia. Parabéns pela conquista.]
    Obrigado. Parece bobo quando conto, mas era uma peça difícil. # effect: oficio:warm
    -> lucas_menu
+ [Todo começo tem dessas pequenas vitórias.]
    Você também deve ter sentido isso ao abrir a loja. # effect: oficio:neutral
    -> lucas_menu
+ [Era o mínimo esperado de um aprendiz.]
    Sim. Ainda assim, ontem eu não conseguia. # effect: oficio:cold
    -> lucas_menu
=== lucas_tarde ===
Pegaria minha bicicleta até o lago. Sem relógio. Sem alguém perguntando se já terminei.
+ [Espero que encontre essa tarde logo.]
    Talvez no domingo. Dizer em voz alta torna um plano um pouco mais possível. # effect: tarde:warm
    -> lucas_menu
+ [Parece um bom descanso.]
    Só preciso lembrar de encher os pneus antes. # effect: tarde:neutral
    -> lucas_menu
+ [Você ainda tem muito que aprender antes de descansar.]
    É o que dizem na oficina. Às vezes acho que nunca vai chegar minha vez. # effect: tarde:cold
    -> lucas_menu
=== lucas_tomas ===
É. Ele explica sem tirar a ferramenta da minha mão. Deixa eu errar quando o erro não machuca ninguém.
+ [Isso parece uma boa forma de ensinar.]
    Quero aprender a fazer o mesmo quando chegar outro aprendiz. # effect: tomas:warm
    -> lucas_menu
+ [Ele também me deu alguns conselhos.]
    Deve ter falado para não esquecer o almoço. Ele fala isso para todo mundo. # effect: tomas:neutral
    -> lucas_menu
+ [Ele fala demais.]
    Talvez. Mas eu prefiro alguém que explica a alguém que só manda. # effect: tomas:cold
    -> lucas_menu
=== lucas_bairro ===
É pequeno. Às vezes sinto que conheço o futuro inteiro. Depois abre uma loja nova e parece que ainda pode acontecer alguma coisa.
+ [Tomara que esta loja seja uma dessas coisas boas.]
    Já é. Pelo menos tem alguém novo para conversar. # effect: bairro:warm
    -> lucas_menu
+ [Ainda estou tentando encontrar meu lugar.]
    Acho que todo mundo está. Uns só disfarçam melhor. # effect: bairro:neutral
    -> lucas_menu
+ [Não espere muito. É só um comércio.]
    Tudo bem. Um comércio que vende pão já ajuda. # effect: bairro:cold
    -> lucas_menu
