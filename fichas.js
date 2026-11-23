/* Fichas usam a curadoria existente e o diálogo nativo do navegador. */
(() => {
  const projectData = window.PORTFOLIO.projects;
  const availableSizes = window.PORTFOLIO_SRCSET || {};
  const dialog = document.getElementById("obra");
  const content = document.getElementById("obra-conteudo");
  let opener;

  function make(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    return el;
  }

  function figure(project, frame, index) {
    const item = make("figure", frame.plate ? "project-dialog__plate" : "");
    const caption = frame.caption || `Vista ${index + 1}`;
    const image = make("img");
    image.alt = `${project.title} · ${caption}`;
    image.decoding = "async";
    image.loading = index ? "lazy" : "eager";
    const sizes = availableSizes[frame.src];
    if (sizes?.length) {
      const stem = frame.src.replace(/\.[^.]+$/, "");
      image.sizes = "(max-width: 1000px) calc(100vw - 48px), 900px";
      image.srcset = sizes.map(width => `${stem}-${width}.webp ${width}w`).join(", ");
    }
    image.src = frame.src;
    item.append(image, make("figcaption", "m-text-3", frame.plate ? `Prancha 0${index + 1} · ${caption}` : caption));
    return item;
  }

  function show(project) {
    const title = make("h2", "m-text-2", project.title);
    title.id = "obra-titulo";
    const names = make("div", "project-dialog__meta");
    if (project.architecture) names.append(make("p", "", `Arquitetura · ${project.architecture}`));
    names.append(make("p", "", `Visualização · ${project.visualization}`));
    const gallery = make("div", "project-dialog__gallery");
    gallery.append(...project.gallery.map((frame, index) => figure(project, frame, index)));
    const foot = make("div", "project-dialog__foot");
    if (project.behance) {
      const link = make("a", "m-link", "Ver no Behance ↗");
      link.href = project.behance;
      foot.append(link);
    }
    const next = projectData[projectData.indexOf(project) + 1];
    if (next) {
      const nextButton = make("button", "project-link m-link", `Próximo · ${next.title} ↗`);
      nextButton.type = "button";
      nextButton.dataset.project = next.id;
      foot.append(nextButton);
    }
    content.replaceChildren(title, names, gallery, make("p", "", project.description));
    if (project.note) content.append(make("p", "", project.note));
    if (project.tools?.length) content.append(make("p", "m-text-3", project.tools.join(" · ")));
    content.append(foot);

    if (!dialog.open) {
      window.motionKit?.wheel?.stop();
      dialog.showModal();
    }
    dialog.scrollTop = 0;
    dialog.querySelector("button").focus({ preventScroll: true });
  }

  document.addEventListener("click", event => {
    const trigger = event.target.closest("[data-project]");
    if (!trigger) return;
    const project = projectData.find(item => item.id === trigger.dataset.project);
    if (!project) return;
    if (!dialog.open) opener = trigger;
    show(project);
  });

  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });

  dialog.addEventListener("close", () => {
    content.replaceChildren();
    window.motionKit?.wheel?.start();
    opener?.focus({ preventScroll: true });
  });
})();
