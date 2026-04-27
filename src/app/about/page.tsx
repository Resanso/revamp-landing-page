import Image from "next/image";
import Link from "next/link";
import { ArrowRight2 } from "iconsax-react";
import { aboutSlides } from "@/data/about-content";
import AboutGalleryClient from "@/components/about/AboutGalleryClient";
import AboutVision from "@/components/about/AboutVision";

export const metadata = {
  title: "About | Prodigi",
  description:
    "Learn more about Prodigi, our mission, and our activities in fostering a community of competitive and innovative students in the Faculty of Informatics.",
};

export default async function AboutPage() {
  return (
    <main className="min-h-screen w-full pt-14 pb-0">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
        <nav className="mb-5 flex items-center gap-2 text-sm text-black/50">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <ArrowRight2 size="12" color="currentColor" variant="Linear" />
          <span className="text-black/70">About</span>
        </nav>

        <div className="max-w-fit mb-12">
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

        <AboutGalleryClient slides={aboutSlides} />
      </div>

      {/* Vision Section */}
      <AboutVision />
    </main>
  );
}
