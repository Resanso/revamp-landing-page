import { ReactNode } from "react";
import { MdPersonSearch } from "react-icons/md";
import { FaGlobe, FaCubes } from "react-icons/fa";

export type AboutSlide = {
  src: string;
  alt: string;
};

export type AboutMission = {
  title: string;
  icon: ReactNode;
};

export const aboutMissions: AboutMission[] = [
  {
    title: "Membangun Sistem Talent Scouting dan Informasi yang Terintegrasi",
    icon: <MdPersonSearch className="text-[#FFC72C] text-[64px] mb-6" />,
  },
  {
    title: "Menyelenggarakan Pembinaan Teknis dan Strategis yang Berkelanjutan",
    icon: <FaGlobe className="text-[#FFC72C] text-[60px] mb-6" />,
  },
  {
    title: "Mentransformasi Ide Inovatif Menjadi Produk Teknologi yang Solutif",
    icon: <FaCubes className="text-[#FFC72C] text-[60px] mb-6" />,
  },
];

export const aboutSlides: AboutSlide[] = [
  {
    src: "/images/about/1.png",
    alt: "Students and mentors posing together",
  },
  {
    src: "/images/about/2.png",
    alt: "Students and mentors posing together",
  },
  {
    src: "/images/about/3.png",
    alt: "Students and mentors posing together",
  },
  {
    src: "/images/slide1.jpg",
    alt: "Students and mentors posing together",
  },
  {
    src: "/images/slide2.jpg",
    alt: "Students and mentors posing together",
  },
  {
    src: "/images/slide3.jpg",
    alt: "Students and mentors posing together",
  },
];
