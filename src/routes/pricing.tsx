import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteChrome } from "@/components/site/SiteChrome";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing | The Artspire" },
      {
        name: "description",
        content:
          "Commission pricing by medium at The Artspire — pencil sketches, portraits, paintings, mirror art, clay art, and gifts.",
      },
    ],
  }),
  component: PricingPage,
});

const TIERS = [
  {
    days: "5–7 days",
    tag: "Pencil Sketches",
    from: "₹999",
    lead: "Graphite on archival paper",
    items: ["Single subject portrait", "A4 / A3 sizes", "Preview before final"],
  },
  {
    days: "7–10 days",
    tag: "Colour Portraits",
    from: "₹1,999",
    lead: "Coloured pencil / pastel",
    items: ["Vibrant, lifelike colour", "Single or couple", "Preview before final"],
  },
  {
    days: "10–14 days",
    tag: "Custom Paintings",
    from: "₹2,999",
    lead: "Acrylic / oil on canvas",
    items: ["Canvas, ready to hang", "Multiple subjects", "Preview before final"],
  },
  {
    days: "7–12 days",
    tag: "Mirror Art",
    from: "₹2,499",
    lead: "Hand-worked mirror",
    items: ["Bespoke motifs", "Wedding & gifting favourite", "Insured packaging"],
  },
  {
    days: "7–10 days",
    tag: "Clay Art",
    from: "₹1,799",
    lead: "Hand-sculpted clay",
    items: ["3D portrait / figure", "Sealed & finished", "Preview before final"],
  },
  {
    days: "5–10 days",
    tag: "Personalised Gifts",
    from: "₹899",
    lead: "Made for the occasion",
    items: ["Bottle art, keepsakes", "Add a gift note", "Fast turnaround"],
  },
];

function PricingPage() {
  return (
    <SiteChrome>
      <div className="wrap page-hero">
        <span className="eyebrow rv">Commission pricing</span>
        <h1 className="reveal-words">
          Honest prices, <em>set before</em> we begin.
        </h1>
        <p className="rv d2">
          Starting prices by medium. Final quotes depend on size, detail, and subjects — always
          agreed with you upfront.
        </p>
      </div>

      <section style={{ paddingTop: 20 }}>
        <div className="wrap">
          <div className="price-grid">
            {TIERS.map((t, i) => (
              <div
                key={t.tag}
                className={"price-card rv" + (i % 3 === 1 ? " d1" : i % 3 === 2 ? " d2" : "")}
              >
                <div className="cat">{t.days}</div>
                <h3>{t.tag}</h3>
                <div className="from">From {t.from}</div>
                <div className="lead">{t.lead}</div>
                <ul>
                  {t.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="exclusive">
        <div className="exc-border"></div>
        <div className="wrap" style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <span className="eyebrow rv">Corporate &amp; bulk</span>
          <h2 className="reveal-words" style={{ maxWidth: 760, margin: "14px auto 18px" }}>
            Gifting programmes &amp; events
          </h2>
          <p className="rv d2" style={{ margin: "0 auto 30px" }}>
            Custom artwork for offices, events, and gifting at scale — with dedicated timelines and
            pricing.
          </p>
          <Link className="btn btn-gold rv d3" to="/contact">
            <span>Enquire about bulk orders</span>
          </Link>
        </div>
      </section>
    </SiteChrome>
  );
}
