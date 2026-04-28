"use client";

import { useEffect, useRef, useState } from "react";

import { FiX } from "react-icons/fi";
import { createPortal } from "react-dom";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type ContactModalType = "contact" | "partnership" | "sponsorship";

type ContactModalProps = {
  isOpen: boolean;
  type: ContactModalType;
  onClose: () => void;
};

/* ------------------------------------------------------------------ */
/*  WhatsApp config                                                    */
/* ------------------------------------------------------------------ */

const WA_PHONE = "6282249278506"; // +62 822-4927-8506 — Khilfa

function buildWaUrl(type: ContactModalType, data: FormData): string {
  let text = "";

  switch (type) {
    case "contact": {
      const name = data.get("name") as string;
      const message = data.get("message") as string;
      text = [
        `Halo, perkenalkan saya ${name}.`,
        `Saya menghubungi melalui halaman Contact di website dan ingin menyampaikan pesan berikut:`,
        message,
      ].join("\n");
      break;
    }
    case "partnership": {
      const fullName = data.get("fullName") as string;
      const institution = data.get("institution") as string;
      text = [
        `Halo, perkenalkan saya ${fullName} dari ${institution}.`,
        `Saya mendapatkan kontak ini dari website bagian partnership dan ingin menanyakan kemungkinan kerja sama dengan Lab PRODIGI.`,
        `Apabila berkenan, saya ingin berdiskusi lebih lanjut terkait peluang kolaborasi yang memungkinkan.`,
        `Terima kasih.`,
      ].join("\n");
      break;
    }
    case "sponsorship": {
      const fullName = data.get("fullName") as string;
      const institution = data.get("institution") as string;
      const program = data.get("program") as string;
      text = [
        `Halo, perkenalkan saya ${fullName} dari ${institution}.`,
        `Saya menghubungi melalui website dan tertarik untuk menjadi sponsor pada program ${program}.`,
        `Mohon informasi lebih lanjut terkait detail program serta peluang kerja sama sponsorship yang tersedia.`,
        `Terima kasih.`,
      ].join("\n");
      break;
    }
  }

  return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(text)}`;
}

/* ------------------------------------------------------------------ */
/*  Variant config                                                     */
/* ------------------------------------------------------------------ */

const variantConfig: Record<
  ContactModalType,
  {
    title: string;
    description: string;
    fields: Array<{
      name: string;
      label: string;
      placeholder: string;
      type: "input" | "textarea";
    }>;
  }
> = {
  contact: {
    title: "Get in touch",
    description:
      "Have a question? The Prodigi team is here to help you with any questions.",
    fields: [
      {
        name: "name",
        label: "Nama",
        placeholder: "e.g Ahmad Rahansuyu",
        type: "input",
      },
      {
        name: "message",
        label: "Message",
        placeholder: "How can our team can help you?",
        type: "textarea",
      },
    ],
  },
  partnership: {
    title: "Partnership",
    description:
      "Interested in collaborating with PRODIGI? Fill in the form and we'll get back to you.",
    fields: [
      {
        name: "fullName",
        label: "Full Name",
        placeholder: "e.g Ahmad Rahansuyu",
        type: "input",
      },
      {
        name: "institution",
        label: "Institution / Company",
        placeholder: "Your organization or company",
        type: "input",
      },
    ],
  },
  sponsorship: {
    title: "Sponsorship",
    description:
      "Support our programs and gain valuable exposure by becoming a sponsor.",
    fields: [
      {
        name: "fullName",
        label: "Full Name",
        placeholder: "e.g Ahmad Rahansuyu",
        type: "input",
      },
      {
        name: "institution",
        label: "Institution / Company",
        placeholder: "Your organization or company",
        type: "input",
      },
      {
        name: "program",
        label: "Program",
        placeholder: "Which program do you want to sponsor?",
        type: "input",
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ContactModal({
  isOpen,
  type,
  onClose,
}: ContactModalProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const firstInputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const config = variantConfig[type];

  /* SSR‑safe portal target */
  useEffect(() => {
    setHasMounted(true);
  }, []);

  /* Lock body scroll while open */
  useEffect(() => {
    if (!isOpen) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  /* Auto-focus first input */
  useEffect(() => {
    if (!isOpen) return;

    const timer = window.setTimeout(() => {
      firstInputRef.current?.focus();
    }, 80);

    return () => window.clearTimeout(timer);
  }, [isOpen]);

  /* Close on Escape */
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  /* Submit → open WhatsApp with pre-filled message */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const waUrl = buildWaUrl(type, formData);

    window.open(waUrl, "_blank", "noopener,noreferrer");
    onClose();
  };

  if (!hasMounted) return null;

  const portalTarget = document.body;

  return createPortal(
    <div
      className={`fixed inset-0 z-80 flex items-center justify-center bg-black/45 px-4 transition-opacity duration-300 ${
        isOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={config.title}
        className={`contact-modal-panel w-full max-w-md rounded-sm bg-white shadow-[0_20px_55px_rgba(0,0,0,0.22)] transition duration-300 ${
          isOpen
            ? "translate-y-0 scale-100"
            : "translate-y-3 scale-[0.97]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ─────────────────────────────────────── */}
        <div className="flex items-start justify-between px-6 pt-6 pb-0">
          <div className="pr-6">
            <h2 className="text-xl font-bold text-[#1d1d1d]">
              {config.title}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-black/60">
              {config.description}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="mt-0.5 inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-sm text-black/50 transition hover:bg-black/5 hover:text-black"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* ── Form ───────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="px-6 pt-5 pb-6">
          <div className="space-y-4">
            {config.fields.map((field, index) => (
              <div key={field.name}>
                <label
                  htmlFor={`contact-modal-${field.name}`}
                  className="mb-1.5 block text-sm font-medium text-[#1d1d1d]"
                >
                  {field.label}
                </label>

                {field.type === "textarea" ? (
                  <textarea
                    ref={
                      index === 0
                        ? (firstInputRef as React.RefObject<HTMLTextAreaElement>)
                        : undefined
                    }
                    id={`contact-modal-${field.name}`}
                    name={field.name}
                    placeholder={field.placeholder}
                    required
                    rows={4}
                    className="w-full resize-none rounded-sm border border-black/15 bg-white px-3 py-2.5 text-sm text-[#1d1d1d] outline-none transition placeholder:text-black/35 focus:border-[#ffc91f] focus:ring-1 focus:ring-[#ffc91f]"
                  />
                ) : (
                  <input
                    ref={
                      index === 0
                        ? (firstInputRef as React.RefObject<HTMLInputElement>)
                        : undefined
                    }
                    id={`contact-modal-${field.name}`}
                    name={field.name}
                    type="text"
                    placeholder={field.placeholder}
                    required
                    className="w-full rounded-sm border border-black/15 bg-white px-3 py-2.5 text-sm text-[#1d1d1d] outline-none transition placeholder:text-black/35 focus:border-[#ffc91f] focus:ring-1 focus:ring-[#ffc91f]"
                  />
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="mt-6 w-full cursor-pointer rounded-sm bg-[#ffc91f] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#ffb901]"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>,
    portalTarget,
  );
}
