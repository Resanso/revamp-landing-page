import { aboutMissions } from "@/data/about-content";

export default function AboutMission() {
  return (
    <div className=" border-t border-gray-100">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#181818] mb-12">
          Our Mission
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aboutMissions.map((mission, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 flex flex-col items-center justify-center text-center p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {mission.icon}
              <p className="text-gray-600 text-lg font-medium leading-relaxed">
                {mission.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
