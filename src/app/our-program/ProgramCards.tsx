"use client";

import { PROGRAMS, PROGRAM_CATEGORY_COLORS } from "@/lib/programs";
import { ArrowRight2 } from "iconsax-react";

import Image from "next/image";
import Link from "next/link";

export default function ProgramCards() {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PROGRAMS.map((program) => (
                <article
                    key={program.id}
                    className="group flex flex-col overflow-hidden rounded-sm border border-black/10 bg-white transition duration-300 hover:-translate-y-1 hover:border-[#ffc91f]/80 hover:shadow-[0_14px_36px_rgba(10,20,40,0.12)]"
                >
                    {/* Image with Category Tag */}
                    <div className="relative aspect-[16/10] bg-[#f5f5f5]">
                        <Image
                            src={program.image}
                            alt={program.title}
                            fill
                            loading="lazy"
                            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
                        />
                        <span
                            className={`absolute right-3 top-0 rounded-b-sm px-3 py-1 text-xs font-bold ${PROGRAM_CATEGORY_COLORS[program.category]}`}
                        >
                            {program.category}
                        </span>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-5">
                        <h2 className="text-xl font-bold leading-tight text-[#121212]">
                            {program.title}
                        </h2>
                        <p className="mt-2 flex-1 whitespace-pre-line text-sm leading-relaxed text-black/70">
                            {program.description}
                        </p>

                        {/* Arrow Button → navigates to detail page */}
                        <div className="mt-4 flex justify-end">
                            <Link
                                href={`/our-program/${program.slug}`}
                                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm border border-black/15 text-black/50 transition hover:border-[#ffc91f] hover:bg-[#ffc91f] hover:text-black"
                                aria-label={`View detail ${program.title}`}
                            >
                                <ArrowRight2
                                    size="14"
                                    color="currentColor"
                                    variant="Linear"
                                />
                            </Link>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}
