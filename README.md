# Portfólio — Eduarda Amaral

Site estático, sem dependências externas, construído a partir da vistoria visual
de 14/08/2026 sobre o Behance [eduardaamaral8](https://www.behance.net/eduardaamaral8).

Direção: **“caderno de prova”** — papel, tinta, óxido e hora-azul. Animação com
GSAP + ScrollTrigger; tipografia Fraunces + Spline Sans + Spline Sans Mono.

## Abrir

Abra `index.html` no navegador — nada é baixado, tudo é local (fontes, GSAP, imagens).

```powershell
python -m http.server 8123
```

## Estrutura

- `index.html` — estrutura e textos (curadoria, serviços, processo, contato reais).
- `styles.css` — sistema visual: molduras de prova, grades assimétricas, faixas escuras.
- `projects.js` — curadoria: ordem, textos, notas curatoriais, créditos, slots de imagem.
- `app.js` — renderização dos cartões e fichas + animações GSAP/ScrollTrigger.
- `fonts.css` + `fonts/` — fontes self-hosted (woff2, subconjunto latin).
- `vendor/` — `gsap.min.js` e `ScrollTrigger.min.js` locais.
- `assets/` — imagens dos módulos Behance, comprimidas (JPEG q84, máx. 2200px).

## Regras editoriais implementadas

- **Sete projetos na home**, na ordem da vistoria; Tini Pavilion em Studies.
- **Uma imagem por entrada** — a ficha completa abre em diálogo.
- **Art direction por dispositivo** — Casa do Lago troca 4→3 no mobile; Casa Pina troca 6→4 (via `picture`).
- **Créditos separados** — Arquitetura e Visualização são campos distintos.
- **Datas honestas** — datas do Behance não são exibidas como ano de projeto.
- **Diagramas técnicos em `contain`** — axonométrica e planta nunca são cortadas.
- **Sem slop** — sem “excelência”, “sonhos” ou promessas; fatos, ferramentas e números verificáveis.
- **Legendas para o visitante** — na home, ferramentas e proporção; números de módulo do Behance aparecem só na ficha.

## Animações

A capa e suas ações aparecem desde a abertura. GSAP/ScrollTrigger controlam a
revelação dos cartões, o parallax sutil
nas imagens, régua do processo, contadores, ticker de ferramentas e barra de progresso.
`prefers-reduced-motion` desliga tudo.

## Manutenção de imagens

Cada entrada em `projects.js` referencia um módulo Behance por ID. Para trocar uma
imagem, exporte o módulo e salve em `assets/<projeto>/<módulo>.jpg` — a proporção
(`ratio`), o foco (`focus`) e o corte são declarados nos dados, não no CSS.
