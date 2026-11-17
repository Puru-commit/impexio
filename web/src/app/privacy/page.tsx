import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { SITE } from "@/lib/site-config";

export const metadata: Metadata = { title: "Privacy Policy — IMPEXIO" };

export default function Page() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      updated={SITE.updated}
      sections={[
        {
          h: "Who we are",
          p: [
            `${SITE.name} is operated by ${SITE.legalName}. This policy explains what information we collect when you use our website and app, and how we use it.`,
          ],
        },
        {
          h: "Information we collect",
          p: ["We collect only what we need to run the service:"],
          list: [
            "Account details: your name and email address, including those provided when you sign in with Google.",
            "Business details you enter: company name, address, tax details, bank details for documents, and the buyers and suppliers you save.",
            "Documents and records you create in IMPEXIO.",
            "Product descriptions you type into the HS Code tool.",
            "Basic usage and device information, such as pages visited, to keep the service working and secure.",
          ],
        },
        {
          h: "How we use it",
          p: ["We use your information to:"],
          list: [
            "Create your account and let you sign in.",
            "Generate and store your documents and records.",
            "Provide HS Code suggestions.",
            "Process subscription payments and send receipts.",
            "Respond to your messages and improve the service.",
          ],
        },
        {
          h: "Payments",
          p: [
            "Payments are processed by Razorpay. We do not see or store your full card, UPI or bank details. Razorpay handles them under its own privacy policy.",
          ],
        },
        {
          h: "Sign-in with Google",
          p: [
            "If you sign in with Google, we receive your name, email address and profile picture from Google. We do not receive your Google password and we do not read your Google emails or files.",
          ],
        },
        {
          h: "AI features",
          p: [
            "When you use the HS Code tool, the product description you type is sent to an AI service to produce suggestions. Do not enter confidential details in that box.",
          ],
        },
        {
          h: "Who can see your data",
          p: [
            "Each account can only access its own documents, contacts and records. We do not sell your personal information. We share it only with service providers that help us run IMPEXIO (such as hosting, email and payment providers), or when the law requires it.",
          ],
        },
        {
          h: "Cookies",
          p: [
            "We use cookies that are needed to keep you signed in and to keep the service secure.",
          ],
        },
        {
          h: "How long we keep data",
          p: [
            "We keep your data while your account is active. You can ask us to delete your account and data at any time, except where we must keep some records by law.",
          ],
        },
        {
          h: "Your choices",
          p: [
            "You can ask to see, correct or delete the personal information we hold about you by writing to us.",
          ],
        },
        {
          h: "Contact us",
          p: [`Write to ${SITE.email} with any privacy question.`],
        },
      ]}
    />
  );
}
