"use client";

import { createContext, useCallback, useContext, useState } from "react";

import ContactModal from "./ContactModal";
import type { ContactModalType } from "./ContactModal";
import type { ReactNode } from "react";

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

type ContactModalContextValue = {
  openContactModal: (type: ContactModalType) => void;
};

const ContactModalContext = createContext<ContactModalContextValue | null>(null);

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<ContactModalType>("contact");

  const openContactModal = useCallback((type: ContactModalType) => {
    setModalType(type);
    setIsOpen(true);
  }, []);

  const closeContactModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ContactModalContext.Provider value={{ openContactModal }}>
      {children}
      <ContactModal
        isOpen={isOpen}
        type={modalType}
        onClose={closeContactModal}
      />
    </ContactModalContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useContactModal() {
  const ctx = useContext(ContactModalContext);

  if (!ctx) {
    throw new Error(
      "useContactModal must be used within a <ContactModalProvider>",
    );
  }

  return ctx;
}
