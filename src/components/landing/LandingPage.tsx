import Departements from "@/components/landing/sections/Departements";
import Courses from "@/components/landing/sections/Courses";
import FindWay from "@/components/landing/sections/FindWay";
import Footer from "@/components/landing/sections/Footer";
import Header from "@/components/landing/sections/Header";
import Hero from "@/components/landing/sections/Hero";
import PartnersSection from "@/components/landing/sections/Partners";
import SuccessStats from "@/components/landing/sections/SuccessStats";
import Updates from "@/components/landing/sections/Updates";
import { getCaller } from "@/trpc/server";

export default async function LandingPage() {
  const caller = await getCaller();
  const [slides, stats, departments, siteSetting, leaderboard] = await Promise.all([
    caller.home.getHeroSlides(),
    caller.home.getSuccessStats(),
    caller.home.getDepartments(),
    caller.home.getSiteSetting(),
    caller.home.getLeaderBoard(),
  ]);

  return (
    <div className="min-h-screen overflow-x-clip bg-[#f6f6f6] text-[#1f1f1f]">
      <Header />
      <main className="space-y-0">
        <Hero slides={slides} />
        <SuccessStats stats={stats} siteSetting={siteSetting} />
        <Departements departments={departments} siteSetting={siteSetting} />
        <FindWay leads={leaderboard} />
        <Courses />
        <Updates />
        <PartnersSection />
      </main>
      <Footer />
    </div>
  );
}
