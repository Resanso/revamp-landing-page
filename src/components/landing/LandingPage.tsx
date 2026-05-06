import Departements from "@/components/landing/sections/Departements";
import Courses from "@/components/landing/sections/Courses";
import FindWay from "@/components/landing/sections/FindWay";
import Footer from "@/components/landing/sections/Footer";
import Header from "@/components/landing/sections/Header";
import Hero from "@/components/landing/sections/Hero";
import PartnersSection from "@/components/landing/sections/Partners";
import SuccessStats from "@/components/landing/sections/SuccessStats";
import Updates from "@/components/landing/sections/Updates";

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-clip bg-[#f6f6f6] text-[#1f1f1f]">
      <Header />
      <main className="space-y-0">
        <Hero />
        <SuccessStats />
        <Departements />
        <FindWay />
        <Courses />
        <Updates />
        <PartnersSection />
      </main>
      <Footer />
    </div>
  );
}
