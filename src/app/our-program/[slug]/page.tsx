"use client";

import { notFound } from "next/navigation";
import { PROGRAMS } from "@/lib/programs";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight2 } from "iconsax-react";
import { useContactModal } from "@/components/landing/ui/ContactModalContext";

import { use } from "react";

export default function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const program = PROGRAMS.find((p) => p.slug === slug);

    if (!program) {
        notFound();
    }

    const { openContactModal } = useContactModal();

    return (
        <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-14 md:px-8">
            {/* Breadcrumb */}
            <nav className="mb-5 flex items-center gap-2 text-base">
                <Link href="/" className="text-[#A9A9A9] font-medium hover:text-black transition">
                    Home
                </Link>
                <ArrowRight2 size="12" color="#A9A9A9" variant="Linear" />
                <Link href="/our-program" className="text-[#A9A9A9] font-medium hover:text-black transition">
                    Our Program
                </Link>
                <ArrowRight2 size="12" color="#A9A9A9" variant="Linear" />
                <span className="text-[#848484] font-medium">Detail {program.title}</span>
            </nav>

            {/* Header */}
            <header className="mb-8">
                <h1 className="mt-2 text-[48px] font-bold text-black">
                    {program.title}
                </h1>
                <div className="mt-4">
                    <button
                        type="button"
                        onClick={() => openContactModal("sponsorship", program.title)}
                        className="rounded-sm bg-[#ffc91f] px-5 py-2.5 text-base font-medium text-black transition hover:bg-[#e6b51c]"
                    >
                        Sponsor Our Program
                    </button>
                </div>
            </header>

            {/* Image */}
            <div className="mb-10">
                <div className="relative aspect-[21/9] w-full overflow-hidden bg-[#f5f5f5]">
                    <Image
                        src={program.image}
                        alt={program.title}
                        fill
                        className="object-cover object-center"
                        priority
                    />
                </div>
                {/* Dots indicator mock */}
                <div className="mt-5 flex justify-center gap-1.5 items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-black/15" />
                    <div className="h-1.5 w-6 rounded-full bg-[#ffc91f]" />
                </div>
            </div>

            {/* About */}
            <section className="max-w-4xl">
                <h2 className="mb-4 text-[36px] font-semibold text-black">About the Program</h2>
                <p className="whitespace-pre-line text-base font-light leading-[24px] text-black">
                    {program.description}
                </p>
            </section>
        </main>
    );
}
