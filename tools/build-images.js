/* ==========================================================================
   Gera as variantes WebP responsivas de assets/ e reescreve srcset.js.

   Rodar depois de adicionar ou trocar qualquer imagem:
       node tools/build-images.js

   Os JPG originais ficam intactos — são o fallback do <picture>.
   ========================================================================== */

let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  /* Sem sharp instalado no projeto, usa o que já existe no runtime local. */
  sharp = require('C:/Users/juana/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
}

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ASSETS = path.join(ROOT, 'assets');

/* Degraus escolhidos pelos tamanhos reais de exibição:
   640 (card mobile 1x) · 800 (card desktop 46vw) · 1024 (mobile 2x)
   1600 (card desktop 2x / ficha em tela grande) */
const WIDTHS = [640, 800, 1024, 1600];
const QUALITY = 78;

(async () => {
  const manifest = {};
  let origTotal = 0;
  let novoTotal = 0;

  const dirs = fs.readdirSync(ASSETS).filter(function (d) {
    return fs.statSync(path.join(ASSETS, d)).isDirectory();
  });

  for (const dir of dirs) {
    const dirPath = path.join(ASSETS, dir);
    const files = fs.readdirSync(dirPath).filter(function (f) { return /\.jpe?g$/i.test(f); });

    for (const file of files) {
      const abs = path.join(dirPath, file);
      const rel = 'assets/' + dir + '/' + file;      // caminho como aparece em projects.js
      const base = file.replace(/\.jpe?g$/i, '');
      const meta = await sharp(abs).metadata();
      origTotal += fs.statSync(abs).size;

      const widths = [];
      for (const w of WIDTHS) {
        if (w > meta.width) continue;                 // nunca ampliar
        const out = path.join(dirPath, base + '-' + w + '.webp');
        await sharp(abs)
          .resize({ width: w, withoutEnlargement: true })
          .webp({ quality: QUALITY, effort: 6 })
          .toFile(out);
        widths.push(w);
        novoTotal += fs.statSync(out).size;
      }

      /* Original menor que o primeiro degrau: gera na largura nativa. */
      if (!widths.length) {
        const out = path.join(dirPath, base + '-' + meta.width + '.webp');
        await sharp(abs).webp({ quality: QUALITY, effort: 6 }).toFile(out);
        widths.push(meta.width);
        novoTotal += fs.statSync(out).size;
      }

      manifest[rel] = widths;
      console.log(rel.padEnd(44) + meta.width + 'px -> ' + widths.join(', '));
    }
  }

  const js =
    '/* GERADO AUTOMATICAMENTE por tools/build-images.js — não editar à mão.\n' +
    '   Larguras WebP disponíveis por imagem; app.js monta o srcset a partir daqui. */\n' +
    'window.PORTFOLIO_SRCSET = ' + JSON.stringify(manifest, null, 2) + ';\n';
  fs.writeFileSync(path.join(ROOT, 'srcset.js'), js, 'utf8');

  console.log('\n--- resumo ---');
  console.log('originais (fallback): ' + (origTotal / 1048576).toFixed(2) + ' MB');
  console.log('webp geradas:         ' + (novoTotal / 1048576).toFixed(2) + ' MB');
  console.log('imagens no manifesto: ' + Object.keys(manifest).length);
  console.log('srcset.js reescrito.');
})().catch(function (e) { console.error('FALHOU', e); process.exit(1); });
