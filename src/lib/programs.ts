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
            "Adikara (Ajang Digital Kreatif dan Inovasi Informatika) is an internal competition at the Faculty of Informatics, Telkom University, aimed at developing technical skills, creativity, and entrepreneurial spirit through innovative and challenging competitions across five fields: Competitive Programming, Data Mining, Cyber Security, Entrepreneurship, and Innovation.",
        image: "/images/program/adikara.png",
        slug: "adikara",
    },
    {
        id: "kick-off-belmawa",
        title: "Kick-Off Belmawa",
        category: "Kick-Off",
        description:
            "Belmawa Kick-Off is an introductory program organized by PRODiGi, Faculty of Informatics, Telkom University, aimed at preparing students for national-level competitions by introducing three major competitions—GEMASTIK, LIDM, and Satria Data—while fostering innovation, digital creativity, and data-driven problem solving.",
        image: "/images/program/kick-off-belmawa.png",
        slug: "kick-off-belmawa",
    },
    {
        id: "belmawa-competition-mentoring",
        title: "Belmawa Competition Mentoring",
        category: "Mentoring",
        description:
            "Belmawa Competition Mentoring is a structured program organized by PRODiGi, Faculty of Informatics, Telkom University, aimed at preparing students for Belmawa competitions through intensive training, expert guidance, and hands-on practice to enhance technical skills, strategy, and competitiveness.",
        image: "/images/program/belmawa-competition-mentoring.png",
        slug: "belmawa-competition-mentoring",
    },
];
