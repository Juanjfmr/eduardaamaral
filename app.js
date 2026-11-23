/* ==========================================================================
   Eduarda Amaral — Archviz
   Renderização das fichas + animações GSAP/ScrollTrigger.
   ========================================================================== */

(function () {
  "use strict";

  const data = window.PORTFOLIO;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  let lastCaseTrigger = null;
  let lastOriginEl = null;

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function cineEase(p) {
    const e = 1 - Math.pow(1 - p, 4);
    return e + (p > 0.55 ? Math.sin(((p - 0.55) / 0.45) * Math.PI) * 0.018 : 0);
  }

  function splitWords(el) {
    function walk(node) {
      if (node.nodeType === 3) {
        const parts = String(node.textContent).split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
            return;
          }
          const w = document.createElement("span");
          w.className = "w";
          const inner = document.createElement("span");
          inner.className = "w__in";
          inner.textContent = part;
          w.appendChild(inner);
          frag.appendChild(w);
        });
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === 1 && node.className !== "w" && node.className !== "c") {
        Array.from(node.childNodes).forEach(walk);
      }
    }
    walk(el);
  }

  function creditLine(p) {
    if (p.architecture) return "Arquitetura — " + p.architecture + " · Visualização — " + p.visualization;
    return "Visualização — " + p.visualization;
  }

  /* ------------------------------ Mídia ------------------------------- */

  /* Larguras WebP disponíveis por imagem (srcset.js, gerado no build).
     Sem o manifesto, tudo cai de volta para o JPG original. */
  function srcsetFor(src) {
    const widths = (window.PORTFOLIO_SRCSET || {})[src];
    if (!widths || !widths.length) return "";
    const base = src.replace(/\.(jpe?g)$/i, "");
    return widths.map(function (w) { return base + "-" + w + ".webp " + w + "w"; }).join(", ");
  }

  /* Menor variante disponível — para as miniaturas do cursor. */
  function thumbFor(src) {
    const widths = (window.PORTFOLIO_SRCSET || {})[src];
    if (!widths || !widths.length) return src;
    return src.replace(/\.(jpe?g)$/i, "") + "-" + widths[0] + ".webp";
  }

  function pictureMarkup(src, alt, sizes, eager, dimensions) {
    const loading = eager ? ' fetchpriority="high"' : ' loading="lazy"';
    const size = dimensions ? ' width="' + dimensions[0] + '" height="' + dimensions[1] + '"' : "";
    const img = '<img src="' + esc(src) + '" alt="' + esc(alt) + '" decoding="async"' + loading + size + " />";
    const set = srcsetFor(src);
    if (!set) return img;
    return (
      "<picture>" +
        '<source type="image/webp" srcset="' + esc(set) + '" sizes="' + esc(sizes) + '" />' +
        img +
      "</picture>"
    );
  }

  function mediaMarkup(item, alt, eager) {
    const ratio = item.ratio || "4 / 5";
    const focus = item.focus ? " style=\"--focus: " + esc(item.focus) + ";\"" : "";
    return (
      '<span class="frame__img" style="--ratio: ' + esc(ratio) + ';"' + focus + ">" +
        pictureMarkup(item.src, alt, "(max-width: 900px) 92vw, 40vw", eager) +
      "</span>"
    );
  }

  function heroMediaMarkup(p) {
    const d = p.hero.desktop;
    const m = p.hero.mobile;
    const alt = p.title + (p.subtitle ? " — " + p.subtitle : "") + ", visualização arquitetônica de Eduarda Amaral.";
    const desktopImg = '<img src="' + esc(d.src) + '" alt="' + esc(alt) + '" decoding="async" loading="lazy" />';
    const desktopRatio = d.ratio || "4 / 5";
    const mobileRatio = m && m.ratio ? m.ratio : desktopRatio;
    const heroStyle = "--ratio: " + esc(desktopRatio) + "; --ratio-m: " + esc(mobileRatio) +
      (d.focus ? "; --focus: " + esc(d.focus) : "") +
      (m && m.focus ? "; --focus-m: " + esc(m.focus) : "") + ";";

    const cardSizes = "(max-width: 760px) 100vw, 46vw";
    const desktopSet = srcsetFor(d.src);
    const desktopSource = desktopSet
      ? '<source type="image/webp" srcset="' + esc(desktopSet) + '" sizes="' + cardSizes + '" />'
      : "";

    if (m && m.src && m.src !== d.src) {
      const mobileSet = srcsetFor(m.src);
      return (
        '<span class="frame__img" style="' + heroStyle + '">' +
          "<picture>" +
            (mobileSet
              ? '<source type="image/webp" media="(max-width: 760px)" srcset="' + esc(mobileSet) + '" sizes="100vw" />'
              : "") +
            '<source media="(max-width: 760px)" srcset="' + esc(m.src) + '" />' +
            desktopSource +
            desktopImg +
          "</picture>" +
        "</span>"
      );
    }
    return (
      '<span class="frame__img" style="' + heroStyle + '">' +
        (desktopSource ? "<picture>" + desktopSource + desktopImg + "</picture>" : desktopImg) +
      "</span>"
    );
  }

  /* ------------------------------ Cartões ----------------------------- */

  function projectCard(p) {
    const hero = p.hero.desktop;
    const caption = p.layout === "opener"
      ? "Vista exterior"
      : "Fig. " + pad(p.order) + " — " + (p.tools && p.tools.length ? p.tools.join(" · ") : (p.subtitle || "Seleção 2026"));
    const ratio = p.layout === "opener" ? "" : "<span>" + esc(hero.ratio || "4 / 5") + "</span>";
    const subtitle = p.subtitle && p.layout !== "opener" ? '<p class="card__sub">' + esc(p.subtitle) + '</p>' : "";
    return (
      '<article class="card card--' + esc(p.layout) + '">' +
        '<figure class="card__media">' +
          '<span class="card__frame frame">' + heroMediaMarkup(p) + "</span>" +
          '<figcaption class="card__caption"><span>' + esc(caption) + "</span>" + ratio + "</figcaption>" +
        "</figure>" +
        '<div class="card__meta">' +
          '<p class="card__index mono">N.º ' + pad(p.order) + "</p>" +
          '<h3 class="card__title">' + esc(p.title) + "</h3>" +
          subtitle +
          '<p class="card__desc">' + esc(p.description) + "</p>" +
          '<p class="card__credit">' + esc(creditLine(p)) + "</p>" +
          '<button class="card__open" type="button" data-open-case="' + esc(p.id) + '">Ver ficha <span aria-hidden="true">↗</span></button>' +
        "</div>" +
      "</article>"
    );
  }

  /* --------------------------- Sequência ------------------------------ */

  function projectSequence() {
    const main = data.projects
      .filter(function (p) { return p.section === "main"; })
      .sort(function (a, b) { return a.order - b.order; });
    const studies = data.projects.filter(function (p) { return p.section === "studies"; });
    return main.concat(studies);
  }

  function nextProject(p) {
    const seq = projectSequence();
    const i = seq.findIndex(function (x) { return x.id === p.id; });
    if (i < 0) return null;
    return seq[(i + 1) % seq.length];
  }

  function nextCaseNav(p) {
    const next = nextProject(p);
    if (!next) return "";
    const label = next.section === "studies" ? "Próximo estudo" : "Próximo projeto";
    return (
      '<nav class="case__next">' +
        '<span class="case__next-label">' + label + "</span>" +
        '<button class="case__next-link" type="button" data-open-case="' + esc(next.id) + '">' +
          '<span class="case__next-title">' + esc(next.title) + "</span>" +
          '<span class="case__next-arrow" aria-hidden="true">→</span>' +
        "</button>" +
      "</nav>"
    );
  }

  function indexRow(p) {
    const previewSrc = thumbFor(p.hero.desktop.src);
    const previewRatio = p.hero.desktop.ratio || "4 / 5";
    return (
      '<li class="index__row">' +
        '<button class="index__link" type="button" data-open-case="' + esc(p.id) + '" data-preview="' + esc(previewSrc) + '" data-ratio="' + esc(previewRatio) + '">' +
          '<span class="index__num mono">' + pad(p.order) + "</span>" +
          '<span class="index__title">' + esc(p.title) + "</span>" +
          '<span class="index__sub">' + esc(p.subtitle || (p.section === "studies" ? "Estudo" : "Projeto")) + "</span>" +
          '<span class="index__arrow" aria-hidden="true">↗</span>' +
        "</button>" +
      "</li>"
    );
  }

  /* ------------------------------ Ficha ------------------------------- */

  function galleryItemMarkup(g, index) {
    const caption = (g.caption || "Imagem " + g.index) + (g.module ? " · módulo " + g.module : "");
    const isCover = index === 0;
    const media = mediaMarkup(g, g.plate ? g.caption + " da Casa Pina" : "Imagem do projeto — " + caption, isCover);
    const classes = ["case__figure"];
    if (isCover) classes.push("case__figure--cover", "is-in");
    if (g.contain) classes.push("case__figure--contain");
    if (g.plate) classes.push("case__figure--plate");
    const captionMarkup = g.plate
      ? '<figcaption class="case__plate-caption"><span>Prancha ' + pad(index + 1) + '</span><strong>' + esc(g.caption) + '</strong></figcaption>'
      : "<figcaption><span>" + esc(caption) + "</span><span>" + esc(g.ratio || "") + "</span></figcaption>";
    return '<figure class="' + classes.join(" ") + '"><span class="frame">' + media + "</span>" + captionMarkup + "</figure>";
  }

  function renderCase(id, origin) {
    const p = data.projects.find(function (x) { return x.id === id; });
    if (!p) return;

    const tags = p.tags.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");
    const gallery = p.gallery.map(galleryItemMarkup).join("");
    const toolsRow = p.tools && p.tools.length
      ? "<div><span class=\"case__credit-label\">Ferramentas</span><span>" + p.tools.map(esc).join(" · ") + "</span></div>"
      : "";

    document.getElementById("case-content").innerHTML =
      '<div class="case__header"><header class="case__identity">' +
        '<div class="case__eyebrow"><span>Ficha ' + pad(p.order) + "</span><span>" +
          (p.section === "studies" ? "Studies" : "Seleção principal") + "</span></div>" +
        '<h2 id="case-title" class="case__title">' + esc(p.title) + "</h2>" +
        (p.subtitle ? '<p class="case__subtitle">' + esc(p.subtitle) + "</p>" : "") +
        '</header><div class="case__details">' +
        '<p class="case__desc">' + esc(p.description) + "</p>" +
        (p.note ? '<p class="case__note">' + esc(p.note) + "</p>" : "") +
        '<ul class="case__tags">' + tags + "</ul>" +
        '<div class="case__credits">' +
          "<div><span class=\"case__credit-label\">Arquitetura</span><span>" +
            (p.architecture ? esc(p.architecture) : "Autoria não publicada") + "</span></div>" +
          "<div><span class=\"case__credit-label\">Visualização</span><span>" + esc(p.visualization) + "</span></div>" +
          toolsRow +
        "</div>" +
        (p.behance
          ? '<a class="case__behance" href="' + esc(p.behance) + '" target="_blank" rel="noopener">Abrir no Behance ↗</a>'
          : "") +
      "</div></div>" +
      '<div class="case__gallery">' + gallery + "</div>" +
      nextCaseNav(p);

    observeGallery();
    openDialog(origin);
  }

  function observeGallery() {
    const figures = Array.prototype.slice.call(document.querySelectorAll("#case-dialog .case__figure:not(.case__figure--cover)"));
    if (!("IntersectionObserver" in window)) {
      figures.forEach(function (f) { f.classList.add("is-in"); });
      return;
    }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, {
      root: document.querySelector(".dialog__panel"),
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.1
    });
    figures.forEach(function (f) { io.observe(f); });
  }

  function openDialog(origin) {
    const dialog = document.getElementById("case-dialog");
    const panel = dialog.querySelector(".dialog__panel");
    const scrim = dialog.querySelector(".dialog__scrim");
    const wasHidden = dialog.hidden;
    dialog.hidden = false;
    document.body.classList.add("no-scroll");
    panel.scrollTop = 0;

    if (hasGsap && !reduced && wasHidden) {
      playCinemaVeil();
      window.gsap.fromTo(scrim, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
      if (origin && origin.width > 0 && origin.height > 0) {
        const pr = panel.getBoundingClientRect();
        const dx = origin.left + origin.width / 2 - (pr.left + pr.width / 2);
        const dy = origin.top + origin.height / 2 - (pr.top + pr.height / 2);
        const s = Math.min(origin.width / pr.width, origin.height / pr.height);
        window.gsap.fromTo(panel,
          { x: dx, y: dy, scale: Math.max(s, 0.35), opacity: 0 },
          { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.75, ease: "cine", clearProps: "x,y,scale" }
        );
      } else {
        window.gsap.fromTo(panel, { opacity: 0, y: 26, scale: 0.992 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power3.out" });
      }
    }

    const close = dialog.querySelector(".dialog__close");
    if (close) close.focus();
  }

  function playCinemaVeil() {
    const bars = document.querySelectorAll(".cinema-veil__bar");
    if (!bars.length || !hasGsap || reduced) return;
    const tl = gsap.timeline();
    tl.to(bars, { height: "14vh", duration: 0.26, ease: "cine" })
      .to(bars, { height: 0, duration: 0.6, ease: "cine" }, 0.46);
  }

  function closeDialog() {
    const dialog = document.getElementById("case-dialog");
    const panel = dialog.querySelector(".dialog__panel");
    const scrim = dialog.querySelector(".dialog__scrim");

    if (lastCaseTrigger) {
      lastCaseTrigger.focus();
      lastCaseTrigger = null;
    }

    const origin = lastOriginEl ? lastOriginEl.getBoundingClientRect() : null;
    lastOriginEl = null;

    if (!hasGsap || reduced) {
      dialog.hidden = true;
      document.body.classList.remove("no-scroll");
      return;
    }

    playCinemaVeil();
    gsap.to(scrim, { opacity: 0, duration: 0.28, ease: "power2.in" });

    if (origin && origin.width > 0 && origin.height > 0) {
      const pr = panel.getBoundingClientRect();
      const dx = origin.left + origin.width / 2 - (pr.left + pr.width / 2);
      const dy = origin.top + origin.height / 2 - (pr.top + pr.height / 2);
      const s = Math.min(origin.width / pr.width, origin.height / pr.height);
      gsap.to(panel, {
        x: dx,
        y: dy,
        scale: Math.max(s, 0.35),
        opacity: 0,
        duration: 0.65,
        ease: "cine",
        onComplete: function () {
          dialog.hidden = true;
          document.body.classList.remove("no-scroll");
          gsap.set([panel, scrim], { clearProps: "all" });
        }
      });
    } else {
      gsap.to(panel, {
        opacity: 0,
        y: 24,
        scale: 0.99,
        duration: 0.32,
        ease: "power2.in",
        onComplete: function () {
          dialog.hidden = true;
          document.body.classList.remove("no-scroll");
          gsap.set([panel, scrim], { clearProps: "all" });
        }
      });
    }
  }

  /* ------------------------------ Render ------------------------------ */

  function render() {
    const main = data.projects
      .filter(function (p) { return p.section === "main"; })
      .sort(function (a, b) { return a.order - b.order; });

    const studies = data.projects.filter(function (p) { return p.section === "studies"; });

    document.getElementById("projects-grid").innerHTML = main.map(projectCard).join("");
    document.getElementById("studies-grid").innerHTML = studies.map(projectCard).join("");
    const indexList = document.getElementById("index-list");
    if (indexList) indexList.innerHTML = main.concat(studies).map(indexRow).join("");
    const reelStage = document.getElementById("reel-stage");
    if (reelStage) {
      reelStage.innerHTML =
        '<div class="reel__track">' +
        main.map(function (p, i) {
          const d = p.hero.desktop;
          const tools = p.tools && p.tools.length ? p.tools.join(" · ") : "Imagem";
          return (
            '<figure class="reel__frame">' +
              pictureMarkup(d.src, p.title + " — " + tools, "(max-width: 760px) 72vw, 26vw", false, d.intrinsicSize) +
              '<figcaption class="reel__caption mono"><span>' + pad(i + 1) + " / " + pad(main.length) + "</span><span>" + esc(p.title) + " · " + esc(tools) + "</span></figcaption>" +
            "</figure>"
          );
        }).join("") +
        "</div>" +
        '<p class="reel__hint mono">Arraste — 7 quadros</p>' +
        '<span class="reel__progress" aria-hidden="true"><i></i></span>';
    }
    document.getElementById("year").textContent = new Date().getFullYear();
  }

  /* ------------------------------ GSAP -------------------------------- */

  function initAnimations() {
    if (!hasGsap || reduced) {
      if (reduced) document.body.classList.add("no-motion");
      return;
    }

    const gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);
    gsap.registerEase("cine", cineEase);

    /* Barra de progresso */
    gsap.to(".progress", {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.3 }
    });

    /* Títulos de seção — palavras em cascata */
    gsap.utils.toArray(".section__title, .contact__title").forEach(function (title) {
      const words = title.querySelectorAll(".w__in");
      if (!words.length) return;
      gsap.from(words, {
        yPercent: 118,
        rotation: 2,
        duration: 0.95,
        stagger: 0.04,
        ease: "power4.out",
        scrollTrigger: { trigger: title, start: "top 86%" }
      });
    });

    /* Cabeçalhos de seção — deriva suave com o scroll */
    gsap.utils.toArray(".section__header").forEach(function (header) {
      gsap.fromTo(header, { y: 30 }, {
        y: -16,
        ease: "none",
        scrollTrigger: { trigger: header, start: "top bottom", end: "bottom top", scrub: 0.5 }
      });
    });

    gsap.utils.toArray(".section__kicker").forEach(function (el) {
      gsap.from(el, {
        opacity: 0,
        x: -14,
        filter: "blur(6px)",
        duration: 0.7,
        scrollTrigger: { trigger: el, start: "top 86%" }
      });
    });

    /* Réguas desenhadas — efeito DrawSVG sem plugin */
    gsap.utils.toArray(".draw-rule path").forEach(function (path) {
      gsap.fromTo(path, { strokeDasharray: 1, strokeDashoffset: 1 }, {
        strokeDashoffset: 0,
        duration: 1.6,
        ease: "cine",
        scrollTrigger: { trigger: path.closest(".section__header"), start: "top 84%" }
      });
    });

    /* Cartões */
    gsap.utils.toArray(".card:not(.card--opener)").forEach(function (card) {
      const frame = card.querySelector(".card__frame");
      const caption = card.querySelector(".card__caption");
      const meta = card.querySelectorAll(".card__meta > *");
      const img = card.querySelector(".frame__img img, .frame__img picture img");

      gsap.from(frame, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 1.15,
        ease: "power4.out",
        scrollTrigger: { trigger: card, start: "top 88%" }
      });

      if (caption) {
        gsap.from(caption, {
          opacity: 0,
          y: 8,
          duration: 0.6,
          delay: 0.15,
          scrollTrigger: { trigger: card, start: "top 86%" }
        });
      }

      if (meta.length) {
        gsap.from(meta, {
          y: 24,
          opacity: 0,
          duration: 0.7,
          stagger: 0.055,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 80%" }
        });
      }

      if (img) {
        gsap.fromTo(img,
          { yPercent: -5, scale: 1.05 },
          {
            yPercent: 5,
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 0.5 }
          }
        );
      }
    });

    /* Índice */
    const index = document.querySelector(".index");
    if (index && index.children.length) {
      gsap.from(index.children, {
        opacity: 0,
        y: 14,
        duration: 0.65,
        stagger: 0.045,
        ease: "power3.out",
        scrollTrigger: { trigger: index, start: "top 88%" }
      });
    }

    /* Índice — preview flutuante que segue o cursor */
    const preview = document.querySelector(".cursor-preview");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (preview && finePointer) {
      const previewImg = preview.querySelector("img");
      const qx = gsap.quickTo(preview, "x", { duration: 0.45, ease: "power3.out" });
      const qy = gsap.quickTo(preview, "y", { duration: 0.45, ease: "power3.out" });
      gsap.set(preview, { xPercent: -50, yPercent: -50, scale: 0.92, opacity: 0, rotation: -1.5 });
      document.querySelectorAll(".index__link").forEach(function (link) {
        link.addEventListener("mouseenter", function () {
          previewImg.src = link.getAttribute("data-preview");
          preview.style.aspectRatio = link.getAttribute("data-ratio") || "4 / 5";
          gsap.to(preview, { opacity: 1, scale: 1, rotation: 0, duration: 0.4, ease: "power3.out" });
        });
        link.addEventListener("mousemove", function (event) {
          qx(event.clientX);
          qy(event.clientY);
        });
        link.addEventListener("mouseleave", function () {
          gsap.to(preview, { opacity: 0, scale: 0.92, rotation: -1.5, duration: 0.3, ease: "power2.in" });
        });
      });
    }

    /* Reel — faixa de filme com rolagem natural */
    const reel = document.querySelector(".reel");
    if (reel) {
      gsap.from(reel, {
        opacity: 0,
        y: 34,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: reel, start: "top 86%" }
      });
      const progress = reel.querySelector(".reel__progress i");
      const updateProgress = function () {
        const max = reel.scrollWidth - reel.clientWidth;
        progress.style.transform = "scaleX(" + (max > 0 ? reel.scrollLeft / max : 0) + ")";
      };
      reel.addEventListener("scroll", updateProgress, { passive: true });
      window.addEventListener("resize", updateProgress);
      updateProgress();
    }

    /* Hover — títulos deslizam via GSAP (sem briga com CSS) */
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      document.querySelectorAll(".card__title").forEach(function (title) {
        const tx = gsap.quickTo(title, "x", { duration: 0.55, ease: "power3.out" });
        const card = title.closest(".card");
        card.addEventListener("mouseenter", function () { tx(8); });
        card.addEventListener("mouseleave", function () { tx(0); });
      });
      document.querySelectorAll(".service__title").forEach(function (title) {
        const tx = gsap.quickTo(title, "x", { duration: 0.5, ease: "power3.out" });
        const service = title.closest(".service");
        service.addEventListener("mouseenter", function () { tx(8); });
        service.addEventListener("mouseleave", function () { tx(0); });
      });
    }

    /* Cursor customizado — ponto + anel */
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      document.body.classList.add("has-cursor");
      const dot = document.querySelector(".cursor__dot");
      const ring = document.querySelector(".cursor__ring");
      gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });
      const dx = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power2.out" });
      const dy = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power2.out" });
      const rx = gsap.quickTo(ring, "x", { duration: 0.38, ease: "power3.out" });
      const ry = gsap.quickTo(ring, "y", { duration: 0.38, ease: "power3.out" });
      window.addEventListener("mousemove", function (e) {
        dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
      });
      document.querySelectorAll("a, button, .card__media, .index__link, .service").forEach(function (el) {
        el.addEventListener("mouseenter", function () { gsap.to(ring, { scale: 1.7, duration: 0.3, ease: "power2.out" }); });
        el.addEventListener("mouseleave", function () { gsap.to(ring, { scale: 1, duration: 0.3, ease: "power2.out" }); });
      });
    }

    /* Números */
    gsap.utils.toArray("[data-count]").forEach(function (el) {
      const end = parseFloat(el.getAttribute("data-count")) || 0;
      const state = { v: 0 };
      gsap.to(state, {
        v: end,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
        onUpdate: function () { el.textContent = String(Math.round(state.v)); }
      });
    });

    /* Fatos do estúdio */
    gsap.utils.toArray(".fact").forEach(function (fact) {
      gsap.from(fact, {
        opacity: 0,
        y: 18,
        duration: 0.7,
        scrollTrigger: { trigger: fact, start: "top 88%" }
      });
    });

    /* Serviços */
    gsap.utils.toArray(".service").forEach(function (service) {
      gsap.from(service.children, {
        opacity: 0,
        y: 16,
        duration: 0.6,
        stagger: 0.06,
        scrollTrigger: { trigger: service, start: "top 88%" }
      });
    });

    /* Processo — régua + etapas */
    gsap.fromTo(".process__rule",
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: ".process", start: "top 78%", end: "bottom 55%", scrub: 0.5 }
      }
    );

    gsap.utils.toArray(".process__step").forEach(function (step) {
      gsap.from(step.children, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.06,
        scrollTrigger: { trigger: step, start: "top 86%" }
      });
    });

    /* Contato */
    gsap.from(".contact__note", {
      opacity: 0,
      y: 20,
      duration: 0.8,
      scrollTrigger: { trigger: ".contact__note", start: "top 85%" }
    });
    gsap.from(".contact__mail", {
      opacity: 0,
      y: 24,
      duration: 0.8,
      scrollTrigger: { trigger: ".contact__mail", start: "top 88%" }
    });
    gsap.from(".contact__links a", {
      opacity: 0,
      y: 12,
      duration: 0.6,
      stagger: 0.08,
      scrollTrigger: { trigger: ".contact__links", start: "top 92%" }
    });

    /* Recálculo após carregamento das imagens */
    window.addEventListener("load", function () {
      window.ScrollTrigger.refresh();
    });
  }

  /* ------------------------------ Eventos ----------------------------- */

  document.addEventListener("click", function (event) {
    const openTrigger = event.target.closest("[data-open-case]");
    if (openTrigger) {
      if (!openTrigger.closest("#case-dialog")) {
        lastCaseTrigger = openTrigger;
        const card = openTrigger.closest(".card");
        lastOriginEl = card ? card.querySelector(".card__frame") : openTrigger.closest(".index__link");
      }
      renderCase(openTrigger.getAttribute("data-open-case"), lastOriginEl ? lastOriginEl.getBoundingClientRect() : null);
      return;
    }
    if (event.target.closest("[data-close-case]")) closeDialog();
  });

  /* ---------------------- Menu recolhido (mobile) --------------------- */

  const headerEl = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".site-header__toggle");

  function setMenu(open) {
    if (!headerEl || !menuToggle) return;
    headerEl.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    menuToggle.textContent = open ? "Fechar" : "Menu";
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      setMenu(!headerEl.classList.contains("is-open"));
    });
    /* Escolher um destino fecha o menu */
    document.querySelectorAll(".site-header__nav a").forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });
    /* Voltar para o desktop (girar a tela) não pode deixar o estado preso */
    const wide = window.matchMedia("(min-width: 761px)");
    const onWide = function (e) { if (e.matches) setMenu(false); };
    if (wide.addEventListener) wide.addEventListener("change", onWide);
    else wide.addListener(onWide);
  }

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    if (headerEl && headerEl.classList.contains("is-open")) {
      setMenu(false);
      menuToggle.focus();
      return;
    }
    closeDialog();
  });

  /* Foco preso dentro da ficha enquanto aberta */
  document.getElementById("case-dialog").addEventListener("keydown", function (event) {
    if (event.key !== "Tab") return;
    const focusables = this.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      last.focus();
      event.preventDefault();
    } else if (!event.shiftKey && document.activeElement === last) {
      first.focus();
      event.preventDefault();
    }
  });

  window.addEventListener("scroll", function () {
    document.querySelector(".site-header").classList.toggle("is-scrolled", window.scrollY > 24);
  }, { passive: true });

  document.addEventListener("DOMContentLoaded", function () {
    try {
      const preview = document.createElement("div");
      preview.className = "cursor-preview";
      preview.setAttribute("aria-hidden", "true");
      preview.innerHTML = '<img alt="" />';
      document.body.appendChild(preview);

      const cursor = document.createElement("div");
      cursor.className = "cursor";
      cursor.setAttribute("aria-hidden", "true");
      cursor.innerHTML = '<span class="cursor__dot"></span><span class="cursor__ring"></span>';
      document.body.appendChild(cursor);

      if (hasGsap && !reduced) {
        document.querySelectorAll(".section__title, .contact__title").forEach(function (title) {
          title.setAttribute("aria-label", title.textContent.replace(/\s+/g, " ").trim());
          title.querySelectorAll(".line__in").forEach(splitWords);
        });
      }

      render();
      initAnimations();
    } catch (err) {
      const banner = document.createElement("div");
      banner.setAttribute("role", "alert");
      banner.style.cssText = "position:fixed;inset:auto 0 0 0;z-index:999;background:#B5430F;color:#ECE7DE;padding:12px 18px;font:600 14px/1.5 sans-serif;";
      banner.textContent = "Erro ao montar a página: " + err.message;
      document.body.appendChild(banner);
      if (window.console) console.error(err);
    }
  });
})();
