"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { site } from "@/content/site";

const EASE = [0.16, 1, 0.3, 1] as const;

type Status = "idle" | "submitting" | "success" | "error";

const fieldClass =
  "w-full border-b u-hairline bg-transparent py-3 text-ink placeholder:text-stone/70 focus:border-terracotta focus:outline-none transition-colors duration-300";

export default function ContactForm() {
  const { contact, brand } = site;
  const { form } = contact;
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const el = e.currentTarget;
    const data = new FormData(el);

    // Client-side validation: name, business and message are required.
    const nextErrors: Record<string, string> = {};
    for (const field of ["name", "business", "message"]) {
      if (!String(data.get(field) ?? "").trim()) {
        nextErrors[field] = form.requiredError;
      }
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch(contact.formspreeEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!res.ok) throw new Error(`Form submit failed: ${res.status}`);
      setStatus("success");
      el.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="border u-hairline p-10 md:p-14"
          >
            <p aria-hidden className="font-display text-5xl text-terracotta">
              ✓
            </p>
            <h2 className="mt-6 font-display text-3xl tracking-[-0.02em] text-ink md:text-4xl">
              {form.successTitle}
            </h2>
            <p className="mt-4 text-stone">{form.successMessage}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={false}
            exit={{ opacity: 0, y: -16 }}
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-8"
          >
            <div>
              <label htmlFor="name" className="u-label text-stone">
                {form.nameLabel} *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder={form.namePlaceholder}
                className={fieldClass}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="u-label mt-2 text-terracotta">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="business" className="u-label text-stone">
                {form.businessLabel} *
              </label>
              <input
                id="business"
                name="business"
                type="text"
                autoComplete="organization"
                placeholder={form.businessPlaceholder}
                className={fieldClass}
                aria-invalid={!!errors.business}
              />
              {errors.business && (
                <p className="u-label mt-2 text-terracotta">{errors.business}</p>
              )}
            </div>

            <div>
              <label htmlFor="website" className="u-label text-stone">
                {form.websiteLabel}
              </label>
              <input
                id="website"
                name="website"
                type="text"
                autoComplete="url"
                placeholder={form.websitePlaceholder}
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="budget" className="u-label text-stone">
                {form.budgetLabel}
              </label>
              <select
                id="budget"
                name="budget"
                defaultValue={contact.budgetOptions[0]}
                className={`${fieldClass} appearance-none rounded-none`}
              >
                {contact.budgetOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="message" className="u-label text-stone">
                {form.messageLabel} *
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder={form.messagePlaceholder}
                className={`${fieldClass} resize-y`}
                aria-invalid={!!errors.message}
              />
              {errors.message && (
                <p className="u-label mt-2 text-terracotta">{errors.message}</p>
              )}
            </div>

            {status === "error" && (
              <p className="border u-hairline p-4 text-sm text-terracotta">
                {form.errorMessage}{" "}
                <a
                  href={`mailto:${brand.email}`}
                  className="u-underline-sweep font-medium text-ink"
                >
                  {brand.email}
                </a>
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="group relative inline-flex w-fit items-center gap-2 overflow-hidden rounded-full border border-ink bg-ink px-8 py-4 u-label text-ivory transition-opacity disabled:opacity-60"
            >
              <span
                aria-hidden
                className="absolute inset-0 origin-bottom scale-y-0 bg-terracotta transition-transform duration-300 ease-studio group-hover:scale-y-100 motion-reduce:transition-none"
              />
              <span className="relative z-10">
                {status === "submitting" ? "SENDING…" : form.submitLabel}
              </span>
              <span
                aria-hidden
                className="relative z-10 transition-transform duration-300 ease-studio group-hover:translate-x-1 motion-reduce:transition-none"
              >
                →
              </span>
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
