import { useState, type FormEvent } from "react";
import { FiCheck } from "react-icons/fi";

import { FadeIn } from "@/components/motion-primitives";
import { Button } from "@/components/ui/button";
import type { Messages } from "@/i18n/ui";

type Field =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "company"
  | "message";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm({ t }: { t: Messages["contact"] }) {
  const f = t.form;
  const [values, setValues] = useState<Record<Field, string>>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  const set = (field: Field, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validate = () => {
    const next: Partial<Record<Field, string>> = {};
    if (!values.firstName.trim()) next.firstName = f.required;
    if (!values.lastName.trim()) next.lastName = f.required;
    if (!values.email.trim()) next.email = f.required;
    else if (!EMAIL_RE.test(values.email)) next.email = f.invalidEmail;
    if (!values.phone.trim()) next.phone = f.required;
    if (!values.company.trim()) next.company = f.required;
    if (!values.message.trim()) next.message = f.required;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending" || !validate()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <FadeIn className="flex flex-col items-center gap-4 rounded-3xl md:rounded-[3rem] bg-background px-8 py-20 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-primary/15 text-primary">
          <FiCheck className="size-7" />
        </span>
        <p className="text-lg text-foreground">{f.success}</p>
      </FadeIn>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-5 rounded-3xl md:rounded-[3rem] bg-background p-6 sm:p-10"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id="firstName"
          label={f.firstName}
          placeholder={f.firstNamePlaceholder}
          value={values.firstName}
          error={errors.firstName}
          onChange={(v) => set("firstName", v)}
          required
          className="col-span-2 md:col-span-1"
        />
        <TextField
          id="lastName"
          label={f.lastName}
          placeholder={f.lastNamePlaceholder}
          value={values.lastName}
          error={errors.lastName}
          onChange={(v) => set("lastName", v)}
          required
          className="col-span-2 md:col-span-1"
        />
        <TextField
          id="email"
          type="email"
          label={f.email}
          placeholder={f.emailPlaceholder}
          value={values.email}
          error={errors.email}
          onChange={(v) => set("email", v)}
          required
          className="col-span-2"
        />
        <TextField
          id="phone"
          type="tel"
          label={f.phone}
          placeholder={f.phonePlaceholder}
          value={values.phone}
          error={errors.phone}
          onChange={(v) => set("phone", v)}
          required
          className="col-span-2"
        />
        <TextField
          id="company"
          label={f.company}
          placeholder={f.companyPlaceholder}
          value={values.company}
          error={errors.company}
          onChange={(v) => set("company", v)}
          required
          className="col-span-2"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm text-foreground/70">
          {f.message}
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder={f.messagePlaceholder}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          aria-invalid={!!errors.message}
          className="rounded-3xl resize-none border border-white/10 bg-background/60 px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-foreground/30 focus:border-primary/60"
        />
        {errors.message ? (
          <span className="text-sm text-red-400">{errors.message}</span>
        ) : null}
      </div>

      {status === "error" ? (
        <p className="text-sm text-red-400" role="alert">
          {f.error}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={status === "sending"}
        variant="primary"
        size="md"
        className="mt-2 self-end"
      >
        {status === "sending" ? f.sending : f.submit}
      </Button>
    </form>
  );
}

function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  type = "text",
  required = false,
  className = "",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-sm text-foreground/70">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        className="rounded-full border border-white/10 bg-background/60 px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-foreground/30 focus:border-primary/60"
      />
      {error ? <span className="text-sm text-red-400">{error}</span> : null}
    </div>
  );
}
