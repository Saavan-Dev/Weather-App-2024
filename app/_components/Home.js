"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import WeatherCard from "./WeatherCard";
import InputField from "./InputField";
import ToggleButton from "./ToggleButton";
import {
  getConditionCode,
  getIconPath,
  processWeatherData,
} from "../../utils/wrrtn-in";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [isMultiple, setIsMultiple] = useState(true);
  const [weatherData, setWeatherData] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const api_key = process.env.NEXT_PUBLIC_API_KEY;
  const base_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const base_URL1 = process.env.NEXT_PUBLIC_BASE_URL1;
  const [debouncedInput, setDebouncedInput] = useState("");

  // const fetchWeatherData = useCallback(
  //   async (locations) => {
  //     try {
  //       setIsError(false);
  //       setIsLoading(true); // Start loading
  //       const responses = await Promise.all(
  //         locations.map((loc) =>
  //           axios.get(`${base_URL}/forecast.json`, {
  //             params: {
  //               q: loc,
  //               days: 3,
  //               key: api_key,
  //             },
  //           })
  //         )
  //       );

  //       const data = responses.map((res) => {
  //         const forecastDay = res.data?.forecast?.forecastday?.[0];
  //         const day = forecastDay?.day;
  //         const condition = day?.condition;

  //         return {
  //           locationName: res.data.location.name,
  //           temp: day.avgtemp_c,
  //           conditionText: condition.text,
  //           highTemp: day.maxtemp_c,
  //           lowTemp: day.mintemp_c,
  //           conditionIcon: condition.icon,
  //         };
  //       });

  //       setWeatherData(data);
  //     } catch (error) {
  //       setIsError(true);
  //       setWeatherData([]);
  //     } finally {
  //       setIsLoading(false); // Stop loading
  //     }
  //   },
  //   [api_key, base_URL]
  // );

  const fetchWeatherData = useCallback(async (locations) => {
    try {
      setIsError(false);
      setIsLoading(true);

      const responses = await Promise.all(
        locations.map((loc) => axios.get(`${base_URL1}/${loc}?format=j1`))
      );

      console.log("Responses:", responses);
      const data = responses.map((res, index) => {
        const { current_condition, weather } = res.data;

        // Current weather details
        const current = current_condition?.[0] || {};
        // First day’s forecast
        const dayForecast = weather?.[0] || {};

        return {
          locationName: locations[index],
          temp: current.temp_C ? `${current.temp_C}°C` : "N/A",
          conditionText: current.weatherDesc?.[0]?.value || "N/A",
          highTemp: dayForecast.maxtempC ? `${dayForecast.maxtempC}°C` : "N/A",
          wind: current.windspeedKmph ? `${current.windspeedKmph}km/h` : "N/A",
          humidity: current.humidity ? `${current.humidity}%` : "N/A",
          conditionIcon: getIconPath(current.weatherDesc?.[0]?.value),
        };
      });

      // Optional: further process or set state
      const finalData = processWeatherData(data);
      setWeatherData(finalData);
    } catch (error) {
      setIsError(true);
      setWeatherData([]);
    } finally {
      setIsLoading(false);
    }
  }, [base_URL1]);

  
  // useEffect(() => {
  //   const handler = setTimeout(() => {
  //     setDebouncedInput(inputText);
  //   }, 500); // Wait 500ms before setting debounced input

  //   return () => clearTimeout(handler); // Clear timeout on input change
  // }, [inputText]);

  // useEffect(() => {
  //   setWeatherData([]); // Reset data when input changes

  //   if (isMultiple) {
  //     fetchWeatherData(["Mumbai", "Delhi"]);
  //   } else if (debouncedInput.trim()) {
  //     // ✅ Only fetch when debounced input is valid
  //     fetchWeatherData([debouncedInput]);
  //   } else {
  //     setWeatherData([]); // ✅ Clear data when input is empty
  //   }
  // }, [debouncedInput, isMultiple, fetchWeatherData]);

  useEffect(() => {
    setWeatherData([]); // Reset data when input changes
  
    if (isMultiple) {
      fetchWeatherData(["Mumbai", "Delhi"]);
    } else if (inputText.trim() === "") {
      // No input provided: get current location name via geolocation + reverse geocoding
      if (typeof window !== "undefined" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              // Reverse geocode using BigDataCloud's free API
              const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
              );
              const data = await response.json();
              // Use city or fallback to locality/principalSubdivision if available
              const locationName =
                data.city || data.locality || data.principalSubdivision || "Your Location";
              fetchWeatherData([locationName]);
            } catch (error) {
              console.error("Error fetching location name:", error);
            }
          },
          (error) => {
            console.error("Error retrieving geolocation:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    } else {
      // Valid input is provided, so use the debounced value
      fetchWeatherData([debouncedInput]);
    }
  }, [inputText, isMultiple, debouncedInput, fetchWeatherData]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-600 text-white p-5">
      <div className=" max-w-xl mx-auto space-y-6">
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
