import Link from "next/link";
import { ArrowRight2 } from "iconsax-react";
import { aboutSlides } from "@/data/about-content";
import AboutGalleryClient from "@/components/about/AboutGalleryClient";

export const metadata = {
  title: "About | Prodigi",
  description:
    "Learn more about Prodigi, our mission, and our activities in fostering a community of competitive and innovative students in the Faculty of Informatics.",
};

export default async function AboutPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-14 md:px-8">
      <nav className="mb-5 flex items-center gap-2 text-sm text-black/50">
        <Link href="/" className="hover:text-black">
          Home
        </Link>
        <ArrowRight2 size="12" color="currentColor" variant="Linear" />
        <span className="text-black/70">About</span>
      </nav>

      <div className="max-w-4xl mb-12">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-black tracking-tight">
          About <span className="text-[#FFC72C]">Prodigi</span>
        </h1>
        <p className="text-gray-700 text-md leading-relaxed">
          PRODIGI is a community of competitive and innovative students in the
          Faculty of Informatics, under the Digital Talent Centre (DTC)
          Laboratory. We focus on developing technical skills, fostering
          collaboration, and preparing students to excel in technology
          competitions and real-world challenges.
        </p>
      </div>

      {/* Gallery Section */}
      <AboutGalleryClient slides={aboutSlides} />
    </main>
  );
}
