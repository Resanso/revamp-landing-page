export type ProgramCategory = "Competition" | "Kick-Off" | "Mentoring";

export type Program = {
    id: string;
    title: string;
    category: ProgramCategory;
    description: string;
    image: string;
    slug: string;
};

export const PROGRAM_CATEGORY_COLORS: Record<ProgramCategory, string> = {
    Competition: "bg-[#ffc91f] text-black",
    "Kick-Off": "bg-[#ffc91f] text-black",
    Mentoring: "bg-[#ffc91f] text-black",
};

export const PROGRAMS: Program[] = [
    {
        id: "adikara",
        title: "ADIKARA",
        category: "Competition",
        description:
            "Adikara is an internal competition at the Faculty of Informatics, Telkom University, fostering competitiveness, creativity, and innovation among students.",
        image: "/images/program/adikara.png",
        slug: "adikara",
    },
    {
        id: "kick-off-belmawa",
        title: "Kick-Off Belmawa",
        category: "Kick-Off",
        description:
            "Belmawa Kick-Off introduces three major competitions:\n1. GEMASTIK\n2. LIDM\n3. Satria Data",
        image: "/images/program/kick-off-belmawa.png",
        slug: "kick-off-belmawa",
    },
    {
        id: "belmawa-competition-mentoring",
        title: "Belmawa Competition Mentoring",
        category: "Mentoring",
        description:
            "A focused mentoring program to prepare students for Belmawa competitions through training, guidance, and hands-on practice.",
        image: "/images/program/belmawa-competition-mentoring.png",
        slug: "belmawa-competition-mentoring",
    },
];
