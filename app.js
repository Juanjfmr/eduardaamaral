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

  function startTimecode() {
    const tc = document.getElementById("tc");
    if (!tc || reduced) return;
    let frames = 0;
    let acc = 0;
    let last = performance.now();
    const pad2 = function (n) { return String(n).padStart(2, "0"); };
    function tick(now) {
      acc += now - last;
      last = now;
      while (acc >= 1000 / 24) {
        frames += 1;
        acc -= 1000 / 24;
      }
      const ff = frames % 24;
      const s = Math.floor(frames / 24) % 60;
      const m = Math.floor(frames / 1440) % 60;
      const h = Math.floor(frames / 86400) % 24;
      tc.textContent = "TC " + pad2(h) + ":" + pad2(m) + ":" + pad2(s) + ":" + pad2(ff);
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function cineEase(p) {
    const e = 1 - Math.pow(1 - p, 4);
    return e + (p > 0.55 ? Math.sin(((p - 0.55) / 0.45) * Math.PI) * 0.018 : 0);
  }

  function splitWords(el, char) {
    function wrapChars(text) {
      const frag = document.createDocumentFragment();
      text.split("").forEach(function (ch) {
        const c = document.createElement("span");
        c.className = "c";
        c.textContent = ch;
        frag.appendChild(c);
      });
      return frag;
    }

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
          if (char) {
            inner.appendChild(wrapChars(part));
          } else {
            inner.textContent = part;
          }
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

  function mediaMarkup(item, alt, eager) {
    const ratio = item.ratio || "4 / 5";
    const focus = item.focus ? " style=\"--focus: " + esc(focus) + ";\"" : "";
    const loading = eager ? ' fetchpriority="high"' : ' loading="lazy"';
    return (
      '<span class="frame__img" style="--ratio: ' + esc(ratio) + ';"' + focus + ">" +
        '<img src="' + esc(item.src) + '" alt="' + esc(alt) + '" decoding="async"' + loading + " />" +
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

    if (m && m.src && m.src !== d.src) {
      return (
        '<span class="frame__img" style="' + heroStyle + '">' +
          '<picture>' +
            '<source media="(max-width: 760px)" srcset="' + esc(m.src) + '" />' +
            desktopImg +
          "</picture>" +
        "</span>"
      );
    }
    return (
      '<span class="frame__img" style="' + heroStyle + '">' +
        desktopImg +
      "</span>"
    );
  }

  /* ------------------------------ Cartões ----------------------------- */

  function projectCard(p) {
    const hero = p.hero.desktop;
    const caption =
      "Fig. " + pad(p.order) + " — " +
      (p.tools && p.tools.length ? p.tools.join(" · ") : (p.subtitle || "Seleção 2026"));
    return (
      '<article class="card card--' + esc(p.layout) + '">' +
        '<figure class="card__media">' +
          '<span class="card__frame frame">' + heroMediaMarkup(p) + "</span>" +
          '<figcaption class="card__caption"><span>' + esc(caption) + "</span><span>" + esc(hero.ratio || "4 / 5") + "</span></figcaption>" +
        "</figure>" +
        '<div class="card__meta">' +
          '<p class="card__index mono">N.º ' + pad(p.order) + "</p>" +
          '<h3 class="card__title">' + esc(p.title) + "</h3>" +
          (p.subtitle ? '<p class="card__sub">' + esc(p.subtitle) + "</p>" : "") +
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
    const previewSrc = p.hero.desktop.src;
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
    const media = mediaMarkup(g, "Imagem do projeto — " + caption);
    return (
      '<figure class="case__figure' + (g.contain ? " case__figure--contain" : "") + '">' +
        '<span class="frame">' + media + "</span>" +
        "<figcaption><span>" + esc(caption) + "</span><span>" + esc(g.ratio || "") + "</span></figcaption>" +
      "</figure>"
    );
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
      '<header class="case__header">' +
        '<div class="case__eyebrow"><span>Ficha ' + pad(p.order) + "</span><span>" +
          (p.section === "studies" ? "Studies" : "Seleção principal") + "</span></div>" +
        '<h2 id="case-title" class="case__title">' + esc(p.title) + "</h2>" +
        (p.subtitle ? '<p class="case__subtitle">' + esc(p.subtitle) + "</p>" : "") +
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
      "</header>" +
      '<div class="case__gallery">' + gallery + "</div>" +
      nextCaseNav(p);

    observeGallery();
    openDialog(origin);
  }

  function observeGallery() {
    const figures = Array.prototype.slice.call(document.querySelectorAll("#case-dialog .case__figure"));
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
              '<img src="' + esc(d.src) + '" alt="' + esc(p.title + " — " + tools) + '" decoding="async" />' +
              '<figcaption class="reel__caption mono"><span>' + pad(i + 1) + " / " + pad(main.length) + "</span><span>" + esc(p.title) + " · " + esc(tools) + "</span></figcaption>" +
            "</figure>"
          );
        }).join("") +
        "</div>" +
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

    /* Loader — contador de abertura */
    gsap.set(".loader", { opacity: 1, y: 0 });
    const counterState = { v: 0 };
    const counterEl = document.querySelector(".loader__counter");
    const nameEl = document.querySelector(".loader__name");
    gsap.to(counterState, {
      v: 100,
      duration: 1.45,
      ease: "power2.inOut",
      onUpdate: function () {
        counterEl.textContent = String(Math.round(counterState.v)).padStart(2, "0");
      }
    });
    let nameIdx = 0;
    const nameTimer = setInterval(function () {
      nameIdx = (nameIdx + 1) % data.projects.length;
      nameEl.textContent = data.projects[nameIdx].title;
    }, 190);
    gsap.to(".loader", {
      opacity: 0,
      y: -30,
      duration: 0.55,
      ease: "power2.in",
      delay: 1.5,
      onComplete: function () { clearInterval(nameTimer); }
    });

    /* Intro — cinema */
    gsap.set(".intro__media img", { scale: 1.18, yPercent: -2 });
    gsap.set(".cinema-veil__bar", { height: "50vh" });
    const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 1.55 });
    tl.to(".cinema-veil__bar", { height: 0, duration: 1.05, ease: "power4.inOut" }, 0)
      .from(".intro__media", { clipPath: "inset(100% 0% 0% 0%)", duration: 1.5, ease: "power4.inOut" }, 0.12)
      .to(".intro__media img", { scale: 1.12, yPercent: 0, duration: 2.4, ease: "power3.out" }, 0.22)
      .from(".intro__scrim", { opacity: 0, duration: 1.3 }, 0.25)
      .from(".site-header", { yPercent: -120, duration: 0.7 }, 0.15)
      .from(".intro__kicker", { opacity: 0, y: 16, filter: "blur(6px)", duration: 0.7 }, 0.45)
      .from(".intro__title .c", { yPercent: 120, rotation: 4, duration: 0.95, stagger: 0.022, ease: "cine" }, 0.55)
      .from(".intro__lede", { opacity: 0, y: 16, duration: 0.7 }, 1.05)
      .from(".intro__cta .btn", { opacity: 0, y: 14, duration: 0.55, stagger: 0.08 }, 1.15)
      .from(".intro__credit", { opacity: 0, duration: 0.7 }, 1.25)
      .from(".intro__scroll, .ticker", { opacity: 0, duration: 0.7 }, 1.35);

    /* Deriva contínua — Ken Burns */
    gsap.to(".intro__media img", {
      scale: 1.17,
      yPercent: 2.5,
      duration: 12,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      delay: 3.4
    });

    /* Ticker infinito */
    gsap.to(".ticker__track", {
      xPercent: -50,
      duration: 32,
      ease: "none",
      repeat: -1
    });

    /* Hero — parallax de saída + indicador de rolagem */
    gsap.to(".intro__media", {
      yPercent: 14,
      scale: 1.08,
      ease: "none",
      scrollTrigger: { trigger: ".intro", start: "top top", end: "bottom top", scrub: 0.6 }
    });
    gsap.to(".intro__copy", {
      yPercent: -16,
      opacity: 0,
      ease: "none",
      scrollTrigger: { trigger: ".intro", start: "top top", end: "bottom top", scrub: 0.6 }
    });
    gsap.to(".intro__scroll", {
      y: 7,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
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
    gsap.utils.toArray(".card").forEach(function (card) {
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

    /* Reel — faixa de filme dirigida pelo scroll */
    const reel = document.querySelector(".reel");
    if (reel) {
      const track = reel.querySelector(".reel__track");
      const progress = reel.querySelector(".reel__progress i");
      const rt = gsap.timeline({
        scrollTrigger: {
          trigger: reel,
          start: "top 75%",
          end: "+=170%",
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true
        }
      });
      rt.fromTo(track, { x: 0 }, {
        x: function () { return -Math.max(0, track.scrollWidth - reel.clientWidth); },
        duration: 1,
        ease: "none"
      }, 0)
        .fromTo(progress, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "none" }, 0);
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

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeDialog();
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

      document.querySelectorAll("#intro-title .line__in").forEach(function (el) { splitWords(el, true); });
      document.querySelectorAll(".section__title .line__in, .contact__title .line__in").forEach(splitWords);

      render();
      initAnimations();
      startTimecode();
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
