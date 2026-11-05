export const WORLD = { title: 'Autoritária', subtitle: 'uma vida do outro lado', origin: 'Véspera', country: 'Ardênia', town: 'Vale Sereno', currency: 'coroas', symbol: 'C$', year: 1986 };
export const PRODUCTS = {
  bread: { name: 'Pão de centeio', short: 'Pão', category: 'Padaria', cost: 120, price: 250, color: 0xb97a3d, shape: 'bread' },
  milk: { name: 'Leite integral', short: 'Leite', category: 'Laticínios', cost: 190, price: 360, color: 0xe8dfbf, shape: 'bottle' },
  tin: { name: 'Feijão em conserva', short: 'Feijão', category: 'Conservas', cost: 230, price: 420, color: 0xa64432, shape: 'can' },
  tea: { name: 'Chá da montanha', short: 'Chá', category: 'Mercearia', cost: 280, price: 510, color: 0x58735d, shape: 'box' }
} as const;
export type ProductId = keyof typeof PRODUCTS;
export const PRODUCT_IDS = Object.keys(PRODUCTS) as ProductId[];
export const PEOPLE = {
  mira: { name: 'Dona Mira', role: 'Sua vizinha', color: 0x75734a, hair: 0xc5c0ac, skin: 0xcf9e7e, personality: 'Gentil, atenta. Conhece cada janela desta rua.' },
  tomas: { name: 'Tomas', role: 'Trabalhador da estação', color: 0x52677b, hair: 0x48352a, skin: 0xb98b68, personality: 'Prático e bem-humorado. Sempre tem uma notícia.' },
  elena: { name: 'Elena', role: 'Moradora de Vale Sereno', color: 0xa4563d, hair: 0x442d23, skin: 0xd6a27d, personality: 'Curiosa, comunicativa. Coleciona histórias de viagem.' },
  ivo: { name: 'Ivo', role: 'Carteiro', color: 0x465e55, hair: 0x49372b, skin: 0xb38467, personality: 'Gosta de chá e de conversar sobre o tempo.' },
  ana: { name: 'Ana', role: 'Costureira', color: 0x8b696e, hair: 0x544434, skin: 0xd1aa89, personality: 'Faz as compras antes de abrir a oficina.' },
  lucas: { name: 'Lucas', role: 'Aprendiz', color: 0x94724b, hair: 0x846344, skin: 0xd7ac85, personality: 'Está sempre com pressa para o próximo turno.' }
} as const;
export type PersonId = keyof typeof PEOPLE;
export const HEADLINES = [
  { title: 'Um pequeno comércio abre as portas', text: 'O bairro da estação recebe uma nova mercearia. A feira de outono será no domingo, na praça. Em nota breve, a chancelaria acompanha as negociações no país vizinho.' },
  { title: 'Atrasos na fronteira afetam entregas', text: 'Os controles em Véspera atrasam os trens de carga. Fornecedores anunciam reajustes. Aqui, as escolas e os mercados seguem abertos. Ainda há tempo para uma solução diplomática.' },
  { title: 'Prefeitura estabelece cartão de abastecimento', text: 'A partir de hoje, a venda de pão exige cartão válido de Ardênia, com nome correspondente ao comprador. Limite de uma unidade por pessoa por dia. Irregularidades podem gerar multa de C$ 8,00 por ocorrência.' }
];
const lines = [
  ['Naquele ano, as ruas começaram a mudar.', 'Soldados, caminhões militares, notícias no rádio... Todos falavam de uma guerra que ainda não havia começado.', 'E, mesmo assim, a vida continuava. Como se ninguém soubesse o que estava por vir.'],
  ['Mas havia algo que me assustava muito mais do que qualquer guerra.', 'Minha mãe estava morrendo.', 'Ela era a última pessoa que eu ainda podia chamar de família.'],
  ['Quando ela se foi, a casa ficou silenciosa.', 'Durante dias, continuei esperando ouvir seus passos no corredor.'],
  ['Minha mãe havia deixado uma herança. Mais dinheiro do que eu imaginava possuir um dia.', 'Mas, de repente, não havia mais ninguém com quem compartilhar aquilo.'],
  ['Eu não conseguia mais ficar.', 'Meu país parecia caminhar para uma guerra. E tudo que me prendia àquela casa havia desaparecido.', 'Então fiz as malas.'],
  ['Despedi-me dos poucos vizinhos que conhecia.', 'Prometi escrever quando chegasse.', 'Não prometi voltar.'],
  ['Escolhi um país próximo. Falávamos a mesma língua. Tínhamos costumes parecidos.', 'E, acima de tudo, lá não havia ameaça de guerra.', 'Talvez eu pudesse encontrar um lugar para chamar de lar.'],
  ['A cidade era pequena. As pessoas pareciam tranquilas.', 'Aluguei uma casa simples. Não era muito, mas era minha.', 'Pela primeira vez em meses, consegui imaginar um futuro.'],
  ['Com o dinheiro que havia recebido, aluguei um pequeno estabelecimento.', 'Comprei mercadorias, organizei as prateleiras e preparei tudo para abrir.', 'Não sabia se conseguiria fazer aquilo dar certo.', 'Mas queria tentar.']
];
const titles = ['Um país à beira do abismo', 'A última família', 'O silêncio', 'A herança', 'A decisão', 'Despedidas', 'A viagem', 'Um novo lar', 'O primeiro dia'];
export const PROLOGUE = lines.map((texts, i) => ({
  id: `scene_${String(i + 1).padStart(2, '0')}`, title: titles[i], texts,
  variants: [0, 2, 3].includes(i) ? ['neutral'] : ['female', 'male'],
  sound: ['wind', 'clock', 'clock', 'paper', 'wind', 'birds', 'train', 'birds', 'bell'][i],
  music: i < 6 ? 'memory' : 'hope', transition: i === 1 || i === 8 ? 'fade' : 'dissolve',
  duration: 1100, movement: { zoom: 1.035, x: i % 2 ? -0.5 : 0.5 }, next: i < 8 ? i + 1 : null
}));
export function sceneImage(i: number, gender: 'female' | 'male') { const s = PROLOGUE[i]; return `assets/cutscenes/${s.id}_${s.variants.length === 1 ? 'neutral' : gender}.png`; }
