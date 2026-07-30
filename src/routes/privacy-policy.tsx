import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | The Artspire" },
      {
        name: "description",
        content:
          "How The Artspire collects, uses, and protects your personal information — orders, commissions, payments, and website analytics.",
      },
      { name: "robots", content: "index, follow" },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="What we collect, why we collect it, and what we never do with it."
      updated="29 July 2026"
    >
      <p>
        The Artspire is a one-artist studio in Lucknow. We collect the minimum needed to make your
        piece, deliver it, and answer your questions. We do not sell your personal information, and
        we do not share it for advertising.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>
          <b>Enquiries and commissions:</b> your name, phone/WhatsApp number, email (optional), and
          what you describe about the piece — including budget, size, and needed-by date.
        </li>
        <li>
          <b>Reference photographs:</b> if you attach photos to a commission enquiry, we store them
          privately. They are used only to make your piece. They are not public, not indexed, and
          not used in marketing without your explicit permission.
        </li>
        <li>
          <b>Orders:</b> name, phone, email, and shipping address; the items ordered; and a gift
          note if you add one.
        </li>
        <li>
          <b>Payments:</b> processed by Razorpay. Card, UPI, and bank details are entered on
          Razorpay&apos;s systems and are <b>never</b> stored on our servers. We keep only the
          payment reference and status.
        </li>
        <li>
          <b>Website usage:</b> pages viewed, approximate location (from IP), device and browser
          type, and how you moved through the site.
        </li>
      </ul>

      <h2>Cookies and analytics</h2>
      <p>We use the following third-party tools on our public pages (never in our admin area):</p>
      <ul>
        <li>
          <b>Google Analytics 4 / Google Tag Manager</b> — page views and shop events (product
          viewed, added to cart, checkout started, purchase) to understand what people look for.
        </li>
        <li>
          <b>Microsoft Clarity</b> — heatmaps and <b>session recordings</b> of how visitors use the
          site. Recording runs with masking enabled, so text you type into form fields — phone,
          email, address — is hidden from the recording.
        </li>
        <li>
          <b>Vercel Analytics &amp; Speed Insights</b> — aggregate traffic and page-speed
          measurement.
        </li>
        <li>
          <b>Sentry</b> — error reporting, so we learn when something breaks. Error reports are
          scrubbed of email addresses, phone numbers, and addresses before they are sent.
        </li>
      </ul>
      <p>
        You can block these with your browser&apos;s privacy settings or an ad/tracker blocker; the
        site works normally without them.{" "}
        <b>
          [NEEDS CONFIRMATION: whether you want a cookie-consent banner. India&apos;s DPDP Act, 2023
          and EU/UK visitors may make prior consent advisable before analytics load.]
        </b>
      </p>

      <h2>Where your data is stored</h2>
      <p>
        Our website runs on Vercel and our database and file storage are provided by Supabase.
        Transactional email is sent through Resend. These providers process data on our behalf and
        may store it on servers outside India.{" "}
        <b>
          [NEEDS CONFIRMATION: the specific hosting region configured for your Supabase project.]
        </b>
      </p>

      <h2>How long we keep it</h2>
      <p>
        Order records are kept as long as needed for tax, accounting, and warranty purposes.
        Enquiries and reference photographs are kept while we are in conversation and for a
        reasonable period afterwards in case you return.{" "}
        <b>
          [NEEDS CONFIRMATION: a specific retention period, e.g. 8 years for order/tax records.]
        </b>{" "}
        You may ask us to delete your enquiry and photographs at any time.
      </p>

      <h2>Your rights</h2>
      <p>
        You may ask us to show you the personal information we hold about you, correct it, or delete
        it. Write to us using the details below and we will respond within a reasonable time. If you
        are unhappy with how we have handled your information, you may escalate to the relevant data
        protection authority.
      </p>

      <h2>Children</h2>
      <p>
        Our shop is intended for adults. We do not knowingly collect personal information from
        children. If a photograph you send includes a child, we treat it as we do every reference
        photograph — privately, and only to make the piece.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If we change this policy we will update the date below. Material changes will be highlighted
        on this page.
      </p>
    </LegalPage>
  );
}
