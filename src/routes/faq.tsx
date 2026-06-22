import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, MessageCircle } from "lucide-react";
import { Layout } from "../components/Layout";
import { waLink } from "../lib/whatsapp";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSection {
  title: string;
  items: FaqItem[];
}

const sections: FaqSection[] = [
  {
    title: "Ordering & Process",
    items: [
      { question: "How do I place an order for a custom artwork?", answer: "Simply WhatsApp us your photo, tell us the artwork type you want (sketch, portrait, painting, mirror art or clay), your preferred size, and your deadline. We'll confirm the details and send you a quote within 2 hours." },
      { question: "What type of photo should I send?", answer: "A clear, well-lit photo with visible facial details works best. Natural daylight photos give the best results. Avoid blurry, pixelated, or heavily filtered photos. If you only have an old photo, send it anyway — we'll let you know if it works." },
      { question: "Can you combine two people from different photos into one portrait?", answer: "Yes. We can merge multiple reference photos into a single composition as long as the faces are clearly visible in each photo." },
      { question: "Is the artwork made by hand or is it AI-generated?", answer: "Every artwork at Artspire is 100% handmade by the artist. We do not use AI tools, digital filters, or print-on-demand. Each piece is drawn or painted from scratch using traditional art materials." },
      { question: "Can I see the artwork before it is shipped?", answer: "Yes. We share a preview photo or video of the completed artwork before dispatch. You can request changes at this stage — we will not ship until you are happy." },
    ],
  },
  {
    title: "Pricing & Payment",
    items: [
      { question: "How much does a custom artwork cost?", answer: "Pricing depends on the artwork type, size, number of faces, and complexity. Pencil sketches start from Rs 999. Colour portraits start from Rs 1,999. Paintings start from Rs 2,999. WhatsApp us your photo for an exact quote." },
      { question: "How do I make the payment?", answer: "We accept UPI, Razorpay (cards, net banking, wallets), and bank transfer. 50% advance is required to start your order. Balance is due before shipping." },
      { question: "Do you offer any discounts for bulk or corporate orders?", answer: "Yes. We offer special pricing for bulk orders of 5 or more pieces. WhatsApp us with your requirements for a custom corporate quote." },
    ],
  },
  {
    title: "Delivery & Shipping",
    items: [
      { question: "How long does it take to complete an artwork?", answer: "Standard delivery is 5 to 14 days depending on artwork type and complexity. Pencil sketches: 5 to 7 days. Colour portraits: 7 to 10 days. Paintings: 10 to 14 days. Express delivery is available in 3 to 7 days at additional cost." },
      { question: "Do you ship across India?", answer: "Yes. We deliver to every pin code in India via premium courier with full tracking. Typical shipping time after dispatch is 2 to 4 business days." },
      { question: "How is the artwork packaged?", answer: "Every artwork is packed in a rigid, protective tube or flat mailer to prevent bending or damage. Framing options are available on request." },
    ],
  },
  {
    title: "Revisions & Guarantee",
    items: [
      { question: "What if I am not happy with the artwork?", answer: "We offer free revisions until you are satisfied, before the artwork is shipped. If you receive a damaged or incorrect artwork, we will remake it at no cost within 7 days of delivery." },
      { question: "How many revisions are included?", answer: "Unlimited revisions are included before shipping. We work with you until you love the result." },
      { question: "What is your refund policy?", answer: "Since every artwork is made to order, we do not offer cash refunds after work has begun. However if there is a quality issue or damage on delivery, we will remake the artwork at no cost." },
    ],
  },
  {
    title: "Special Occasions",
    items: [
      { question: "Can I order a custom portrait as an anniversary gift?", answer: "Yes — anniversary portraits are one of our most popular requests. Couple sketches and colour portraits make deeply meaningful anniversary gifts. Mention your occasion when you WhatsApp us and we will suggest the best artwork type and size." },
      { question: "Do you make memorial portraits of deceased loved ones?", answer: "Yes. We handle memorial artwork with full care and sensitivity. Please send us the clearest photo available. We understand how precious these memories are and treat every memorial commission with the respect it deserves." },
      { question: "Can I order a last-minute gift?", answer: "Express delivery is available. WhatsApp us your deadline and we will tell you honestly whether it is achievable. We never compromise on quality to rush an order." },
      { question: "Do you do corporate gifting?", answer: "Yes. Custom portraits, framed sketches and clay miniatures make unique corporate gifts. We offer bulk pricing and can include your company branding on packaging. WhatsApp us for a corporate quote." },
    ],
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: sections.flatMap((section) =>
    section.items.map((item) => ({
      "@type": "Question" as const,
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: item.answer,
      },
    }))
  ),
};

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border/50 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
        aria-expanded={isOpen}
      >
        <span className="font-body text-[14px] md:text-[15px] font-medium text-forest leading-snug group-hover:text-gold transition-colors">
          {item.question}
        </span>
        <span className={`mt-0.5 flex-shrink-0 text-forest transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
          <ChevronDown size={18} />
        </span>
      </button>
      <div className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <p className="font-body text-[13px] md:text-[14px] text-stone leading-relaxed pb-5">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ | Artspire" },
      { name: "description", content: "Find answers to frequently asked questions about ordering custom handmade art from Artspire." },
      { property: "og:title", content: "FAQ | Artspire" },
      { property: "og:description", content: "Find answers to frequently asked questions about ordering custom handmade art from Artspire." },
      { property: "og:type", content: "website" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(faqJsonLd) }],
  }),
  component: FaqPage,
});

function FaqPage() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const toggle = (key: string) => setOpenKey((prev) => (prev === key ? null : key));

  return (
    <Layout>
      <section className="section-padding bg-cream text-center">
        <div className="container-main">
          <p className="font-body text-[11px] md:text-[12px] font-semibold text-gold mb-4 uppercase tracking-[0.25em]">Support</p>
          <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-forest font-medium">Frequently Asked Questions</h1>
          <p className="font-body text-[14px] md:text-[16px] text-stone mt-4 max-w-lg mx-auto">Everything you need to know before ordering your custom artwork.</p>
        </div>
      </section>

      <section className="pb-12 md:pb-16">
        <div className="container-main max-w-[800px]">
          {sections.map((section) => (
            <div key={section.title} className="mb-8 md:mb-10">
              <h2 className="font-display text-[20px] md:text-[22px] text-forest font-medium mb-4">{section.title}</h2>
              <div className="bg-white rounded-xl border border-border/40 px-5 md:px-6">
                {section.items.map((item) => {
                  const key = `${section.title}::${item.question}`;
                  return (
                    <AccordionItem
                      key={key}
                      item={item}
                      isOpen={openKey === key}
                      onToggle={() => toggle(key)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-padding bg-forest text-center">
        <div className="container-main max-w-2xl">
          <h2 className="font-display text-[24px] md:text-[28px] text-white font-medium mb-3">Still have a question?</h2>
          <p className="font-body text-[14px] md:text-[16px] text-cream/70 mb-8">We reply within 2 hours on WhatsApp.</p>
          <a
            href={waLink("Hi Artspire! I have a question about ordering a custom artwork.")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-brand-whatsapp text-white font-body font-bold text-[14px] tracking-wide px-8 py-3.5 rounded-full hover:shadow-lg transition-shadow active-scale btn-whatsapp"
          >
            <MessageCircle size={18} />
            Chat With Us on WhatsApp
          </a>
        </div>
      </section>
    </Layout>
  );
}
