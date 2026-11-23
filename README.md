# Portfólio — Eduarda Amaral

Site estático, sem dependências externas, construído a partir da vistoria visual
de 14/08/2026 sobre o Behance [eduardaamaral8](https://www.behance.net/eduardaamaral8).

O site usa o template Sillage da 8B, no mesmo build CSS/JavaScript
da demonstração da 21st.dev. O código do template está sob licença MIT
em `LICENSE-SILLAGE`. As imagens são do portfólio de Eduarda Amaral,
com créditos de arquitetura e visualização em cada ficha.

## Abrir

```sh
python -m http.server 8123
```

## Arquivos ativos

- `index.html` contém o HTML, os estilos e as cenas originais do Sillage,
  adaptados ao conteúdo do portfólio.
- `projects.js` mantém a curadoria, imagens e créditos das fichas.
- `fichas.js` e `fichas.css` integram as fichas ao grid e ao destaque da Casa Pina.
- `srcset.js` registra os arquivos WebP da galeria.
- Mozilla Headline e Instrument Sans usam o Google Fonts conforme o template original.

As cenas vinculadas à rolagem usam os recursos nativos do navegador.
Com movimento reduzido ou sem suporte a esses recursos, a composição
permanece disponível em modo estático.

## Manutenção de imagens

Cada entrada em `projects.js` referencia um módulo Behance por ID. Para trocar uma
imagem, exporte o módulo e salve em `assets/<projeto>/<módulo>.jpg` — a proporção
(`ratio`), o foco (`focus`) e o corte são declarados nos dados, não no CSS.
