(() => {
  // Menu lateral
  const drawer = document.getElementById("drawer");
  const menuBtn = document.getElementById("menuBtn");
  const setDrawer = (open) => {
    drawer.hidden = !open;
    menuBtn.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
    if (open) drawer.querySelector("a").focus();
    else menuBtn.focus({ preventScroll: true });
  };
  menuBtn.addEventListener("click", () => setDrawer(true));
  document.getElementById("drawerClose").addEventListener("click", () => setDrawer(false));
  drawer.addEventListener("click", (e) => {
    if (e.target === drawer || e.target.closest(".drawer__nav a")) setDrawer(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !drawer.hidden) setDrawer(false);
  });

  // Revelação suave ao entrar na tela
  const revealables = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 }
    );
    revealables.forEach((el) => {
      const siblings = [...el.parentElement.children].filter((c) => c.hasAttribute("data-reveal"));
      el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 80}ms`;
      io.observe(el);
    });
  } else {
    revealables.forEach((el) => el.classList.add("is-visible"));
  }

  // Aviso rápido
  const toast = document.getElementById("toast");
  let toastTimer;
  const notify = (text) => {
    toast.textContent = text;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (toast.hidden = true), 2400);
  };

  // Abas da coleção
  const tabs = document.querySelectorAll(".tab");
  const products = document.querySelectorAll(".product");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const filter = tab.dataset.filter;
      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", String(active));
      });
      products.forEach((p) => {
        p.hidden = filter !== "all" && !p.dataset.tags.split(" ").includes(filter);
        p.classList.add("is-visible");
      });
    });
  });

  // Favoritos e sacola
  const bagCount = document.getElementById("bagCount");
  let bag = 0;
  document.getElementById("products").addEventListener("click", (e) => {
    const fav = e.target.closest(".fav");
    const add = e.target.closest(".add");
    if (fav) {
      const on = fav.getAttribute("aria-pressed") !== "true";
      fav.setAttribute("aria-pressed", String(on));
    }
    if (add) {
      bag += 1;
      bagCount.textContent = bag;
      bagCount.hidden = false;
      notify(`Na sacola: ${add.closest(".product").querySelector("h3").textContent}`);
    }
  });

  // Carrossel de amostras
  const swatches = document.getElementById("swatches");
  document.querySelectorAll("[data-slide]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const step = swatches.querySelector(".swatch").offsetWidth + 20;
      swatches.scrollBy({ left: step * Number(btn.dataset.slide), behavior: "smooth" });
    });
  });

  // Newsletter
  const form = document.getElementById("newsletter");
  const msg = document.getElementById("newsletterMsg");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      msg.textContent = "Digite um e-mail válido.";
      form.email.focus();
      return;
    }
    msg.textContent = "Obrigado. Sua primeira carta chega na próxima estação.";
    form.reset();
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
