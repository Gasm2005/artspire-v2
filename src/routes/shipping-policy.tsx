import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/shipping-policy")({
  head: () => ({
    meta: [
      { title: "Shipping Policy | The Artspire" },
      {
        name: "description",
        content:
          "Insured pan-India shipping from Lucknow — dispatch timelines, how fragile pieces are packed, and how shipping is calculated.",
      },
      { name: "robots", content: "index, follow" },
    ],
  }),
  component: ShippingPolicyPage,
});

function ShippingPolicyPage() {
  return (
    <LegalPage
      title="Shipping Policy"
      intro="How your piece is packed, insured, and sent — and how long it takes."
      updated="29 July 2026"
    >
      <h2>Where we ship</h2>
      <p>
        We ship <b>across India</b>, from our studio in Lucknow. Every shipment is insured.
      </p>
      <p>
        <b>We do not currently ship internationally.</b> If you are outside India and would like a
        piece, message us and we will tell you honestly whether we can arrange it — we would rather
        say no than take an order we cannot fulfil.
      </p>

      <h2>Dispatch timelines</h2>
      <ul>
        <li>
          <b>Ready-made shop pieces:</b> dispatched within <b>3–5 business days</b> of your order.
        </li>
        <li>
          <b>Bespoke commissions:</b> made after your approval, typically <b>5–14 days</b> depending
          on the medium — pencil sketches are quickest, paintings and cast pieces take longest. You
          receive a timeline with your quote.
        </li>
      </ul>
      <p>
        Courier transit time is additional to dispatch time and varies by pincode.{" "}
        <b>
          [NEEDS CONFIRMATION: typical transit days for metro vs non-metro destinations, once your
          courier is chosen.]
        </b>
      </p>

      <h2>Shipping charges</h2>
      <p>
        Shipping is <b>calculated at checkout</b> based on the weight and size of your piece, using
        standard Indian courier practice (the greater of actual weight and volumetric weight).
        Fragile pieces — clay, cement, mirror, and glass — need heavier protective packing, which
        can affect the cost.
      </p>
      <p>
        <b>
          [NEEDS CONFIRMATION: final rate card. Current rates are placeholders pending the courier
          agreement.]
        </b>
      </p>

      <h2>How fragile pieces are packed</h2>
      <p>
        Clay, cement, mirror, and glass pieces are hand-packed in protective, recyclable materials
        and shipped insured, so they arrive exactly as they left the studio. If something does
        arrive damaged, we remake it free — see our{" "}
        <Link to="/refund-and-cancellation-policy">Refund &amp; Cancellation Policy</Link>.
      </p>

      <h2>Tracking your order</h2>
      <p>
        You can check your order any time on the <Link to="/track-order">Track Order</Link> page
        using your order number and the phone number you ordered with. We will also share courier
        tracking once your piece is dispatched.
      </p>

      <h2>Delivery problems</h2>
      <p>
        If a delivery is attempted and missed, the courier will normally try again. If a parcel is
        returned to us as undeliverable — a wrong address, or repeated failed attempts — we will
        contact you to arrange re-dispatch; the re-shipping cost would be payable again.{" "}
        <b>[NEEDS CONFIRMATION: whether you want to absorb re-dispatch cost once as goodwill.]</b>
      </p>
      <p>
        Please give us a phone number the courier can reach, and tell us about any building or gate
        access details that would help.
      </p>
    </LegalPage>
  );
}
