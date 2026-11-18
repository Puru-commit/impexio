"use client";

import { useActionState } from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { saveCompanyAction, type SaveState } from "./actions";
import type { CompanyValues } from "@/lib/company";

function Field({
  name,
  label,
  defaultValue,
  placeholder,
  wide = false,
}: {
  name: keyof CompanyValues;
  label: string;
  defaultValue: string;
  placeholder?: string;
  wide?: boolean;
}) {
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <span className="text-sm font-medium">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-brass focus:ring-2 focus:ring-brass/20"
      />
    </label>
  );
}

function Group({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-border bg-white/85 p-6 shadow-[0_20px_40px_-34px_rgba(11,16,32,0.4)] md:p-7">
      <h2 className="text-lg font-semibold">{title}</h2>
      {note && <p className="mt-1 text-sm text-muted-foreground">{note}</p>}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function CompanyForm({ initial }: { initial: CompanyValues }) {
  const [state, action, pending] = useActionState<SaveState, FormData>(saveCompanyAction, null);
  const f = (k: keyof CompanyValues) => initial[k];

  return (
    <form action={action} className="space-y-5">
      <Group title="Business">
        <Field wide name="companyName" label="Company name" defaultValue={f("companyName")} />
        <Field wide name="address" label="Address" defaultValue={f("address")} />
        <Field name="city" label="City" defaultValue={f("city")} />
        <Field name="state" label="State" defaultValue={f("state")} />
        <Field name="country" label="Country" defaultValue={f("country")} />
        <Field name="pincode" label="Pincode" defaultValue={f("pincode")} />
      </Group>

      <Group title="Contact">
        <Field name="phone" label="Phone" defaultValue={f("phone")} />
        <Field name="email" label="Company email" defaultValue={f("email")} />
        <Field wide name="website" label="Website" defaultValue={f("website")} />
      </Group>

      <Group title="Tax and registration" note="Shown on your documents where needed. All optional.">
        <Field name="gstin" label="GSTIN" defaultValue={f("gstin")} />
        <Field name="iecCode" label="IEC code" defaultValue={f("iecCode")} />
        <Field name="pan" label="PAN" defaultValue={f("pan")} />
      </Group>

      <Group title="Bank details" note="Used on invoices so your buyer knows where to pay.">
        <Field wide name="bankName" label="Bank name and branch" defaultValue={f("bankName")} />
        <Field name="bankAccountName" label="Account holder name" defaultValue={f("bankAccountName")} />
        <Field name="bankAccountNo" label="Account number" defaultValue={f("bankAccountNo")} />
        <Field name="bankIfsc" label="IFSC code" defaultValue={f("bankIfsc")} />
        <Field name="bankSwift" label="SWIFT code" defaultValue={f("bankSwift")} />
      </Group>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-ink px-7 py-3 text-sm font-medium text-paper transition-all hover:bg-primary active:scale-[0.98] disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save profile"}
        </button>
        {state && (
          <p
            role="status"
            className={`flex items-center gap-2 text-sm ${state.ok ? "text-[#2f7a4a]" : "text-vermilion"}`}
          >
            {state.ok ? <CheckCircle2 className="size-4" /> : <AlertTriangle className="size-4" />}
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
