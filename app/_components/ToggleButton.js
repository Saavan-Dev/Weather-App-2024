"use client";

export default function ToggleButton({ isMultiple, setIsMultiple }) {
  return (
    <button
      onClick={() => setIsMultiple(!isMultiple)}
      className="w-full py-2 px-4 bg-indigo-500 hover:bg-indigo-600 rounded-md text-white transition"
    >
      {isMultiple
        ? "Switch to Custom Weather Input"
        : "Switch to Default Weather Location"}
    </button>
  );
}
