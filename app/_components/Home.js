"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import WeatherCard from "./WeatherCard";
import InputField from "./InputField";
import ToggleButton from "./ToggleButton";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [isMultiple, setIsMultiple] = useState(true);
  const [weatherData, setWeatherData] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const api_key = process.env.NEXT_PUBLIC_API_KEY;
  const base_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const fetchWeatherData = useCallback(
    async (locations) => {
      try {
        setIsError(false);
        setIsLoading(true); // Start loading
        const responses = await Promise.all(
          locations.map((loc) =>
            axios.get(`${base_URL}/forecast.json`, {
              params: {
                q: loc,
                days: 3,
                key: api_key,
              },
            })
          )
        );

        const data = responses.map((res) => {
          const forecastDay = res.data?.forecast?.forecastday?.[0];
          const day = forecastDay?.day;
          const condition = day?.condition;

          return {
            locationName: res.data.location.name,
            temp: day.avgtemp_c,
            conditionText: condition.text,
            highTemp: day.maxtemp_c,
            lowTemp: day.mintemp_c,
            conditionIcon: condition.icon,
          };
        });

        setWeatherData(data);
      } catch (error) {
        setIsError(true);
        setWeatherData([]);
      } finally {
        setIsLoading(false); // Stop loading
      }
    },
    [api_key, base_URL]
  );

  useEffect(() => {
    setWeatherData([]);
    if (isMultiple) {
      fetchWeatherData(["Mumbai", "Delhi"]);
    } else if (inputText) {
      fetchWeatherData([inputText]);
    }
  }, [inputText, isMultiple, fetchWeatherData]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-600 text-white p-5">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-center">Weather App</h1>
        {!isMultiple && (
          <InputField inputText={inputText} setInputText={setInputText} />
        )}
        <ToggleButton isMultiple={isMultiple} setIsMultiple={setIsMultiple} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {isLoading ? (
            <div className="col-span-1 sm:col-span-2 p-4 bg-white text-black rounded-lg shadow-lg text-center">
              <h2 className="text-xl font-bold">Loading...</h2>
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
      </div>
    </div>
  );
}
