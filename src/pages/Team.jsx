import { Users } from "lucide-react";
import { MemberCard } from "../components/team/MemberCard";
import { AutoCarousel } from "../components/team/AutoCarousel";
import reg from "../assets/Cvrt1.png";
import { responsables, members } from "../services/Details";

function Team() {
  return (
    <>
      <div className="relative">
        <img
          src={reg}
          className="w-full h-64 sm:h-[400px] md:h-[600px] object-cover blur-sm"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-full -translate-y-1/2">
          <h1 className="uppercase text-center text-white font-semibold mb-1 text-3xl sm:text-5xl md:text-6xl lg:mb-6 lg:text-7xl">
            our team
          </h1>
        </div>
      </div>
      <div className="bg-gradient-to-b from-gray-50 to-white py-6 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="mb-16 sm:mb-24">
            <h2 className="text-2xl sm:text-3xl text-green-bk font-bold text-center mb-8 sm:mb-12 flex items-center justify-center gap-2">
              <Users className="w-6  h-6 sm:w-8 sm:h-8" />
              BK RESPONSABLES
            </h2>
            <AutoCarousel
              slideSpan="w-[calc(100%+9.8rem)]"
              variant="responsable"
            >
              {[...responsables, ...responsables].map((person, index) => (
                <div
                  key={index}
                  className="flex-[0_0_74%] sm:flex-[0_0_27%] md:flex-[0_0_21%] lg:flex-[0_0_18%] min-w-0"
                >
                  <MemberCard {...person} variant="responsable" />
                </div>
              ))}
            </AutoCarousel>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl text-green-bk font-bold text-center mb-8 sm:mb-12 flex items-center justify-center gap-2">
              <Users className="w-6 h-6 sm:w-8 sm:h-8" />
              BK MEMBERS
            </h2>
            <AutoCarousel slideSpan="w-[calc(100%+1rem)]">
              {[...members, ...members].map((person, index) => (
                <div
                  key={index}
                  className="flex-[0_0_25%] sm:flex-[0_0_20%] md:flex-[0_0_16.666%] lg:flex-[0_0_14.285%] min-w-0"
                >
                  <MemberCard {...person} />
                </div>
              ))}
            </AutoCarousel>
          </section>
        </div>
      </div>
    </>
  );
}

export default Team;
