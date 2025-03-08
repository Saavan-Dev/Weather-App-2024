import Image from "next/image";
export default function WeatherCard({
  locationName,
  temp,
  conditionText,
  conditionIcon,
}) {
  return (
    <div className="relative flex flex-col items-center justify-center
                    w-64 h-72 rounded-xl shadow-xl
                    bg-white/10 backdrop-blur-lg
                    text-white p-6 border border-white/20
                    hover:scale-105 transition-transform duration-300">
      
      {/* Decorative blurred highlight */}
      <div className="absolute w-32 h-32 bg-white/30 rounded-full blur-2xl 
                      top-[-2rem] left-[4rem] pointer-events-none" />

      {/* Weather Icon */}
      <Image
        src={conditionIcon}
        alt={conditionText}
        width={120}
        height={120}
        className="mb-2 z-10"
      />

      {/* Temperature */}
      <p className="text-5xl font-extrabold z-10">
        {temp}
      </p>

      {/* Condition */}
      <p className="text-lg mt-1 z-10">{conditionText}</p>

      {/* Location */}
      <p className="text-md mt-1 font-semibold z-10">
        {locationName}
      </p>

      {/* Subtle overlay for extra gloss */}
      <div className="absolute inset-0 bg-white/10 opacity-10 rounded-xl pointer-events-none" />
    </div>
  );
}