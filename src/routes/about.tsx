import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "../components/Layout";
import { waLink } from "../lib/whatsapp";

const beliefs = [
  "I believe in authenticity. Every piece is made by hand — never printed, never machine-made.",
  "I believe in personal connection. From your first message to delivery, you speak directly to me.",
  "I believe in quality over convenience. If it doesn't feel right, I start over.",
];

const trust = ["11+ Years", "1000+ Memories Created", "One Pair of Hands", "Handcrafted"];

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About | Artspire" }, { name: "description", content: "Meet Himangi — the artist behind Artspire and the philosophy behind every handcrafted piece." }] }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <Layout>
      {/* PHASE 1 - Interest */}
      <section className="px-6 pt-12 pb-10">
        <p className="font-body text-[12px] font-semibold text-gold-accent mb-4 uppercase tracking-[0.2em] text-center">
          The Artist Behind Artspire
        </p>
        <div className="aspect-[4/3] bg-surface-variant rounded-xl flex items-center justify-center mb-8">
          <span className="font-accent italic text-gold-accent/70 text-[13px]">Artist portrait</span>
        </div>
        <h1 className="font-display text-[30px] leading-[1.2] text-primary font-medium mb-5">
          Every artwork begins with a story. Yours.
        </h1>
        <p className="font-body text-[14px] leading-relaxed text-on-surface-variant mb-8">
          Some memories arrive without warning — a glance across a room, a child's first step, the way afternoon light falls across your grandmother's hands. These moments deserve more than a camera roll. The most meaningful gifts are not bought — they are created.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-body text-[10px] uppercase tracking-[0.15em] text-on-surface-variant text-center">
          {trust.map((t, i) => (
            <span key={t} className="flex items-center gap-2">
              {t}
              {i < trust.length - 1 && <span className="text-gold-accent">·</span>}
            </span>
          ))}
        </div>
      </section>

      {/* PHASE 2 - Connection */}
      <section className="px-6 py-10 bg-surface-container">
        <h2 className="font-display text-[24px] text-primary font-medium mb-4">Why Artspire Exists</h2>
        <p className="font-body text-[14px] leading-relaxed text-on-surface-variant mb-10">
          Think about the last time you wanted to give someone something truly original. Not something pulled from a shelf. Not a name stamped on a mug. Something that captured them — the way they laugh, the memory that still makes your chest ache. That gap — between wanting something deeply personal and finding a way to create it — is exactly where Artspire was born.
        </p>

        <h2 className="font-display text-[24px] text-primary font-medium mb-5">What I Believe</h2>
        <div className="flex flex-col gap-4">
          {beliefs.map((b, i) => (
            <div key={i} className="bg-background border-l-4 border-gold-accent rounded-r-md p-4">
              <p className="font-body text-[13px] leading-relaxed text-on-surface">{b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PHASE 3 - Trust */}
      <section className="px-6 py-10">
        <h2 className="font-display text-[24px] text-primary font-medium mb-4">The Night I Started Over</h2>
        <p className="font-body text-[14px] leading-relaxed text-on-surface-variant mb-10">
          A client needed a portrait — a birthday gift for a local MLA. Timeline: seven days. By day six, the portrait was nearly finished. But something felt wrong. Not wrong in a way a client would notice. Wrong in a way only the artist can feel. I faced a choice: deliver what I had, or admit it wasn't good enough. I chose to start over. Entirely. When he saw the final portrait, he held it — and handed me an additional ₹1,000. Voluntarily. "This," he said, "is what I wanted."
        </p>

        <h2 className="font-display text-[24px] text-primary font-medium mb-4">Why Clients Return</h2>
        <p className="font-body text-[14px] leading-relaxed text-on-surface-variant">
          Trust is not built through marketing. When you describe the way your father's eyes crinkle when he laughs, I hear it from you directly. Over 1,000 completed artworks have taught me what lasts.
        </p>
      </section>

      <section className="bg-deep-forest px-8 py-14 text-center">
        <h2 className="font-display text-[26px] text-white leading-tight mb-3">Tell Me Your Idea</h2>
        <p className="font-body text-[14px] text-white/70 mb-6 leading-relaxed">
          You don't need a plan. Just a memory that matters.
        </p>
        <a
          href={waLink("Hi Himangi, I have an idea I'd love to share with you.")}
          className="inline-block bg-gold-accent text-deep-forest font-body font-bold text-[14px] tracking-wide px-8 py-3 rounded-full active-scale"
        >
          Start Your Conversation
        </a>
      </section>
    </Layout>
  );
}
