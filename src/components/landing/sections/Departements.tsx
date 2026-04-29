"use client";

import { useState } from "react";
import { ArrowRight2 } from "iconsax-react";
import Image from "next/image";
import SectionContainer from "@/components/landing/ui/SectionContainer";
import { departements } from "@/data/landing-content";
import DepartementCard from "@/components/landing/ui/DepartementCard";

export default function Departements() {
  const [activeDeptId, setActiveDeptId] = useState<number | string | null>(
    null,
  );
  const activeDepartment = departements.find((d) => d.id === activeDeptId);

  return (
    <section className="relative overflow-hidden py-16">
      <div className="absolute inset-0">
        <Image
          src="/images/slide1.jpg"
          alt="Campus facade"
          fill
          loading="lazy"
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#1a1b1f]/70 via-[#1a1b1f]/30 to-[#1a1b1f]/70" />
      </div>

      <SectionContainer className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-2 items-start justify-center">
        <article className="w-full max-w-145 border border-white/25 bg-white/10 p-8 shadow-[0_25px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:max-w-full">
          <h3 className="mb-4 font-serif font-bold text-4xl text-white">
            Departements
          </h3>
          <p className="mb-6 text-sm font-medium leading-7 text-white/80">
            PRODIGI is a leading community in School of Computing Telkom
            University, seeking academic excellence with competition values to
            develop skilled talents.
          </p>
          <div className="divide-y divide-white/20 border border-white/20 bg-white/5 text-white">
            {departements.map((item) => {
              const isActive = item.id === activeDeptId;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveDeptId(isActive ? null : item.id)}
                  className={`flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-[#FFC72C] text-black font-semibold"
                      : "hover:bg-white/10 text-white"
                  }`}
                >
                  {item.title}
                  <ArrowRight2
                    size="14"
                    color="currentColor"
                    variant="Linear"
                  />
                </button>
              );
            })}
          </div>
        </article>

        <div className="w-full lg:max-w-xl mx-auto h-fit self-start pt-0 lg:pt-0">
          {activeDepartment && (
            <DepartementCard department={activeDepartment} />
          )}
        </div>
      </SectionContainer>
    </section>
  );
}
