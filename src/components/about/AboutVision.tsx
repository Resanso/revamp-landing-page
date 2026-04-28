import Image from "next/image";

export default function AboutVision() {
  return (
    <div className="relative w-full bg-gray-900 px-6 py-16 md:py-16 shadow-xl flex flex-col items-center justify-center text-center">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#090d19]/80 z-10"></div>
        <Image
          src="/images/slide1.jpg"
          alt="Prodigi Vision Background"
          fill
          className="object-cover"
        />
      </div>

      <div className="relative z-20 flex flex-col items-center max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-[#FFC72C] mb-6">Our Vision</h2>
        <p className="text-gray-200 text-lg md:text-[20px] font-normal leading-relaxed mb-10 max-w-4xl">
          Menjadi pusat inkubasi prestasi dan inovasi teknologi terdepan di
          Fakultas Informatika yang melahirkan talenta kompetitif berkibar di
          level nasional maupun internasional melalui karya yang berdampak
        </p>
        <div className="bg-white px-6 py-2.5 text-black font-extrabold text-sm tracking-wide">
          #PRODIGI2026
        </div>
      </div>
    </div>
  );
}
