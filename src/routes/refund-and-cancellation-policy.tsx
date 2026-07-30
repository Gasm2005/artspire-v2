import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/refund-and-cancellation-policy")({
  head: () => ({
    meta: [
      { title: "Refund & Cancellation Policy | The Artspire" },
      {
        name: "description",
        content:
          "Returns within 7 days on ready-made pieces, our free-remake guarantee on damaged artwork, and how refunds are processed.",
      },
      { name: "robots", content: "index, follow" },
    ],
  }),
  component: RefundPolicyPage,
});

function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund & Cancellation Policy"
      intro="What happens if you change your mind, or if a piece arrives damaged."
      updated="29 July 2026"
    >
      <h2>Ready-made shop pieces</h2>
      <p>
        You may return a ready-made piece within <b>7 days</b> of delivery, provided it is unused
        and undamaged, and is returned in its original packaging. Tell us within those 7 days using
        the contact details below and we will confirm the return address.
      </p>

      <h2>Bespoke commissions</h2>
      <p>
        Commissioned pieces are made to order for one person and{" "}
        <b>cannot be returned or refunded</b> once work has begun. This is why we approve every
        detail with you first — the approach, the size, the timeline, and the price — and why you
        receive a preview before the piece is finished. No payment is taken until you have approved
        the plan.
      </p>
      <p>
        If you cancel <b>before</b> work has begun, you are refunded in full. If you cancel after
        work has begun, we will discuss a fair settlement based on the materials and time already
        committed.{" "}
        <b>
          [NEEDS CONFIRMATION: whether you want a fixed rule here (e.g. 50% retained once work has
          started) instead of case-by-case.]
        </b>
      </p>

      <h2>Damaged, faulty, or wrong artwork — our 7-day guarantee</h2>
      <p>
        If your piece arrives damaged, faulty, or is not what you ordered, we will{" "}
        <b>remake it free of charge</b>. Please tell us within 7 days of delivery and send
        photographs of the piece and the packaging — that helps us claim on the shipment insurance
        and make the replacement quickly. You will not pay for return shipping in this case.
      </p>

      <h2>How refunds are processed</h2>
      <p>
        Approved refunds are returned through Razorpay to the original payment method — we cannot
        refund to a different card or account. Once we approve a refund, Razorpay and your bank
        typically take <b>5–7 business days</b> to credit it.{" "}
        <b>
          [NEEDS CONFIRMATION: your intended approval window, e.g. &ldquo;refunds approved within 3
          business days of the returned piece arriving&rdquo;.]
        </b>
      </p>
      <p>
        Shipping charges are refunded when the return is our fault (damaged, faulty, or wrong item).
        For a change-of-mind return, the original shipping charge is not refunded.{" "}
        <b>[NEEDS CONFIRMATION: who pays return postage on a change-of-mind return.]</b>
      </p>

      <h2>Cancelling an order before dispatch</h2>
      <p>
        Ready-made pieces can be cancelled any time before dispatch for a full refund — message us
        as soon as possible. Dispatch is usually 3–5 business days, so cancellations are rarely a
        problem. See our <Link to="/shipping-policy">Shipping Policy</Link> for timelines.
      </p>

      <h2>Non-returnable items</h2>
      <ul>
        <li>Bespoke commissions, once work has begun.</li>
        <li>Personalised pieces carrying a name, date, or custom message.</li>
        <li>Pieces damaged by misuse, or by moisture or direct sunlight after delivery.</li>
      </ul>

      <p>Nothing in this policy limits your rights under the Consumer Protection Act, 2019.</p>
    </LegalPage>
  );
}
