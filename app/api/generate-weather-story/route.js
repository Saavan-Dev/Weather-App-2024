// app/api/generate-weather-story/route.js

// Import the FS monkey-patch first
import "@/utils/patch-fs";

import { NextResponse } from "next/server";
import { pipeline } from "@xenova/transformers";

// Global variable to hold the model (loaded once)
let textGenerator = null;

async function loadModel() {
  if (!textGenerator) {
    // If the transformers library supports a cacheDir option, you can pass it here.
    // If not, our fs patch should redirect any writes from the default path to /tmp/xenova-cache.
    textGenerator = await pipeline("text2text-generation", "Xenova/flan-t5-small", {
      // Optionally, if supported:
      cache_dir: '/tmp/xenova-cache'
    });
  }
}

export async function POST(request) {
  try {
    await loadModel(); // Ensure the model is loaded

    const { weatherData } = await request.json();
    if (!weatherData || !Array.isArray(weatherData)) {
      return NextResponse.json(
        { error: "Invalid or missing weather data" },
        { status: 400 }
      );
    }

    const generateSentence = (data) => {
      if (!data) return "No weather data provided.";
      return `The weather in ${data.locationName} is currently ${data.temp} with ${data.conditionText}. The high temperature for today is ${data.highTemp}. The wind speed is ${data.wind}, and the humidity level is ${data.humidity}.`;
    };

    let storyParts = [];
    for (const data of weatherData) {
      const prompt = `
        You are a cheerful and engaging weather reporter. Craft a warm and conversational weather update based on the given data. Focus on what matters most to people—how the weather feels and what they should expect. Keep it light, engaging, and under 80 words. Avoid technical jargon or raw data—just a natural, friendly summary.
        
        Weather data:
        ${generateSentence(data)}
        
        Now, share your fun and relatable weather update:
      `;

      const output = await textGenerator(prompt, {
        max_new_tokens: 100,
        repetition_penalty: 4.0,
        truncation: true,
      });

      storyParts.push(
        output?.[0]?.generated_text ||
          "I'm sorry, I couldn't generate a weather summary at this time."
      );
    }

    const story = storyParts.join(" and ");
    return NextResponse.json({ story });
  } catch (error) {
    console.error("Error in route.js:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
