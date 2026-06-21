"use client";

import { useState } from "react";
import AboutCarousel from "./AboutCarousel";
import ServicesCarousel from "./ServicesCarousel";
import ProjectsBento from "./ProjectsBento";
import WhyGrid from "./WhyGrid";

const WHATSAPP_NUMBER = "923105926273"; // +92 310 5926273
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi UIM, I'd like to discuss a project."
)}`;

export function AboutOverlay() {
  return <AboutCarousel />;
}

export function ServicesOverlay() {
  return <ServicesCarousel />;
}

export function ProjectsOverlay() {
  return <ProjectsBento />;
}

export function WhyOverlay() {
  return <WhyGrid />;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldErrors = { name?: string; email?: string; project?: string };
type Status = "idle" | "sending" | "success";

export function ContactOverlay() {
  const [form, setForm] = useState({ name: "", email: "", project: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");

  const update = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  const validate = (): boolean => {
    const next: FieldErrors = {};
    if (form.name.trim().length < 2) next.name = "Please enter your name.";
    if (!EMAIL_RE.test(form.email.trim()))
      next.email = "Please enter a valid email address.";
    if (form.project.trim().length < 10)
      next.project = "Please tell us a little more (10+ characters).";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", project: "" });
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (res.status === 422 && data.errors) {
        setErrors(data.errors);
      } else {
        setServerError(data.error || "Something went wrong. Please try again.");
      }
      setStatus("idle");
    } catch {
      setServerError("Network error. Please try again.");
      setStatus("idle");
    }
  };

  return (
    <div className="pointer-events-auto w-full max-w-xl px-6">
      {/* Apple-style frosted glass card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white p-6 shadow-[0_30px_90px_rgba(0,0,0,0.18)] ring-1 ring-black/[0.05] sm:p-7">
        <h2 className="mb-5 text-center text-2xl font-semibold tracking-tight text-[#15171b] sm:text-3xl">
          Contact us
        </h2>

        {status === "success" ? (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366]/15 text-[#1a9e4b]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#15171b]">Message sent!</h3>
            <p className="mt-1 max-w-xs text-sm text-[#3a3d44]">
              Thanks for reaching out — we&apos;ll get back to you shortly.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-5 rounded-lg border border-black/15 bg-white/60 px-5 py-2 font-mono text-[11px] uppercase tracking-[0.3em] text-[#1a1d23]/80 transition-colors hover:border-black/40 hover:text-black"
            >
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="space-y-3">
            <Field
              label="Name"
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={update("name")}
              error={errors.name}
            />
            <Field
              label="Email"
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={update("email")}
              error={errors.email}
            />
            <div>
              <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-uim-blue/80">
                Project Description
              </label>
              <textarea
                rows={2}
                value={form.project}
                onChange={update("project")}
                placeholder="Tell us about your project…"
                className={`w-full resize-none rounded-xl border bg-white/60 px-4 py-3 text-sm text-[#15171b] outline-none transition-colors placeholder:text-black/35 focus:bg-white/80 ${
                  errors.project ? "border-red-400/80 focus:border-red-400" : "border-black/15 focus:border-uim-blue/60"
                }`}
              />
              {errors.project && (
                <p className="mt-1 text-[11px] text-red-500">{errors.project}</p>
              )}
            </div>

            {serverError && (
              <p className="rounded-lg bg-red-500/10 px-3 py-2 text-center text-[12px] text-red-600">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-xl bg-gradient-to-r from-uim-blue to-uim-cyan px-6 py-3.5 font-mono text-xs uppercase tracking-[0.4em] text-white shadow-[0_8px_24px_rgba(60,130,255,0.35)] transition-all duration-300 hover:shadow-[0_10px_30px_rgba(60,130,255,0.5)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "sending" ? "Sending…" : "Submit"}
            </button>
          </form>
        )}

        {/* divider */}
        <div className="my-4 flex items-center gap-3 text-black/40">
          <span className="h-px flex-1 bg-black/10" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em]">
            or
          </span>
          <span className="h-px flex-1 bg-black/10" />
        </div>

        {/* WhatsApp CTA */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(37,211,102,0.35)] transition-all duration-300 hover:shadow-[0_10px_30px_rgba(37,211,102,0.55)] active:scale-[0.99]"
        >
          <WhatsAppIcon className="h-5 w-5" />
          Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}

function Field({
  label,
  type,
  placeholder,
  value,
  onChange,
  error,
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-uim-blue/80">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-xl border bg-white/60 px-4 py-3 text-sm text-[#15171b] outline-none transition-colors placeholder:text-black/35 focus:bg-white/80 ${
          error ? "border-red-400/80 focus:border-red-400" : "border-black/15 focus:border-uim-blue/60"
        }`}
      />
      {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
    </div>
  );
}
