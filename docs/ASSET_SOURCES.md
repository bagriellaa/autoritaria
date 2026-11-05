# Assets externos integrados ao protótipo 0.2

Pesquisa e download: 4 de novembro de 2026. Os arquivos são locais; o jogo não consulta estes serviços durante a execução. Assets de domínio público/CC0 permitem uso e redistribuição comercial, inclusive em uma futura versão Steam. A seleção foi conferida nas fontes oficiais, não apenas na licença genérica de um repositório.

## Kenney: modelos de objetos e personagens

Autor original: **Kenney**. Licença **CC0 1.0 Universal**, confirmada nas páginas oficiais de [Food Kit](https://kenney.nl/assets/food-kit), [Furniture Kit](https://kenney.nl/assets/furniture-kit) e [Blocky Characters](https://kenney.nl/assets/blocky-characters).

Repositório adquirido: [Hidencod/tge-assets](https://github.com/Hidencod/tge-assets). Ele publica conversões GLB com as texturas incorporadas dos mesmos packs Kenney e declara as conversões CC0. Revisão registrada: `ea2f2aa1ca8da0898330c97df8a5489976b051d0`. O catálogo e a licença foram lidos antes dos downloads. Apenas os modelos selecionados foram incorporados, não a biblioteca inteira.

Todos os arquivos abaixo estão em `public/assets/vendor/kenney/`:

| Grupo | Arquivos realmente baixados |
| --- | --- |
| Food Kit | `food-kit-loaf.glb`, `food-kit-carton.glb`, `food-kit-can.glb`, `food-kit-bag.glb`, `food-kit-apple.glb`, `food-kit-pear.glb`, `food-kit-carrot.glb`, `food-kit-bottle-oil.glb`, `food-kit-honey.glb`, `food-kit-barrel.glb`, `food-kit-mug.glb` |
| Furniture Kit | `furniture-kit-chair.glb`, `furniture-kit-kitchenfridge.glb`, `furniture-kit-plantsmall1.glb`, `furniture-kit-radio.glb`, `furniture-kit-televisionvintage.glb` |
| Blocky Characters | `blocky-characters-character-a.glb`, `blocky-characters-character-e.glb`, `blocky-characters-character-f.glb`, `blocky-characters-character-i.glb`, `blocky-characters-character-k.glb`, `blocky-characters-character-q.glb` |

As miniaturas foram inspecionadas para excluir astronautas, robôs, piratas e monstros. As variantes selecionadas representam roupas casuais, uniforme médico e terno simples. O pacote tem apenas duas mulheres com roupas cotidianas; uma delas é a base da adaptação de Mira, sem representar um modelo exclusivo de mulher idosa. Personagens continuam estilizados e blocados, uma opção coerente para um protótipo low-poly.

Os GLBs de personagens têm 27 animações, incluindo `idle`, `walk`, `sit`, `emote-yes`, `emote-no`, `interact-right` e `interact-left`. Não têm skin/skeleton deformável: usam animações dos nós da hierarquia. A altura de referência é 2,7 unidades, chão em Y=0. Normalizar para aproximadamente 1,7 m. Geometria e atlas estão incorporados, sem imagens externas.

Meshes dos personagens: `head`, `torso`, `arm-left`, `arm-right`, `leg-left`, `leg-right`. Cabelo e pele compartilham o atlas da cabeça. O material original é unlit; a integração pode convertê-lo para material iluminado preservando o mapa. Uma adaptação de cores feita no material não modifica o PNG original.

Metadados medidos: `public/assets/vendor/model-metadata.json`. Script reproduzível: `scripts/audit-vendor.mjs`. Esta medição usa bounds dos accessors transformados pela hierarquia, não estima dimensões por miniatura.

## Poly Haven: materiais

Licença dos assets: [CC0, conforme a página oficial](https://polyhaven.com/license). Foram baixados somente os mapas de cor difusa de 1K, não previews de autoria alheia nem conteúdo de página. Os mapas serão filtrados pelo renderer para preservar a direção PSX.

| Arquivo local | Asset original e autoria | Download original |
| --- | --- | --- |
| `public/assets/vendor/textures/wood.jpg` | [Wood Table 001](https://polyhaven.com/a/wood_table_001), Dimitrios Savva e Rico Cilliers | [JPG 1K](https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/wood_table_001/wood_table_001_diff_1k.jpg) |
| `public/assets/vendor/textures/plaster.jpg` | [Plastered Wall 02](https://polyhaven.com/a/plastered_wall_02), Charlotte Baglioni | [JPG 1K](https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/plastered_wall_02/plastered_wall_02_diff_1k.jpg) |
| `public/assets/vendor/textures/tiles.jpg` | [Floor Tiles 06](https://polyhaven.com/a/floor_tiles_06), Rob Tuytel | [JPG 1K](https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/floor_tiles_06/floor_tiles_06_diff_1k.jpg) |

Os nomes e dimensões reais, hashes SHA-256 e caminhos estão em `public/assets/vendor/asset-manifest.json`. Texturas juntas ocupam aproximadamente 1 MB; os modelos escolhidos, cerca de 1,1 MB.

## Licenças preservadas

`public/assets/vendor/licenses/kenney-cc0.txt` contém a declaração de licença do repositório de conversões; `model-library-readme.md` registra sua proveniência; `CC0-1.0.txt` contém a licença completa. A atribuição não é exigida pela CC0, mas os autores são creditados nesta documentação e nos créditos do jogo.

## Alternativas analisadas

[Quaternius Animated Women](https://quaternius.com/packs/animatedwomen.html) e [Animated Men](https://quaternius.com/packs/animatedmen.html) declaram CC0 e são alternativas futuras de anatomia menos blocada. Não foram importados: este recorte priorizou GLBs animados autocontidos, pequenos e imediatamente compatíveis. Não se atribui a esses modelos uma licença genérica de versões futuras de Quaternius.
