/* ==========================================================================
   Portifólio — Eduarda Amaral
   Curadoria de imagens e ordem editorial conforme vistoria de 14/08/2026.
   ========================================================================== */

window.PORTFOLIO = {
  brand: {
    name: "Eduarda Amaral",
    role: "Arquiteta & Artista 3D",
    statement:
      "A primeira imagem de projetos que ainda não existem — da casa íntima ao edifício urbano."
  },

  projects: [
    {
      id: "casa-de-vidro",
      note: "Três imagens bastam. Pilotis, escada externa, luz quente — o estudo da casa de Lina Bo Bardi abre a seleção.",
      title: "Casa de Vidro",
      subtitle: "Lina Bo Bardi",
      order: 1,
      layout: "opener",
      section: "main",
      tags: ["Estudo", "Exterior", "Atmosférico"],
      description:
        "Caixa envidraçada no meio da mata. Luz quente vinda de dentro.",
      architecture: "Lina Bo Bardi",
      visualization: "Eduarda Amaral",
      tools: ["SketchUp", "D5 Render"],
      behance: "https://www.behance.net/gallery/243216133/CASA-DE-VIDRO-LINA-BO-BARDI",
      hero: {
        desktop: { index: 1, ratio: "3 / 4", module: "1403157771", focus: "54% 47%", intrinsicSize: [1650, 2200], src: "assets/casa-de-vidro/1403157771.jpg" },
        mobile: { index: 1, ratio: "3 / 4", module: "1403157771", note: "corte deslocado para a escada", src: "assets/casa-de-vidro/1403157771.jpg" }
      },
      gallery: [
        { index: 1, ratio: "3 / 4", module: "1403157771", src: "assets/casa-de-vidro/1403157771.jpg" },
        { index: 3, ratio: "3 / 4", module: "1403157775", src: "assets/casa-de-vidro/1403157775.jpg" },
        { index: 2, ratio: "3 / 4", module: "1403157773", src: "assets/casa-de-vidro/1403157773.jpg" }
      ]
    },

    {
      id: "apt-008",
      note: "Interior em 4:5. A mesa de jantar decide o corte; a luz alaranjada decide a hora do dia. Este caso responde por interiores.",
      title: "APT 008",
      subtitle: "Interior residencial",
      order: 2,
      layout: "editorial",
      section: "main",
      tags: ["Interior", "Luz", "Cor"],
      description:
        "Palhinha e madeira no fim de tarde.",
      architecture: null,
      visualization: "Eduarda Amaral",
      tools: [],
      behance: "https://www.behance.net/gallery/222960975/APT-008",
      hero: {
        desktop: { index: 1, ratio: "4 / 5", module: "1273049755", intrinsicSize: [1080, 1350], src: "assets/apt-008/1273049755.jpg" },
        mobile: { index: 1, ratio: "4 / 5", module: "1273049755", src: "assets/apt-008/1273049755.jpg" }
      },
      gallery: [
        { index: 1, ratio: "4 / 5", module: "1273049755", src: "assets/apt-008/1273049755.jpg" },
        { index: 2, ratio: "4 / 5", module: "1273049753", src: "assets/apt-008/1273049753.jpg" },
        { index: 3, ratio: "4 / 5", module: "1273049757", src: "assets/apt-008/1273049757.jpg" }
      ]
    },

    {
      id: "kaiserharten",
      note: "Vertical para um prédio escalonado. Varandas ajardinadas, interiores quentes — e a cidade inteira ao fundo. Publicado com o selo OF3D.",
      title: "Kaiserharten",
      subtitle: "Bluehour — OF3D",
      order: 3,
      layout: "vertical",
      section: "main",
      tags: ["Edifício", "Hora azul", "Internacional"],
      description:
        "Um edifício residencial sob a hora azul.",
      architecture: null,
      visualization: "Eduarda Amaral",
      tools: ["Photoshop", "3ds Max", "Corona Renderer"],
      behance: "https://www.behance.net/gallery/206226511/KAISERHARTEN-BLUEHOUR-OF3D",
      hero: {
        desktop: { index: 1, ratio: "4 / 5", module: "1170877123", focus: "55% 55%", intrinsicSize: [1760, 2200], src: "assets/kaiserharten/1170877123.jpeg" },
        mobile: { index: 1, ratio: "4 / 5", module: "1170877123", src: "assets/kaiserharten/1170877123.jpeg" }
      },
      gallery: [
        { index: 1, ratio: "4 / 5", module: "1170877123", src: "assets/kaiserharten/1170877123.jpeg" },
        { index: 3, ratio: "4 / 5", module: "1170877119", src: "assets/kaiserharten/1170877119.jpeg" },
        { index: 2, ratio: "4 / 5", module: "1170877117", src: "assets/kaiserharten/1170877117.jpeg" }
      ]
    },

    {
      id: "casa-borogodo",
      note: "A sombra do cobogó desenha a tarde na fachada.",
      title: "Casa Borogodó",
      subtitle: "Residência tropical",
      order: 4,
      layout: "full",
      section: "main",
      tags: ["Residencial", "Tropical", "Cobogó"],
      description:
        "Terracota e cobogó — a fachada abre, o arco fecha.",
      architecture: null,
      visualization: "Eduarda Amaral",
      tools: ["Photoshop", "3ds Max", "D5 Render"],
      behance: "https://www.behance.net/gallery/243215589/CASA-BOROGODO",
      hero: {
        desktop: { index: 3, ratio: "16 / 9", module: "1403155961", focus: "50% 52%", intrinsicSize: [1651, 2200], src: "assets/casa-borogodo/1403155961.jpg" },
        mobile: { index: 3, ratio: "4 / 5", module: "1403155961", src: "assets/casa-borogodo/1403155961.jpg" }
      },
      gallery: [
        { index: 3, ratio: "3 / 4", module: "1403155961", src: "assets/casa-borogodo/1403155961.jpg" },
        { index: 1, ratio: "3 / 4", module: "1403155959", src: "assets/casa-borogodo/1403155959.jpg" },
        { index: 2, ratio: "3 / 4", module: "1403155963", src: "assets/casa-borogodo/1403155963.jpg" }
      ]
    },

    {
      id: "house-of-sand",
      note: "A piscina em primeiro plano, o pátio ao fundo — e uma pessoa na beirada para dar a escala. Publicado com o selo OF3D.",
      title: "House of Sand",
      subtitle: "OF3D",
      order: 5,
      layout: "full-alt",
      section: "main",
      tags: ["Residencial", "Água", "Piscina"],
      description:
        "Piscina turquesa contra o pátio. A pessoa na beirada dá a escala.",
      architecture: null,
      visualization: "Eduarda Amaral",
      tools: ["Photoshop", "3ds Max", "Corona Renderer"],
      behance: "https://www.behance.net/gallery/206226655/HOUSE-OF-SAND-OF3D",
      hero: {
        desktop: { index: 2, ratio: "16 / 9", module: "1170878081", focus: "50% 68%", intrinsicSize: [1760, 2200], src: "assets/house-of-sand/1170878081.jpeg" },
        mobile: { index: 2, ratio: "4 / 5", module: "1170878081", src: "assets/house-of-sand/1170878081.jpeg" }
      },
      gallery: [
        { index: 2, ratio: "4 / 5", module: "1170878081", src: "assets/house-of-sand/1170878081.jpeg" },
        { index: 1, ratio: "4 / 5", module: "1170878077", src: "assets/house-of-sand/1170878077.jpeg" },
        { index: 3, ratio: "4 / 5", module: "1170878079", src: "assets/house-of-sand/1170878079.jpeg" }
      ]
    },

    {
      id: "casa-pina",
      note: "O caso mais técnico da seleção. Fachada, axonométrica explodida e planta humanizada — o sistema construtivo explicado em três desenhos.",
      title: "Casa Pina",
      subtitle: "Método Growarq",
      order: 6,
      layout: "split",
      section: "main",
      tags: ["Residencial", "Materialidade", "Técnica"],
      description:
        "Brises e concreto. A obra aberta em peças.",
      architecture: null,
      visualization: "Eduarda Amaral",
      tools: ["Autodesk Revit", "Lumion 12"],
      behance: "https://www.behance.net/gallery/197587835/CASA-PINA",
      hero: {
        desktop: { index: 6, ratio: "16 / 9", module: "1119257257", focus: "50% 56%", intrinsicSize: [1920, 1920], src: "assets/casa-pina/1119257257.jpg" },
        mobile: { index: 4, ratio: "4 / 5", module: "1119257253", focus: "50% 52%", src: "assets/casa-pina/1119257253.jpg" }
      },
      gallery: [
        { index: 6, ratio: "16 / 9", module: "1119257257", src: "assets/casa-pina/1119257257.jpg" },
        { index: 4, ratio: "4 / 5", module: "1119257253", src: "assets/casa-pina/1119257253.jpg" },
        { index: 5, ratio: "16 / 9", module: "1119257249", src: "assets/casa-pina/1119257249.jpg" },
        { index: 2, ratio: "4 / 3", module: "1119257247", contain: true, caption: "Axonométrica explodida", src: "assets/casa-pina/1119257247.jpg" },
        { index: 3, ratio: "4 / 3", module: "1119257251", contain: true, caption: "Planta humanizada", src: "assets/casa-pina/1119257251.jpg" }
      ]
    },

    {
      id: "casa-do-lago",
      note: "Edição curta de propósito: duas imagens. A cabana contra a montanha, o pescador no lago — e a sequência termina aí.",
      title: "Casa do Lago",
      subtitle: "Cabana contemplativa",
      order: 7,
      layout: "full-close",
      section: "main",
      tags: ["Residencial", "Paisagem", "Cinematográfico"],
      description:
        "A cabana no sopé da montanha. Fogo aceso, lago ao fim.",
      architecture: null,
      visualization: "Eduarda Amaral",
      tools: [],
      behance: "https://www.behance.net/gallery/222960361/Casa-do-Lago",
      hero: {
        desktop: { index: 4, ratio: "16 / 9", module: "1273046027", focus: "50% 56%", intrinsicSize: [1467, 2200], src: "assets/casa-do-lago/1273046027.jpg" },
        mobile: { index: 3, ratio: "4 / 5", module: "1273046029", src: "assets/casa-do-lago/1273046029.jpeg" }
      },
      gallery: [
        { index: 4, ratio: "16 / 9", module: "1273046027", src: "assets/casa-do-lago/1273046027.jpg" },
        { index: 3, ratio: "4 / 5", module: "1273046029", src: "assets/casa-do-lago/1273046029.jpeg" }
      ]
    },

    {
      id: "tini-pavilion",
      note: "Estudo fora da sequência: o Mercedes no primeiro plano, o pavilhão ao fundo. Automotivo que lê como arquitetura.",
      title: "Tini Pavilion",
      subtitle: "Estudos / Automotivo",
      order: 8,
      layout: "studies",
      section: "studies",
      tags: ["Estudo", "Automotivo", "Versatilidade"],
      description:
        "Garagem oxidada entre as árvores.",
      architecture: null,
      visualization: "Eduarda Amaral",
      tools: [],
      behance: "https://www.behance.net/gallery/222960877/TINI-PAVILION",
      hero: {
        desktop: { index: 2, ratio: "4 / 5", module: "1273049027", src: "assets/tini-pavilion/1273049027.jpg" },
        mobile: { index: 2, ratio: "4 / 5", module: "1273049027", src: "assets/tini-pavilion/1273049027.jpg" }
      },
      gallery: [
        { index: 2, ratio: "4 / 5", module: "1273049027", src: "assets/tini-pavilion/1273049027.jpg" },
        { index: 1, ratio: "4 / 5", module: "1273049025", src: "assets/tini-pavilion/1273049025.jpg" },
        { index: 4, ratio: "4 / 5", module: "1273049021", src: "assets/tini-pavilion/1273049021.jpg" }
      ]
    }
  ]
};
