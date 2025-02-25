import { useState, useEffect } from "react";

const DarkModeToggle = () => {
  // Get theme from localStorage or default to light mode
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Toggle dark mode class on body and save to localStorage
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      style={{
        padding: "10px 20px",
        borderRadius: "5px",
        background: darkMode ? "#fff" : "#333",
        color: darkMode ? "#000000" : "#000000",
        border: "none",
        cursor: "pointer",
      }}
    >
      {darkMode ? "☀" : "🌙"}
    </button>
  );
};

export default DarkModeToggle;
