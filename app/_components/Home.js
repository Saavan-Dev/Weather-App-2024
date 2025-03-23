"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import WeatherCard from "./WeatherCard"; // Assuming this component exists
import InputField from "./InputField"; // Assuming this component exists
import ToggleButton from "./ToggleButton"; // Assuming this component exists
import { getIconPath, processWeatherData } from "../../utils/wrrtn-in"; // Assuming these utilities exist

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [isMultiple, setIsMultiple] = useState(true);
  const [weatherData, setWeatherData] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const base_URL1 = process.env.NEXT_PUBLIC_BASE_URL1;
  const [debouncedInput, setDebouncedInput] = useState("");
  const [story, setStory] = useState("");
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  // Fetch weather data
  const fetchWeatherData = useCallback(
    async (locations) => {
      try {
        setIsError(false);
        setIsLoading(true);
        const responses = await Promise.all(
          locations.map((loc) => axios.get(`${base_URL1}/${loc}?format=j1`))
        );
        const data = responses.map((res, index) => {
          const { current_condition, weather } = res.data;
          const current = current_condition?.[0] || {};
          const dayForecast = weather?.[0] || {};
          return {
            locationName: locations[index],
            temp: current.temp_C ? `${current.temp_C}°C` : "N/A",
            conditionText: current.weatherDesc?.[0]?.value || "N/A",
            highTemp: dayForecast.maxtempC
              ? `${dayForecast.maxtempC}°C`
              : "N/A",
            wind: current.windspeedKmph
              ? `${current.windspeedKmph}km/h`
              : "N/A",
            humidity: current.humidity ? `${current.humidity}%` : "N/A",
            conditionIcon: getIconPath(current.weatherDesc?.[0]?.value),
          };
        });
        const finalData = processWeatherData(data);
        setWeatherData(finalData);
      } catch (error) {
        setIsError(true);
        setWeatherData([]);
      } finally {
        setIsLoading(false);
      }
    },
    [base_URL1]
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(inputText);
    }, 540);
    return () => {
      clearTimeout(handler);
      setStory("");
    };
  }, [inputText]);

  useEffect(() => {
    setWeatherData([]);
    if (isMultiple) {
      // Load default cities: Mumbai and Delhi
      fetchWeatherData(["Mumbai", "Delhi"]);
    } else if (debouncedInput.trim()) {
      fetchWeatherData([debouncedInput]);
    } else {
      setWeatherData([]);
    }
  }, [debouncedInput, isMultiple, fetchWeatherData]);

  // Function to speak text using Speech Synthesis API
  const speakWeatherStory = (text) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Generate AI Weather Story and speak it out
  const fetchWeatherStory = async () => {
    try {
      setIsLoadingReport(true);
      const response = await axios.post(
        "/api/generate-weather-story",
        { weatherData },
        { headers: { "Content-Type": "application/json" } }
      );
      const generatedStory = response.data.story;
      setStory(generatedStory);
      // Speak the generated weather story aloud
      speakWeatherStory(generatedStory);
    } catch (error) {
      console.error("Failed to generate story:", error);
    } finally {
      setIsLoadingReport(false);
    }
  };

  // Determine background classes based on the first weather data (if available)
  const backgroundClasses = weatherData.length
    ? getBackgroundClasses(weatherData[0].conditionText)
    : "bg-gradient-to-r from-blue-400 to-purple-600";

  return (
    <div
      className={`min-h-screen text-white p-5 transition-all duration-500 ${backgroundClasses}`}
    >
      <div className="max-w-2xl mx-auto space-y-6 bg-black bg-opacity-50 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-center">Weather App</h1>
        {!isMultiple && (
          <InputField inputText={inputText} setInputText={setInputText} />
        )}
        <ToggleButton isMultiple={isMultiple} setIsMultiple={setIsMultiple} />
        <div
          className={`grid ${
            isMultiple ? "grid-cols-1 sm:grid-cols-2 gap-4" : "grid-cols-1"
          }`}
        >
          {isLoading ? (
            <div className="col-span-1 sm:col-span-2 p-6 rounded-lg shadow-lg bg-gradient-to-r from-white to-gray-50 flex flex-col items-center justify-center space-y-4">
              {/* Spinner */}
              <div
                className="inline-block w-10 h-10 border-4 border-blue-600 border-solid rounded-full border-t-transparent animate-spin"
                role="status"
                aria-label="loading"
              >
                <span className="sr-only">Loading...</span>
              </div>
              {/* Loading Text */}
              <h2 className="text-xl font-semibold text-gray-700 animate-pulse">
                Loading...
              </h2>
              <p className="text-sm text-gray-500">
                Please wait while we fetch the data.
              </p>
            </div>
          ) : weatherData.length > 0 ? (
            weatherData.map((data, index) => (
              <WeatherCard key={index} {...data} />
            ))
          ) : (
            <div className="col-span-1 sm:col-span-2 p-4 bg-white text-black rounded-lg shadow-lg text-center">
              <h2 className="text-xl font-bold">No Weather Data Found</h2>
              {isError && (
                <p className="text-gray-500">
                  Please check your input or try again later.
                </p>
              )}
            </div>
          )}
        </div>
        {/* AI Voice Assistant Section */}
        <div className="flex flex-col items-center gap-4 mt-6">
          <button
            onClick={fetchWeatherStory}
            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
          >
            {isLoadingReport ? (
              <div className="w-6 h-6 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            ) : (
              "Generate Weather Report"
            )}
          </button>
          {story && (
            <div className="bg-black bg-opacity-70 p-4 rounded-lg shadow-md mt-4 max-w-md text-center">
              <p className="text-lg">{story}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Optional helper: returns Tailwind CSS classes based on weather condition.
const getBackgroundClasses = (condition) => {
  const conditions = condition.toLowerCase();
  if (/sunny|clear/.test(conditions))
    return "bg-gradient-to-r from-yellow-200 to-orange-400";
  if (/cloudy|overcast/.test(conditions))
    return "bg-gradient-to-r from-gray-200 to-gray-400";
  if (/rain|shower/.test(conditions))
    return "bg-gradient-to-r from-blue-400 to-blue-600";
  if (/snow/.test(conditions)) return "bg-gradient-to-r from-white to-blue-100";
  return "bg-gradient-to-r from-blue-400 to-purple-600";
};
