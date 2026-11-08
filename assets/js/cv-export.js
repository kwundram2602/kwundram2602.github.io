// Style switcher and print/PDF export.
// - Style: sets data-style on <html>; saved in localStorage ("cv-style").
// - Export: the chosen sections get .export-hidden toggled off/on (only has an
//   effect in print), the chosen style is applied while printing, then restored.
(function () {
  "use strict";

  const root = document.documentElement;
  const KEYS = { style: "cv-style", sections: "cv-export-sections" };
  const store = {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        return null;
      }
    },
    set(key, value) {
      try {
        if (value === null) localStorage.removeItem(key);
        else localStorage.setItem(key, value);
      } catch (e) {
        /* storage unavailable: keep the choice for this visit only */
      }
    },
  };

  const controls = document.querySelector(".cv-controls");
  if (!controls) return;

  const styleCards = [...controls.querySelectorAll("[data-set-style]")];
  const sectionBoxes = [...controls.querySelectorAll('input[name="export-section"]')];
  const styleRadios = [...controls.querySelectorAll('input[name="export-style"]')];
  const toggles = [...controls.querySelectorAll(".cv-btn[aria-controls]")];

  // ---------- Style ----------
  function markActiveStyle() {
    styleCards.forEach((card) => {
      card.setAttribute("aria-pressed", String(card.dataset.setStyle === root.dataset.style));
    });
  }

  function setStyle(id) {
    root.dataset.style = id;
    store.set(KEYS.style, id);
    markActiveStyle();
    // Drop a ?style= override so a reload keeps the new choice.
    const url = new URL(window.location.href);
    if (url.searchParams.has("style")) {
      url.searchParams.delete("style");
      history.replaceState(null, "", url);
    }
  }

  styleCards.forEach((card) => card.addEventListener("click", () => setStyle(card.dataset.setStyle)));
  markActiveStyle();

  // ---------- Sections ----------
  function selectedSections() {
    return sectionBoxes.filter((box) => box.checked).map((box) => box.value);
  }

  function applySections() {
    const selected = new Set(selectedSections());
    document.querySelectorAll("main [data-section]").forEach((el) => {
      el.classList.toggle("export-hidden", !selected.has(el.dataset.section));
    });
    // Last visible nav item gets no separator in print.
    const navItems = [...document.querySelectorAll(".cv-nav [data-section]")];
    navItems.forEach((el) => el.classList.remove("print-last"));
    const visible = navItems.filter((el) => selected.has(el.dataset.section));
    if (visible.length) visible[visible.length - 1].classList.add("print-last");
  }

  function loadSections() {
    let saved = null;
    try {
      saved = JSON.parse(store.get(KEYS.sections));
    } catch (e) {
      saved = null;
    }
    if (Array.isArray(saved)) {
      sectionBoxes.forEach((box) => {
        box.checked = saved.includes(box.value);
      });
    }
    applySections();
  }

  sectionBoxes.forEach((box) =>
    box.addEventListener("change", () => {
      store.set(KEYS.sections, JSON.stringify(selectedSections()));
      applySections();
    })
  );

  controls.querySelector("[data-reset-sections]").addEventListener("click", () => {
    sectionBoxes.forEach((box) => {
      box.checked = box.hasAttribute("data-default");
    });
    store.set(KEYS.sections, null);
    applySections();
  });

  loadSections();

  // ---------- Panels ----------
  function panelOf(button) {
    return document.getElementById(button.getAttribute("aria-controls"));
  }

  function closePanels(except) {
    toggles.forEach((button) => {
      if (button === except) return;
      button.setAttribute("aria-expanded", "false");
      panelOf(button).hidden = true;
    });
  }

  function openPanel(button) {
    closePanels(button);
    const panel = panelOf(button);
    if (panel.id === "export-panel") {
      // The PDF style starts as the current page style.
      styleRadios.forEach((radio) => {
        radio.checked = radio.value === root.dataset.style;
      });
    }
    panel.hidden = false;
    button.setAttribute("aria-expanded", "true");
    const first = panel.querySelector('[aria-pressed="true"], input:checked, button, input');
    if (first) first.focus({ preventScroll: true });
  }

  toggles.forEach((button) =>
    button.addEventListener("click", () => {
      if (button.getAttribute("aria-expanded") === "true") closePanels();
      else openPanel(button);
    })
  );

  document.addEventListener("click", (event) => {
    if (!controls.contains(event.target)) closePanels();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const open = toggles.find((button) => button.getAttribute("aria-expanded") === "true");
    if (open) {
      closePanels();
      open.focus();
    }
  });

  // ---------- Print / PDF ----------
  function exportFilename() {
    const name = document.querySelector(".cv-name, .sidebar-wrapper .name");
    const base = name ? name.textContent.trim().replace(/\s+/g, "_") : "CV";
    return `${base}_CV`;
  }

  // The document title is the default file name of "Save as PDF" (also for Ctrl+P).
  let pageTitle = null;
  window.addEventListener("beforeprint", () => {
    if (pageTitle === null) {
      pageTitle = document.title;
      document.title = exportFilename();
    }
  });
  window.addEventListener("afterprint", () => {
    if (pageTitle !== null) {
      document.title = pageTitle;
      pageTitle = null;
    }
  });

  controls.querySelector("[data-print]").addEventListener("click", () => {
    const chosen = styleRadios.find((radio) => radio.checked);
    const pageStyle = root.dataset.style;

    closePanels();
    applySections();
    if (chosen) root.dataset.style = chosen.value;
    window.addEventListener("afterprint", () => (root.dataset.style = pageStyle), { once: true });
    window.print();
  });
})();
