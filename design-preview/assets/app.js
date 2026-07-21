// ===== The Artspire — shared header/footer + interactions =====
(function () {
  const page = document.body.dataset.page || "";
  const L = (href, label, key) =>
    `<a href="${href}" class="${key === page ? "active" : ""}">${label}</a>`;

  const headerHTML = `
  <div class="announce"><div class="wrap arow">
    <span>Handmade in India</span><b>◆</b><span>Complimentary pan-India shipping</span><b>◆</b><span>Now shipping worldwide soon</span>
  </div></div>
  <header id="hdr">
    <nav class="wrap">
      <a class="logo" href="index.html"><img src="../public/artspire-logo.png" alt="The Artspire" class="logo-img"></a>
      <div class="navlinks">
        ${L("shop.html", "Shop", "shop")}
        ${L("shop.html", "Collections", "collections")}
        ${L("services.html", "Commissions", "commissions")}
        ${L("about.html", "Our Story", "about")}
        ${L("contact.html", "Contact", "contact")}
      </div>
      <div class="navicons">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
        <a href="cart.html" class="cart-dot" aria-label="Cart">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <b>0</b>
        </a>
      </div>
    </nav>
  </header>`;

  const footerHTML = `
  <footer>
    <div class="wrap">
      <div class="foot-grid">
        <div>
          <div class="foot-logo"><i>The</i>Artspire</div>
          <p class="foot-tag">Handmade objects for the home — made slowly, kept for a lifetime.</p>
        </div>
        <div><h4>Shop</h4><ul><li><a href="shop.html">All Pieces</a></li><li><a href="shop.html">Collections</a></li><li><a href="shop.html">New Arrivals</a></li><li><a href="cart.html">Cart</a></li></ul></div>
        <div><h4>Studio</h4><ul><li><a href="services.html">Commissions</a></li><li><a href="portfolio.html">Portfolio</a></li><li><a href="about.html">Our Story</a></li><li><a href="contact.html">Contact</a></li></ul></div>
        <div><h4>Support</h4><ul><li><a href="track-order.html">Track Order</a></li><li><a href="faq.html">Shipping &amp; Returns</a></li><li><a href="faq.html">Care Guide</a></li><li><a href="faq.html">FAQs</a></li></ul></div>
      </div>
      <div class="foot-bottom"><span>© 2026 The Artspire Studio · Kanpur, India</span><span>Crafting Your Vision</span></div>
    </div>
  </footer>`;

  function inject(id, html) {
    const el = document.getElementById(id);
    if (el) el.outerHTML = html;
  }

  function init() {
    inject("site-header", headerHTML);
    inject("site-footer", footerHTML);

    document.body.insertAdjacentHTML(
      "beforeend",
      '<div class="totop" id="totop"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M12 19V5M5 12l7-7 7 7"/></svg></div><div class="cursor-ring" id="cring"></div>',
    );

    const hdr = document.getElementById("hdr"),
      totop = document.getElementById("totop");
    addEventListener(
      "scroll",
      () => {
        const y = window.scrollY;
        if (hdr) hdr.classList.toggle("scrolled", y > 20);
        if (totop) totop.classList.toggle("show", y > 600);
      },
      { passive: true },
    );
    if (totop) totop.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });

    // reveal on scroll
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.15 },
    );
    document.querySelectorAll(".rv,.clip,.reveal-words").forEach((el) => io.observe(el));

    // count up
    const cio = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target,
            end = +el.dataset.count,
            suf = el.dataset.suffix || "";
          let t0 = null;
          const dur = 1500;
          const step = (t) => {
            if (!t0) t0 = t;
            const p = Math.min((t - t0) / dur, 1);
            const v = Math.floor((1 - Math.pow(1 - p, 3)) * end);
            el.textContent = v.toLocaleString("en-IN") + suf;
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          cio.unobserve(el);
        }),
      { threshold: 0.6 },
    );
    document.querySelectorAll("[data-count]").forEach((c) => cio.observe(c));

    // word-by-word heading reveal
    document.querySelectorAll(".reveal-words").forEach((el) => {
      const walk = (node) => {
        [...node.childNodes].forEach((n) => {
          if (n.nodeType === 3) {
            const frag = document.createDocumentFragment();
            n.textContent.split(/(\s+)/).forEach((part) => {
              if (part.trim() === "") {
                frag.appendChild(document.createTextNode(part));
                return;
              }
              const w = document.createElement("span");
              w.className = "word";
              const inner = document.createElement("span");
              inner.textContent = part;
              w.appendChild(inner);
              frag.appendChild(w);
            });
            node.replaceChild(frag, n);
          } else if (n.nodeType === 1) walk(n);
        });
      };
      walk(el);
      el.querySelectorAll(".word>span").forEach(
        (sp, i) => (sp.style.transitionDelay = i * 0.05 + "s"),
      );
    });

    // smooth scroll
    if (window.Lenis) {
      const lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
      (function raf(t) {
        lenis.raf(t);
        requestAnimationFrame(raf);
      })();
    }

    // magnetic buttons
    document.querySelectorAll(".btn").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2),
          my = e.clientY - (r.top + r.height / 2);
        btn.style.transform = "translate(" + mx * 0.28 + "px," + my * 0.4 + "px)";
      });
      btn.addEventListener("mouseleave", () => (btn.style.transform = ""));
    });

    // 3D tilt on images
    document.querySelectorAll(".tilt").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width,
          py = (e.clientY - r.top) / r.height;
        const ry = (px - 0.5) * 15,
          rx = (0.5 - py) * 15;
        el.style.transform =
          "perspective(1200px) rotateX(" +
          rx +
          "deg) rotateY(" +
          ry +
          "deg) translateZ(34px) scale(1.045)";
      });
      el.addEventListener("mouseleave", () => (el.style.transform = ""));
    });

    // custom cursor ring
    const ring = document.getElementById("cring");
    if (ring) {
      let tx = innerWidth / 2,
        ty = innerHeight / 2,
        rx = tx,
        ry = ty;
      addEventListener(
        "mousemove",
        (e) => {
          tx = e.clientX;
          ty = e.clientY;
        },
        { passive: true },
      );
      (function loop() {
        rx += (tx - rx) * 0.18;
        ry += (ty - ry) * 0.18;
        ring.style.left = rx + "px";
        ring.style.top = ry + "px";
        requestAnimationFrame(loop);
      })();
      document.querySelectorAll("a,button,.card,.cat-tile,.gift,.navicons svg").forEach((el) => {
        el.addEventListener("mouseenter", () => ring.classList.add("big"));
        el.addEventListener("mouseleave", () => ring.classList.remove("big"));
      });
    }

    // PDP thumbnail switch + qty (safe no-ops if absent)
    document.querySelectorAll(".thumbs .frame").forEach((t) =>
      t.addEventListener("click", () => {
        document.querySelector(".thumbs .frame.active")?.classList.remove("active");
        t.classList.add("active");
        const m = document.querySelector(".main-img");
        if (m) m.setAttribute("data-label", (t.getAttribute("data-label") || "") + " — enlarged");
      }),
    );
    document.querySelectorAll(".qty button").forEach((b) =>
      b.addEventListener("click", () => {
        const s = b.parentElement.querySelector("span");
        let n = +s.textContent;
        n = b.textContent.trim() === "+" ? n + 1 : Math.max(1, n - 1);
        s.textContent = n;
      }),
    );
    // filter chips
    document.querySelectorAll(".chip").forEach((c) =>
      c.addEventListener("click", () => {
        document.querySelector(".chip.active")?.classList.remove("active");
        c.classList.add("active");
      }),
    );
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
