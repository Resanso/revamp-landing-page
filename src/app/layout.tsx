import { TRPCReactProvider } from "@/trpc/client";
import { ContactModalProvider } from "@/components/landing/ui/ContactModalContext";
import "./globals.css";

import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PRODIGI @Digital Talent Centre Laboratory",
  description:
    "PRODIGI is a community of competitive & innovative student in Faculty of Informatics, under Digital Talent Centre (DTC) Laboratory.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakartaSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <TRPCReactProvider>
          <ContactModalProvider>{children}</ContactModalProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
