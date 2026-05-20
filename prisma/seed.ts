import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ---- Static data to seed ----

const heroSlides = [
  { src: "/images/slide1.jpg", alt: "Students and mentors posing together", order: 0 },
  { src: "/images/slide2.jpg", alt: "Team photo in a casual gathering", order: 1 },
  { src: "/images/slide3.jpg", alt: "Group celebration photo", order: 2 },
];

const successStats = [
  { label: "Departments", value: "9", accent: "black", order: 0 },
  { label: "Executive Members", value: "70", accent: "primary", order: 1 },
  { label: "Flagship Programs", value: "5+", accent: "black", order: 2 },
  { label: "Achievements", value: "100+", accent: "primary", order: 3 },
];

const departments = [
  { title: "Competitive Programming", description: "Focuses on developing strong problem-solving and algorithmic thinking skills through competitive programming challenges and intensive practice.", img: "/images/departements/CP.png", order: 0 },
  { title: "Data Mining", description: "Focuses on analyzing data and extracting valuable insights from large datasets to support data-driven decision-making and solve real-world problems effectively.", img: "/images/departements/DM.png", order: 1 },
  { title: "Cybersecurity", description: "Focuses on cybersecurity by understanding digital threats and learning how to protect systems through practical and hands-on approaches.", img: "/images/departements/cyber.png", order: 2 },
  { title: "Entrepreneurship", description: "Encourages students to develop innovative business ideas and transform them into impactful technology-based solutions with real market potential.", img: "/images/departements/entrepreneurship.png", order: 3 },
  { title: "Event Organizer", description: "Responsible for planning and executing events, ensuring each program runs smoothly and delivers an engaging and impactful experience for participants.", img: "/images/departements/EO.png", order: 4 },
  { title: "Human Capital", description: "Responsible for developing members' skills, fostering personal growth, and maintaining a supportive and collaborative environment.", img: "/images/departements/EO.png", order: 5 },
  { title: "Innovation", description: "Focuses on creating creative and innovative solutions to address real-world challenges through technology.", img: "/images/departements/innovation.png", order: 6 },
  { title: "Media & Design", description: "Handles content creation and manages social media to build a strong brand identity and engage with a wider audience.", img: "/images/departements/EO.png", order: 7 },
  { title: "Partnership", description: "Builds and maintains relationships with external partners to support programs, collaborations, and organizational growth.", img: "/images/departements/EO.png", order: 8 },
  { title: "Product Team", description: "Focuses on designing and developing digital products PRODIGI, turning ideas into functional and user-centered solutions.", img: "/images/departements/EO.png", order: 9 },
];

const hallOfFameEntries = [
  { year: "2024", title: "Juara 1", competition: "Big Data Challenge Satria Data 2024", image: "/images/hof/8.png" },
  { year: "2024", title: "Juara 1", competition: "Inovasi Teknologi Digital Pendidikan Lomba Inovasi Digital Mahasiswa 2024", image: "/images/hof/9.png" },
  { year: "2024", title: "Juara 2", competition: "Pengembangan Perangkat Lunak Gemastik 2024", image: "/images/hof/10.png" },
  { year: "2024", title: "Juara 3", competition: "Penambangan Data Gemastik 2024", image: "/images/hof/11.png" },
  { year: "2024", title: "Juara 3", competition: "Inovasi Teknologi Digital Pendidikan Lomba Inovasi Digital Mahasiswa 2024", image: "/images/hof/13.png" },
  { year: "2024", title: "Juara Harapan", competition: "Bidang Budidaya P2MW", image: "/images/hof/14.png" },
  { year: "2024", title: "Juara Harapan", competition: "Bidang SmartCity Gemastik 2024", image: "/images/hof/15.png" },
];

async function main() {
  console.log("Seeding database...");

  // Hero Slides
  const existingSlides = await prisma.heroSlide.count();
  if (existingSlides === 0) {
    await prisma.heroSlide.createMany({ data: heroSlides });
    console.log(`✓ Seeded ${heroSlides.length} hero slides`);
  } else {
    console.log(`- Skipping hero slides (${existingSlides} already exist)`);
  }

  // Success Stats
  const existingStats = await prisma.successStat.count();
  if (existingStats === 0) {
    await prisma.successStat.createMany({ data: successStats });
    console.log(`✓ Seeded ${successStats.length} success stats`);
  } else {
    console.log(`- Skipping success stats (${existingStats} already exist)`);
  }

  // Departments
  const existingDepts = await prisma.department.count();
  if (existingDepts === 0) {
    await prisma.department.createMany({ data: departments });
    console.log(`✓ Seeded ${departments.length} departments`);
  } else {
    console.log(`- Skipping departments (${existingDepts} already exist)`);
  }

  // Hall of Fame
  const existingHof = await prisma.hallOfFame.count();
  if (existingHof === 0) {
    await prisma.hallOfFame.createMany({ data: hallOfFameEntries });
    console.log(`✓ Seeded ${hallOfFameEntries.length} hall of fame entries`);
  } else {
    console.log(`- Skipping hall of fame (${existingHof} already exist)`);
  }

  // Competition (singleton)
  await prisma.competition.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
  console.log("✓ Ensured competition singleton exists");

  console.log("Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
