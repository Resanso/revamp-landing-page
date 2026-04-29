export const topBarMainLinks = [
  {
    label: "School of Computing",
    href: "https://soc.telkomuniversity.ac.id",
  },
  {
    label: "Telkom University",
    href: "https://telkomuniversity.ac.id",
  },
];

export const topBarSwitches = [
  { name: "GitHub", href: "https://github.com/helloprodigi" },
  { name: "Instagram", href: "https://instagram.com/helloprodigi" },
  { name: "LinkedIn", href: "https://linkedin.com/in/helloprodigi" },
];

export const mainNavItems = [
  {
    label: "About",
    link: "/about",
  },
  {
    label: "Executive",
    columns: [
      {
        label: "Members",
        href: "/executives/members",
      },
      {
        label: "Gallery",
        href: "/executives/gallery",
      },
    ],
  },
  {
    label: "Hall of Fame",
    link: "/hall-of-fame",
  },
  {
    label: "Activities",
    link: "/activities",
  },
  {
    label: "Resources",
    columns: [
      {
        title: "Information",
        links: [],
      },
      {
        title: "Downloads",
        links: [],
      },
    ],
  },
  {
    label: "Competitions",
    columns: [
      {
        title: "Belmawa",
        links: [
          {
            label: "Gemastik",
            href: "#",
          },
          {
            label: "LIDM",
            href: "#",
          },
          {
            label: "Satria Data",
            href: "#",
          },
          {
            label: "PKM",
            href: "#",
          },
          {
            label: "P2MW",
            href: "#",
          },
        ],
      },
      {
        title: "Internal",
        links: [
          {
            label: "Adikara",
            href: "https://adikara.net",
          },
        ],
      },
    ],
  },
  {
    label: "Contact",
    link: "/contact",
  },
];

export const heroActions = [
  { label: "Aslab announcement", icon: "Flag2", href: "/admission" },
  {
    label: "Follow us on Instagram",
    icon: "Instagram",
    href: "https://instagram.com/helloprodigi",
  },
  { label: "Partnership", icon: "TagUser", href: "#" },
  { label: "Our Programs", icon: "Calendar", href: "#" },
];

export const heroSlides = [
  {
    src: "/images/slide1.jpg",
    alt: "Students and mentors posing together",
  },
  {
    src: "/images/slide2.jpg",
    alt: "Team photo in a casual gathering",
  },
  {
    src: "/images/slide3.jpg",
    alt: "Group celebration photo",
  },
];

export const successStats = [
  { label: "Departments", value: "9", accent: "black" },
  { label: "Executive Members", value: "70", accent: "primary" },
  { label: "Flagship Programs", value: "5+", accent: "black" },
  { label: "Achievements", value: "100+", accent: "primary" },
];

export const updatesTabs = ["Event", "Information", "Articles"];

export const admissionLinks = [
  "Apply Online",
  "Join online and register",
  "Invitation to Applicants",
  "Print Admit Card",
  "PhD Admission Form",
  "Offer letter & invitation",
  "Result of Admission Test",
];

export const leadMessages = [
  {
    quote:
      "Kami membangun Prodigi sebagai ruang tumbuh bersama. Setiap anggota didorong untuk berani mencoba, berkolaborasi, dan menuntaskan karya terbaiknya.",
    name: "Muhammad Haulul Azkiyaa",
    label: "Lead 2025",
    photo: "/images/executives/members/2025/om haulul.png",
  },
  {
    quote:
      "Prodigi bukan hanya tentang menang lomba, tapi juga tentang membentuk karakter problem solver yang siap membawa dampak nyata bagi sekitar.",
    name: "Sayyid Rayhan Mulachela",
    label: "Lead 2024",
    photo: "",
  },
];

export const courseFilters = ["Bachelor", "Master", "Diploma"];

export const courses = [
  "Electronic and Telecommunication",
  "Quranic Sciences and Islamic Studies",
  "Computer Science and Engineering",
  "Arabic Language",
  "Civil Engineering",
  "Department of Law",
];

export type Departements = {
  id: number;
  img: string;
  title: string;
  description: string;
};

export const departements: Departements[] = [
  {
    id: 1,
    img: "/images/departements/CP.png",
    title: "Competitive Programming",
    description:
      "Focuses on developing strong problem-solving and algorithmic thinking skills through competitive programming challenges and intensive practice.",
  },
  {
    id: 2,
    img: "/images/departements/DM.png",
    title: "Data Mining",
    description:
      "Focuses on analyzing data and extracting valuable insights from large datasets to support data-driven decision-making and solve real-world problems effectively.",
  },
  {
    id: 3,
    img: "/images/departements/cyber.png",
    title: "Cybersecurity",
    description:
      "Focuses on cybersecurity by understanding digital threats and learning how to protect systems through practical and hands-on approaches.",
  },
  {
    id: 4,
    img: "/images/departements/entrepreneurship.png",
    title: "Entrepreneurship",
    description:
      "Encourages students to develop innovative business ideas and transform them into impactful technology-based solutions with real market potential.",
  },
  {
    id: 5,
    img: "/images/departements/EO.png",
    title: "Event Organizer",
    description:
      " Responsible for planning and executing events, ensuring each program runs smoothly and delivers an engaging and impactful experience for participants.",
  },
  {
    id: 6,
    img: "/images/departements/EO.png", // belum ada image fix
    title: "Human Capital",
    description:
      "Responsible for developing members’ skills, fostering personal growth, and maintaining a supportive and collaborative environment.",
  },
  {
    id: 7,
    img: "/images/departements/innovation.png",
    title: "Innovation",
    description:
      "Focuses on creating creative and innovative solutions to address real-world challenges through technology.",
  },
  {
    id: 8,
    img: "/images/departements/EO.png", // belum ada image fix
    title: "Media & Design",
    description:
      "Handles content creation and manages social media to build a strong brand identity and engage with a wider audience",
  },
  {
    id: 9,
    img: "/images/departements/EO.png", // belum ada image fix
    title: "Partnership",
    description:
      " Builds and maintains relationships with external partners to support programs, collaborations, and organizational growth.",
  },
  {
    id: 10,
    img: "/images/departements/EO.png", // belum ada image fix
    title: "Product Team",
    description:
      "Focuses on designing and developing digital products PRODIGI, turning ideas into functional and user-centered solutions.",
  },
];

export const footerColumns = {
  academics: [
    "Apply Online",
    "How to apply for new student",
    "Academic Information",
    "Publications",
    "Academic Year calendar",
  ],
  useful: [
    "National Knowledge Hub",
    "Ministry of Education",
    "Online Course Hub",
    "Digital Library",
    "Course catalog",
  ],
  resources: [
    "Center for Research",
    "Summer Workshop 2026",
    "Research Publications",
    "Official Test Notice",
    "Google Scholar Profile",
  ],
};

export const socialLinks = [
  { name: "GitHub", href: "https://github.com/helloprodigi" },
  { name: "Instagram", href: "https://instagram.com/helloprodigi" },
  { name: "LinkedIn", href: "https://linkedin.com/in/helloprodigi" },
];
