import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/terms-and-conditions")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | The Artspire" },
      {
        name: "description",
        content:
          "The terms that apply when you order a ready-made piece or commission bespoke art from The Artspire, Lucknow.",
      },
      { name: "robots", content: "index, follow" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      intro="The agreement between you and the studio when you buy or commission a piece."
      updated="29 July 2026"
    >
      <p>
        These terms apply to everything sold on this website. By placing an order or submitting a
        commission enquiry you agree to them. The studio is operated from Lucknow, Uttar Pradesh,
        India.{" "}
        <b>
          [NEEDS CONFIRMATION: the registered legal entity name, proprietor name, full registered
          address, and GSTIN if registered — required for Razorpay activation and invoices.]
        </b>
      </p>

      <h2>What we sell</h2>
      <ul>
        <li>
          <b>Ready-made pieces</b> listed in the shop — finished objects, made by hand, usually one
          of a kind or in very small editions.
        </li>
        <li>
          <b>Bespoke commissions</b> — pieces made to your brief, from your photograph or idea.
        </li>
      </ul>
      <p>
        Because every piece is handmade, small variations in colour, texture, grain, and finish are
        inherent to the work and are not defects. Photographs on the site are true to the piece but
        screens differ.
      </p>

      <h2>How a commission works</h2>
      <ol>
        <li>You share your idea, photograph, budget, size, and the date you need it by.</li>
        <li>
          Himangi replies with a proposed approach, a timeline, and a price.{" "}
          <b>No payment is taken until you approve that plan.</b>
        </li>
        <li>You approve the details. Work then begins.</li>
        <li>You receive a preview before the piece is finished and packed.</li>
      </ol>
      <p>
        Timelines are estimates made in good faith and depend on the medium — typically 5–14 days
        depending on the piece. Handmade work occasionally takes longer; we will always tell you as
        soon as we know.
      </p>

      <h2>Prices and payment</h2>
      <p>
        All prices are in Indian Rupees (₹). Payment is taken through Razorpay, which supports UPI,
        cards, and netbanking. Cash on delivery is not available. We may correct an obvious pricing
        error before dispatch; if we do, we will contact you first and you may cancel.{" "}
        <b>[NEEDS CONFIRMATION: whether prices include GST, and your GST rate if applicable.]</b>
      </p>

      <h2>Cancellations, returns, and shipping</h2>
      <p>
        Ready-made pieces may be returned within 7 days if unused and undamaged. Bespoke commissions
        are made to order and cannot be returned — which is why every detail is approved before work
        starts. Full details are in our{" "}
        <Link to="/refund-and-cancellation-policy">Refund &amp; Cancellation Policy</Link> and{" "}
        <Link to="/shipping-policy">Shipping Policy</Link>.
      </p>

      <h2>Intellectual property</h2>
      <p>
        Himangi Pandey retains copyright in every piece she makes, and in the photographs and text
        on this website. Buying a piece gives you ownership of that physical object, not the right
        to reproduce, mass-produce, or commercially exploit the artwork.
      </p>
      <p>
        When you send a reference photograph you confirm you have the right to share it, and you
        give the studio permission to use it solely to create your piece. We will not publish it or
        use it in marketing without asking you first.
      </p>

      <h2>Your responsibilities</h2>
      <ul>
        <li>Give us an accurate delivery address and a phone number we can reach you on.</li>
        <li>Tell us before work begins if your deadline is fixed and cannot move.</li>
        <li>Do not ask for work that infringes someone else&apos;s copyright.</li>
      </ul>

      <h2>Liability</h2>
      <p>
        We take care with every piece and insure every shipment. Our responsibility is limited to
        the value of the piece you paid for. We are not liable for delays caused by couriers,
        weather, or other events outside our control, though we will always help you resolve them.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of India, and disputes are subject to the jurisdiction
        of the courts at Lucknow, Uttar Pradesh.{" "}
        <b>[NEEDS CONFIRMATION: that Lucknow is the jurisdiction you want stated.]</b>
      </p>

      <h2>Grievance officer</h2>
      <p>
        Under the Consumer Protection (E-Commerce) Rules, 2020, a grievance officer must be named
        with contact details and a response timeline.{" "}
        <b>
          [NEEDS CONFIRMATION: grievance officer name and designation. Complaints must be
          acknowledged within 48 hours and resolved within one month of receipt.]
        </b>
      </p>
    </LegalPage>
  );
}
