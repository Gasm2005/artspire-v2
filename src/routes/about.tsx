import { createFileRoute, Link } from "@tanstack/react-router";
import { getPageSEO, getWebsiteContent, type WebsiteContent } from "@/lib/website-content";
import { SiteChrome } from "@/components/site/SiteChrome";

export const Route = createFileRoute("/about")({
  loader: async () => {
    const [seo, content] = await Promise.all([
      getPageSEO("about").catch(() => ({ title: null, description: null, ogImage: null })),
      getWebsiteContent({ page: "about", activeOnly: true }).catch(() => []),
    ]);
    return { seo, content: content as WebsiteContent[] };
  },
  head: ({ loaderData }) => {
    const seo = loaderData?.seo;
    return {
      meta: [
        { title: seo?.title ?? "Our Story | The Artspire" },
        {
          name: "description",
          content:
            seo?.description ??
            "Meet Himangi — the artist behind The Artspire and the philosophy behind every handcrafted piece.",
        },
        ...(seo?.ogImage ? [{ property: "og:image", content: seo.ogImage }] : []),
      ],
    };
  },
  component: AboutPage,
});

function AboutPage() {
  const { content } = Route.useLoaderData();
  const cv = (key: string, fallback: string) =>
    content.find((c) => c.content_key === key)?.value_text ?? fallback;

  return (
    <SiteChrome>
      <div className="wrap page-hero">
        <span className="eyebrow rv">Our story</span>
        <h1 className="reveal-words">
          One artist. <em>One pair</em> of hands.
        </h1>
        <p className="rv d2">
          {cv(
            "about.intro",
            "The Artspire is a studio, not a factory. Everything here is made slowly, deliberately, and by hand.",
          )}
        </p>
      </div>

      <section className="artist" style={{ paddingTop: 20 }}>
        <div className="wrap artist-grid">
          <div className="frame tilt" data-label="Portrait of Himangi at work"></div>
          <div>
            <span className="eyebrow rv">The hands behind The Artspire</span>
            <h2 className="reveal-words">Hi, I'm Himangi.</h2>
            <p className="rv d2">
              {cv(
                "about.body1",
                "For over eleven years, I've shaped objects and portraits by hand from my studio in Lucknow. It started with pencil and paper, and grew into clay, cement, wood, and light.",
              )}
            </p>
            <p className="rv d3">
              {cv(
                "about.body2",
                "Every piece — whether it leaves the shop or begins as your idea — is drawn, thrown, or carved by me alone. I keep the numbers small on purpose. It's the only way each piece gets the attention it deserves.",
              )}
            </p>
            <div className="sign rv d3">— Himangi Pandey</div>
          </div>
        </div>
      </section>

      <div className="band">
        <div className="wrap brow">
          <span>Made by hand</span>
          <i>◆</i>
          <span>One of a kind</span>
          <i>◆</i>
          <span>Kept for a lifetime</span>
        </div>
      </div>

      <section className="cats">
        <div className="wrap">
          <div
            className="sec-head"
            style={{
              justifyContent: "center",
              textAlign: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span className="eyebrow rv">What we believe</span>
            <h2 className="reveal-words">Craft, before everything</h2>
          </div>
          <div className="steps">
            <div className="step rv">
              <div className="no">◆</div>
              <h3>Slow by design</h3>
              <p>We make in small numbers so nothing is rushed. Time is part of the craft.</p>
            </div>
            <div className="step rv d1">
              <div className="no">◆</div>
              <h3>Truly one of a kind</h3>
              <p>No moulds, no assembly line. Small variations are the maker's signature.</p>
            </div>
            <div className="step rv d2">
              <div className="no">◆</div>
              <h3>Made to be kept</h3>
              <p>Objects and portraits meant to be lived with, and passed on.</p>
            </div>
            <div className="step rv d3">
              <div className="no">◆</div>
              <h3>Personal, always</h3>
              <p>You speak directly with the artist — from first idea to final piece.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="exclusive">
        <div className="exc-border"></div>
        <div className="wrap" style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <span className="eyebrow rv">Come closer</span>
          <h2 className="reveal-words" style={{ maxWidth: 720, margin: "14px auto 18px" }}>
            Browse the shop, or begin a commission.
          </h2>
          <div
            className="rv d3"
            style={{
              display: "flex",
              gap: 18,
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: 12,
            }}
          >
            <Link className="btn btn-gold" to="/shop">
              <span>Explore the Shop</span>
            </Link>
            <Link
              className="btn btn-solid"
              to="/services"
              style={{ borderColor: "var(--gold-soft)", color: "#EFE9DD" }}
            >
              <span>Request a Commission</span>
            </Link>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
