import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      // className="px-4 py-2 rounded bg-gray-200 dark:bg-purple-700 text-purple-800 dark:text-gray-100 shadow"
      className="text-2xl"
      onClick={() => setDark((d) => !d)}
    >
      {dark ? "🌙 " : "☀️ "}
    </button>
  );
}
