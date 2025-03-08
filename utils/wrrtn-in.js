export const weatherConditionMap = {
  // -- Clear/Cloudy Conditions --
  "Clear": 113,
  "Partly cloudy": 116,
  "Cloudy": 119,
  "Overcast": 122,
  "Mist": 143,
  
  // -- Rain/Sleet/Snow Possibilities --
  "Patchy rain possible": 176,
  "Patchy snow possible": 179,
  "Patchy sleet possible": 182,
  "Patchy freezing drizzle possible": 185,
  "Thundery outbreaks possible": 200,
  
  // -- Extended Codes (Based on WeatherAPI) --
  "Blowing snow": 227,
  "Blizzard": 230,
  "Fog": 248,
  "Freezing fog": 260,
  "Patchy light drizzle": 263,
  "Light drizzle": 266,
  "Freezing drizzle": 281,
  "Heavy freezing drizzle": 284,
  "Patchy light rain": 293,
  "Light rain": 296,
  "Moderate rain at times": 299,
  "Moderate rain": 302,
  "Heavy rain at times": 305,
  "Heavy rain": 308,
  "Light freezing rain": 311,
  "Moderate or Heavy freezing rain": 314,
  "Light sleet": 317,
  "Moderate or heavy sleet": 320,
  "Patchy light snow": 323,
  "Light snow": 326,
  "Patchy moderate snow": 329,
  "Moderate snow": 332,
  "Patchy heavy snow": 335,
  "Heavy snow": 338,
  "Ice pellets": 350,
  "Light rain shower": 353,
  "Moderate or heavy rain shower": 356,
  "Torrential rain shower": 359,
  "Light sleet showers": 362,
  "Moderate or heavy sleet showers": 365,
  "Light snow showers": 368,
  "Moderate or heavy snow showers": 371,
  "Light showers of ice pellets": 374,
  "Moderate or heavy showers of ice pellets": 377,
  "Patchy light rain with thunder": 386,
  "Moderate or heavy rain with thunder": 389,
  "Patchy light snow with thunder": 392,
  "Moderate or heavy snow with thunder": 395,
};


// Function to determine if it's day or night
export function isDaytime(highTemp) {
  const hours = new Date().getHours(); // Current hour
  return hours >= 6 && hours < 18; // Consider day between 6 AM - 6 PM
}

// Function to get correct icon path
export function getIconPath(conditionText, highTemp) {
  const conditionCode = weatherConditionMap[conditionText] || 113; // Default to Clear (113)
  const timeOfDay = isDaytime(highTemp) ? "day" : "night"; // Determine day or night
  return `/weather-icons/${timeOfDay}/${conditionCode}.png`;
}

// Process data and add the icon
export function processWeatherData(data) {
  console.log("Processing data:", data.map((item) => ({
    ...item,
    conditionIcon: getIconPath(item.conditionText, item.highTemp),
  })));

  return data.map((item) => ({
    ...item,
    conditionIcon: getIconPath(item.conditionText, item.highTemp),
  }));
}
