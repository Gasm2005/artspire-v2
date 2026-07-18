import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { getCategories, type CategoryWithVisuals } from "../lib/categories";
import { getWebsiteContent, getPageSEO, type WebsiteContent } from "../lib/website-content";
import { getArtworks, type ArtworkWithCategory } from "../lib/artworks";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [categories, content, seo, homepageArtworks] = await Promise.all([
      getCategories().catch(() => []),
      getWebsiteContent({ page: "homepage", activeOnly: true }).catch(() => []),
      getPageSEO("homepage").catch(() => ({ title: null, description: null, ogImage: null })),
      getArtworks({ status: "published", limit: 6, orderBy: "display_order" }).catch(() => []),
    ]);
    return {
      categories: categories as CategoryWithVisuals[],
      content: content as WebsiteContent[],
      seo,
      homepageArtworks: homepageArtworks as ArtworkWithCategory[],
    };
  },
  head: ({ loaderData }) => {
    const seo = loaderData?.seo;
    return {
      meta: [
        { title: seo?.title ?? "The Artspire | Handmade Objects & Bespoke Art by Himangi Pandey" },
        { name: "description", content: seo?.description ?? "Handmade home décor and bespoke commissioned art by Himangi Pandey — clay, cement, wood, portraits. Made by hand in Kanpur, shipped across India." },
        ...(seo?.ogImage ? [{ property: "og:image", content: seo.ogImage }] : []),
      ],
    };
  },
  component: Index,
});

function useSiteMotion() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const hdr = document.getElementById("hdr");
    const totop = document.getElementById("totop");
    const onScroll = () => {
      const y = window.scrollY;
      if (hdr) hdr.classList.toggle("scrolled", y > 20);
      if (totop) totop.classList.toggle("show", y > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => window.removeEventListener("scroll", onScroll));

    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.15 });
    document.querySelectorAll(".tas .rv,.tas .clip,.tas .reveal-words").forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());

    const cio = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target as HTMLElement; const end = +(el.dataset.count || "0"); const suf = el.dataset.suffix || "";
      let t0: number | null = null; const dur = 1500;
      const step = (t: number) => { if (!t0) t0 = t; const p = Math.min((t - t0) / dur, 1); const v = Math.floor((1 - Math.pow(1 - p, 3)) * end); el.textContent = v.toLocaleString("en-IN") + suf; if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step); cio.unobserve(el);
    }), { threshold: 0.6 });
    document.querySelectorAll(".tas [data-count]").forEach((c) => cio.observe(c));
    cleanups.push(() => cio.disconnect());

    document.querySelectorAll(".tas .reveal-words").forEach((el) => {
      const walk = (node: Node) => { [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          (n.textContent || "").split(/(\s+)/).forEach((part) => {
            if (part.trim() === "") { frag.appendChild(document.createTextNode(part)); return; }
            const w = document.createElement("span"); w.className = "word";
            const inner = document.createElement("span"); inner.textContent = part;
            w.appendChild(inner); frag.appendChild(w);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) walk(n);
      }); };
      walk(el);
      el.querySelectorAll(".word>span").forEach((sp, i) => { (sp as HTMLElement).style.transitionDelay = i * 0.05 + "s"; });
    });

    const W = window as unknown as { Lenis?: new (o: unknown) => { raf: (t: number) => void; destroy: () => void } };
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    if (W.Lenis) {
      lenis = new W.Lenis({ duration: 1.15, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      const raf = (t: number) => { if (lenis) lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
      cleanups.push(() => { if (lenis) lenis.destroy(); });
    }

    document.querySelectorAll<HTMLElement>(".tas .btn").forEach((btn) => {
      const mm = (e: MouseEvent) => { const r = btn.getBoundingClientRect(); btn.style.transform = "translate(" + (e.clientX - (r.left + r.width / 2)) * 0.28 + "px," + (e.clientY - (r.top + r.height / 2)) * 0.4 + "px)"; };
      const ml = () => { btn.style.transform = ""; };
      btn.addEventListener("mousemove", mm); btn.addEventListener("mouseleave", ml);
      cleanups.push(() => { btn.removeEventListener("mousemove", mm); btn.removeEventListener("mouseleave", ml); });
    });

    document.querySelectorAll<HTMLElement>(".tas .tilt").forEach((el) => {
      const mm = (e: MouseEvent) => { const r = el.getBoundingClientRect(); const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height; el.style.transform = "perspective(1200px) rotateX(" + (0.5 - py) * 15 + "deg) rotateY(" + (px - 0.5) * 15 + "deg) translateZ(34px) scale(1.045)"; };
      const ml = () => { el.style.transform = ""; };
      el.addEventListener("mousemove", mm); el.addEventListener("mouseleave", ml);
      cleanups.push(() => { el.removeEventListener("mousemove", mm); el.removeEventListener("mouseleave", ml); });
    });

    const ring = document.getElementById("cring");
    if (ring) {
      let tx = window.innerWidth / 2, ty = window.innerHeight / 2, rx = tx, ry = ty, run = true;
      const move = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; };
      window.addEventListener("mousemove", move, { passive: true });
      const loop = () => { if (!run) return; rx += (tx - rx) * 0.18; ry += (ty - ry) * 0.18; ring.style.left = rx + "px"; ring.style.top = ry + "px"; requestAnimationFrame(loop); };
      loop();
      document.querySelectorAll(".tas a,.tas button,.tas .card,.tas .cat-tile,.tas .gift").forEach((el) => {
        el.addEventListener("mouseenter", () => ring.classList.add("big"));
        el.addEventListener("mouseleave", () => ring.classList.remove("big"));
      });
      cleanups.push(() => { run = false; window.removeEventListener("mousemove", move); });
    }

    if (totop) totop.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });

    return () => cleanups.forEach((fn) => fn());
  }, []);
}

function SiteHeader() {
  return (
    <>
      <div className="announce"><div className="wrap arow"><span>Handmade in India</span><b>◆</b><span>Complimentary pan-India shipping</span><b>◆</b><span>Now shipping worldwide soon</span></div></div>
      <header id="hdr">
        <nav className="wrap">
          <Link to="/" className="logo"><img src="/artspire-logo.png" alt="The Artspire" className="logo-img" /></Link>
          <div className="navlinks">
            <Link to="/shop">Shop</Link>
            <Link to="/shop">Collections</Link>
            <Link to="/services">Commissions</Link>
            <Link to="/about">Our Story</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="navicons">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
            <Link to="/cart" className="cart-dot" aria-label="Cart">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
              <b>0</b>
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
}

function SiteFooter() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="foot-logo"><i>The</i>Artspire</div>
            <p className="foot-tag">Handmade objects for the home — made slowly, kept for a lifetime.</p>
          </div>
          <div><h4>Shop</h4><ul><li><Link to="/shop">All Pieces</Link></li><li><Link to="/shop">Collections</Link></li><li><Link to="/shop">New Arrivals</Link></li><li><Link to="/cart">Cart</Link></li></ul></div>
          <div><h4>Studio</h4><ul><li><Link to="/services">Commissions</Link></li><li><Link to="/portfolio">Portfolio</Link></li><li><Link to="/about">Our Story</Link></li><li><Link to="/contact">Contact</Link></li></ul></div>
          <div><h4>Support</h4><ul><li><Link to="/track-order">Track Order</Link></li><li><Link to="/faq">Shipping &amp; Returns</Link></li><li><Link to="/faq">Care Guide</Link></li><li><Link to="/faq">FAQs</Link></li></ul></div>
        </div>
        <div className="foot-bottom"><span>© 2026 The Artspire Studio · Kanpur, India</span><span>Crafting Your Vision</span></div>
      </div>
    </footer>
  );
}

function Index() {
  useSiteMotion();
  return (
    <div className="tas">
      <SiteHeader />

      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <span className="eyebrow rv">Handcrafted · Limited Editions</span>
            <h1 className="reveal-words">Objects made to be <em>lived with</em>, and left behind.</h1>
            <p className="rv d2">Each piece is shaped by hand, one at a time — clay, cement, wood and light, with no promise it will ever be made again.</p>
            <div className="hero-cta rv d3">
              <Link className="btn btn-solid" to="/shop"><span>Explore the Collection</span></Link>
              <Link className="btn-ghost" to="/services">Or commission a bespoke piece <span className="arw">→</span></Link>
            </div>
            <div className="hero-meta rv d4">
              <div><div className="n" data-count="11" data-suffix="+">0</div><div className="l">Years of craft</div></div>
              <div><div className="n" data-count="1000" data-suffix="+">0</div><div className="l">Pieces made</div></div>
              <div><div className="n" data-count="100" data-suffix="%">0</div><div className="l">By hand</div></div>
            </div>
          </div>
          <div className="hero-art">
            <div className="frame tilt" data-label="Signature lamp — hero photo"></div>
            <div className="frame tilt" data-label="Clay vessel"></div>
            <div className="frame tilt" data-label="Cement sculpture"></div>
          </div>
        </div>
        <div className="floating">Now accepting <b>July 2026</b> commissions</div>
      </section>

      <section>
        <div className="wrap">
          <div className="sec-head">
            <div><span className="eyebrow rv">The Collection</span><h2 className="reveal-words">New &amp; noteworthy</h2></div>
            <Link className="link-more rv d2" to="/shop">Shop all pieces →</Link>
          </div>
          <div className="prod-grid">
            <Link className="card rv" to="/shop"><div className="imgwrap tilt"><span className="tag">1 of 1</span><div className="frame" data-label="Product photo"></div><div className="quick">Quick view</div></div><div className="cat">Luxury Lamps</div><h3>Handcrafted Metallic Lamp</h3><div className="price">₹4,999</div></Link>
            <Link className="card rv d1" to="/shop"><div className="imgwrap tilt"><span className="tag">New</span><div className="frame" data-label="Product photo"></div><div className="quick">Quick view</div></div><div className="cat">Clay Decor</div><h3>Hand-thrown Vessel</h3><div className="price">₹2,400</div></Link>
            <Link className="card rv d2" to="/shop"><div className="imgwrap tilt"><div className="frame" data-label="Product photo"></div><div className="quick">Quick view</div></div><div className="cat">Cement Sculptures</div><h3>Monolith Object</h3><div className="price">₹3,200</div></Link>
            <Link className="card rv d3" to="/shop"><div className="imgwrap tilt"><div className="frame" data-label="Product photo"></div><div className="quick">Quick view</div></div><div className="cat">Wooden Objects</div><h3>Carved Bowl Set</h3><div className="price">₹1,850</div></Link>
          </div>
        </div>
      </section>

      <div className="band"><div className="wrap brow"><span>Made by hand</span><i>◆</i><span>One of a kind</span><i>◆</i><span>Kept for a lifetime</span><i>◆</i><span>Shaped slowly</span></div></div>

      <section className="cats">
        <div className="wrap">
          <div className="sec-head"><div><span className="eyebrow rv">Browse by medium</span><h2 className="reveal-words">Explore the shop</h2></div></div>
          <div className="cat-grid">
            <Link className="cat-tile tilt rv" to="/shop"><div className="frame" data-label=""></div><span className="label"><span>Luxury Lamps</span></span></Link>
            <Link className="cat-tile tilt rv d1" to="/shop"><div className="frame" data-label=""></div><span className="label"><span>Clay Decor</span></span></Link>
            <Link className="cat-tile tilt rv d2" to="/shop"><div className="frame" data-label=""></div><span className="label"><span>Cement Sculptures</span></span></Link>
            <Link className="cat-tile tilt rv" to="/shop"><div className="frame" data-label=""></div><span className="label"><span>Wooden Objects</span></span></Link>
            <Link className="cat-tile tilt rv d1" to="/shop"><div className="frame" data-label=""></div><span className="label"><span>Premium Gifts</span></span></Link>
            <Link className="cat-tile tilt rv d2" to="/shop"><div className="frame" data-label=""></div><span className="label"><span>Limited Collectibles</span></span></Link>
          </div>
        </div>
      </section>

      <section className="exclusive">
        <div className="exc-border"></div>
        <div className="wrap exc-grid">
          <div>
            <span className="eyebrow rv">By commission · Strictly limited</span>
            <h2 className="reveal-words">A handful of <em>bespoke</em> pieces, each month.</h2>
            <p className="rv d2">Beyond the shop, Himangi accepts a small number of private commissions — a portrait, a sculpture, a memory made object. Reserved, unhurried, and yours alone.</p>
            <ul className="exc-list rv d3">
              <li><b>01</b> A private conversation about your idea</li>
              <li><b>02</b> A sketch &amp; quote, approved before we begin</li>
              <li><b>03</b> Crafted by one pair of hands, start to finish</li>
            </ul>
            <Link className="btn btn-gold rv d4" to="/services"><span>Request a Commission</span></Link>
          </div>
          <div className="exc-art">
            <div className="frame tilt" data-label="Bespoke portrait — feature"></div>
            <div className="frame tilt" data-label="Detail"></div>
            <div className="frame tilt" data-label="In progress"></div>
          </div>
        </div>
      </section>

      <section className="artist">
        <div className="wrap artist-grid">
          <div className="frame tilt" data-label="Portrait of Himangi at work"></div>
          <div>
            <span className="eyebrow rv">The hands behind The Artspire</span>
            <h2 className="reveal-words">Hi, I'm Himangi.</h2>
            <p className="rv d2">For over eleven years, I've shaped objects and portraits by hand from my studio in Kanpur. Every piece — whether it leaves the shop or begins as your idea — is drawn, thrown, or carved by me alone.</p>
            <p className="rv d3">I keep the numbers small on purpose. It's the only way each piece gets the attention it deserves.</p>
            <Link className="btn-ghost rv d3" to="/about">Read my story <span className="arw">→</span></Link>
            <div className="sign rv d3">— Himangi Pandey</div>
          </div>
        </div>
      </section>

      <section className="quotes">
        <div className="wrap">
          <div className="sec-head"><div><span className="eyebrow rv">In their words</span><h2 className="reveal-words">Kept, and treasured</h2></div></div>
          <div className="q-grid">
            <div className="q rv"><div className="mark">"</div><p>She saw details I never mentioned. It's like she captured his soul, not just his face.</p><div className="who">Rajiv M. · Delhi</div></div>
            <div className="q rv d1"><div className="mark">"</div><p>The clay sculpture made me cry. It's the most precious thing in our home now.</p><div className="who">Sneha K. · Mumbai</div></div>
            <div className="q rv d2"><div className="mark">"</div><p>She redid the eyes because she wasn't happy with them. That dedication is rare.</p><div className="who">Anjali &amp; Vikram · Bengaluru</div></div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="sec-head"><div><span className="eyebrow rv">Made to be gifted</span><h2 className="reveal-words">Find the perfect gift</h2></div></div>
          <div className="gift-grid">
            <Link className="gift tilt rv" to="/shop"><div className="frame" data-label=""></div><span className="label"><span>For Parents</span></span></Link>
            <Link className="gift tilt rv d1" to="/shop"><div className="frame" data-label=""></div><span className="label"><span>For Couples</span></span></Link>
            <Link className="gift tilt rv d2" to="/shop"><div className="frame" data-label=""></div><span className="label"><span>New Home</span></span></Link>
            <Link className="gift tilt rv d3" to="/shop"><div className="frame" data-label=""></div><span className="label"><span>In Memory Of</span></span></Link>
          </div>
        </div>
      </section>

      <section className="news">
        <div className="wrap">
          <span className="eyebrow rv">The Studio Journal</span>
          <h2 className="reveal-words">First look at new pieces</h2>
          <p className="rv d2">Join the list for new drops, restocks, and the occasional peek inside the studio.</p>
          <form className="rv d3" onSubmit={(e) => e.preventDefault()}><input type="email" placeholder="Your email address" /><button className="btn btn-solid" type="submit"><span>Subscribe</span></button></form>
        </div>
      </section>

      <SiteFooter />
      <div className="totop" id="totop"><svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"><path d="M12 19V5M5 12l7-7 7 7" /></svg></div>
      <div className="cursor-ring" id="cring"></div>
    </div>
  );
}
