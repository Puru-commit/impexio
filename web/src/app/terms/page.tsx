import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { SITE } from "@/lib/site-config";

export const metadata: Metadata = { title: "Terms of Service — IMPEXIO" };

export default function Page() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      updated={SITE.updated}
      sections={[
        {
          h: "Agreement",
          p: [
            `By creating an account or using ${SITE.name}, you agree to these terms. If you do not agree, please do not use the service.`,
          ],
        },
        {
          h: "What IMPEXIO does",
          p: [
            "IMPEXIO helps you prepare export-import documents, costing sheets, letters and records from the information you enter, and offers HS Code suggestions.",
          ],
        },
        {
          h: "Not government or customs approved",
          p: [
            "Documents created with IMPEXIO are not approved, certified or endorsed by any government or customs authority. HS Code suggestions are guidance only and are not a legal classification. You are responsible for checking every document and code with your customs broker or the relevant authority before you use it.",
          ],
        },
        {
          h: "Your account",
          p: [
            "You are responsible for the activity on your account and for keeping your sign-in secure. Please give accurate information.",
          ],
        },
        {
          h: "Free trial and subscription",
          p: [
            `New accounts can create one document free. After that, a monthly plan of ${SITE.price} per month is needed to continue. Payments are made through Razorpay. Cancellation and refunds are explained in our Refund Policy.`,
          ],
        },
        {
          h: "Your content",
          p: [
            "You own the information and documents you create. You allow us to store and process them only to provide the service to you.",
          ],
        },
        {
          h: "Acceptable use",
          p: ["You agree not to:"],
          list: [
            "Use IMPEXIO for anything illegal or to deceive others.",
            "Try to access other users' data or break the service.",
            "Copy, resell or misuse the service or its content without permission.",
          ],
        },
        {
          h: "Availability",
          p: [
            "We work to keep IMPEXIO available but cannot promise it will always be uninterrupted or error-free. Features may change or be added over time.",
          ],
        },
        {
          h: "Limits of liability",
          p: [
            "IMPEXIO is provided as a tool to help you. To the extent allowed by law, we are not liable for losses that result from errors in documents or codes, shipment delays, customs decisions or business decisions you make using the service.",
          ],
        },
        {
          h: "Ending your account",
          p: [
            "You can stop using IMPEXIO and cancel your subscription at any time. We may suspend accounts that break these terms.",
          ],
        },
        {
          h: "Changes to these terms",
          p: [
            "We may update these terms. The date at the top shows the latest version. Continuing to use IMPEXIO means you accept the update.",
          ],
        },
        {
          h: "Contact",
          p: [`Questions about these terms? Write to ${SITE.email}.`],
        },
      ]}
    />
  );
}
