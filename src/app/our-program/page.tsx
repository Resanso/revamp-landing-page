import { ArrowRight2 } from "iconsax-react";

import Link from "next/link";
import ProgramCards from "./ProgramCards";

export const metadata = {
    title: "Our Program | Prodigi",
    description:
        "PRODIGI programs: competitions, kick-offs, and mentoring to develop technical skills and prepare students for technology challenges.",
};

export default function OurProgramPage() {
    return (
        <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-14 md:px-8">
            {/* Breadcrumb */}
            <nav className="mb-5 flex items-center gap-2 text-sm text-black/50">
                <Link href="/" className="hover:text-black">
                    Home
                </Link>
                <ArrowRight2 size="12" color="currentColor" variant="Linear" />
                <span className="text-black/70">Our Program</span>
            </nav>

            {/* Header */}
            <header className="mb-10">
                <h1 className="mt-2 text-5xl font-bold text-[#181818]">
                    Our Program
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-black/65">
                    PRODIGI is a community of competitive and innovative students
                    in the Faculty of Informatics, under the Digital Talent Centre
                    (DTC) Laboratory. We focus on developing technical skills,
                    fostering collaboration, and preparing students to excel in
                    technology competitions and real-world challenges.
                </p>
            </header>

            {/* Program Cards */}
            <ProgramCards />
        </main>
    );
}
