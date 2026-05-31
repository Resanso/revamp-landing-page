import Footer from "@/components/landing/sections/Footer";
import Header from "@/components/landing/sections/Header";
import { Suspense, type ReactNode } from "react";

type HallOfFameLayoutProps = {
  children: ReactNode;
};

export default function HallOfFameLayout({ children }: HallOfFameLayoutProps) {
  return (
    <div className="min-h-screen overflow-x-clip bg-[#f6f6f6] text-[#1f1f1f]">
      <Header />
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
        {children}
      </Suspense>
      <Footer />
    </div>
  );
}
