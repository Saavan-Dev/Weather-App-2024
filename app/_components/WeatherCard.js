import Image from "next/image";

export default function WeatherCard({
  locationName,
  temp,
  conditionText,
  highTemp,
  lowTemp,
  conditionIcon,
}) {
  const protocolPrefixedIcon = conditionIcon.startsWith("//")
    ? `https:${conditionIcon}`
    : conditionIcon;

  return (
    <div className="p-4 bg-white text-black rounded-lg shadow-lg">
      <h2 className="text-xl font-bold">{locationName}</h2>
      <div className="flex items-center space-x-4">
        <Image
          src={protocolPrefixedIcon}
          width={64}
          height={64}
          alt={conditionText}
          className="w-16 h-16"
        />
        <div>
          <p className="text-2xl font-bold">{temp}°C</p>
          <p>{conditionText}</p>
        </div>
      </div>
      <div className="mt-2 flex justify-between">
        <span>High: {highTemp}°C</span>
        <span>Low: {lowTemp}°C</span>
      </div>
    </div>
  );
}
