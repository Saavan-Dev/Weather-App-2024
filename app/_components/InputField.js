"use client";

export default function InputField({ inputText, setInputText }) {
  return (
    <input
      type="text"
      placeholder="Enter location"
      value={inputText}
      onChange={(e) => setInputText(e.target.value)}
      className="w-full p-3 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}
