import Image from "next/image";
export default function WeatherCard({
  locationName,
  temp,
  conditionText,
  conditionIcon,
  humidity,
  wind,
  highTemp,
}) {
  return (
    <div className="relative flex flex-col items-center justify-center
                    w-72 h-90 rounded-2xl shadow-lg
                    bg-white/10 backdrop-blur-md
                    text-white p-6 border border-white/30
                    transition-transform transform hover:scale-105 duration-300">
      
      {/* Weather Icon */}
      <Image
        src={conditionIcon}
        alt={conditionText}
        width={120}
        height={120}
        className="mb-0"
      />

      {/* Temperature */}
      <p className="text-5xl font-extrabold">{temp}</p>

      {/* Condition */}
      <p className="text-lg mt-2 font-medium text-gray-200 text-center">{conditionText}</p>

      {/* High Temp */}
      {highTemp && <p className="text-md mt-1 text-gray-300">🔥 Max Temp: {highTemp}</p>}

      {/* Humidity */}
      {humidity && <p className="text-md mt-1 text-gray-300">💧 Humidity: {humidity}</p>}

      {/* Wind Speed */}
      {wind && <p className="text-md mt-1 text-gray-300">🌬 Wind: {wind}</p>}

      {/* Location Name */}
      <p className="text-lg mt-4 font-bold text-gray-100">{locationName}</p>

      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-white/10 opacity-10 rounded-2xl pointer-events-none" />
    </div>
  );
}
