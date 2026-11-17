import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { SITE } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy — IMPEXIO",
};

export default function Page() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Refund & Cancellation Policy"
      updated={SITE.updated}
      sections={[
        {
          h: "Free trial",
          p: [
            "Every new account can create one document free, so you can try IMPEXIO before you pay.",
          ],
        },
        {
          h: "Subscription",
          p: [
            `The monthly plan costs ${SITE.price} per month and is paid through Razorpay.`,
          ],
        },
        {
          h: "Cancelling",
          p: [
            "You can cancel your subscription at any time from your account. After you cancel, you keep access until the end of the period you have already paid for, and you will not be charged again.",
          ],
        },
        {
          h: "Refunds",
          p: [
            "Because you can try IMPEXIO free before paying and cancel at any time, we do not refund a month that has already started.",
            "We will refund a payment in these cases:",
          ],
          list: [
            "You were charged more than once for the same period.",
            "You were charged but the subscription was not activated.",
            "You were charged after you cancelled.",
          ],
        },
        {
          h: "How to ask for a refund",
          p: [
            `Write to ${SITE.email} with your registered email and the payment details. We will review it and reply.`,
          ],
        },
        {
          h: "When refunds arrive",
          p: [
            "Approved refunds are sent to the original payment method through Razorpay. Banks can take several working days to show the money.",
          ],
        },
      ]}
    />
  );
}
