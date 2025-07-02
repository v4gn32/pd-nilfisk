import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import Button from "./Button";

interface ThemeToggleProps {
  variant?: "button" | "icon";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = "icon",
  size = "md",
  className = "",
}) => {
  const { theme, toggleTheme } = useTheme();

  if (variant === "button") {
    return (
      <Button
        variant="ghost"
        size={size}
        onClick={toggleTheme}
        className={`flex items-center gap-2 ${className}`}
        aria-label={`Alternar para tema ${
          theme === "light" ? "escuro" : "claro"
        }`}
      >
        {theme === "light" ? (
          <>
            <Moon size={18} />
            <span>Escuro</span>
          </>
        ) : (
          <>
            <Sun size={18} />
            <span>Claro</span>
          </>
        )}
      </Button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`
        p-2 rounded-lg transition-all duration-200 
        hover:bg-gray-100 dark:hover:bg-gray-800
        focus:outline-none focus:ring-2 focus:ring-[#38AFD9] focus:ring-offset-2
        ${className}
      `}
      aria-label={`Alternar para tema ${
        theme === "light" ? "escuro" : "claro"
      }`}
    >
      {theme === "light" ? (
        <Moon size={20} className="text-gray-600 dark:text-gray-300" />
      ) : (
        <Sun size={20} className="text-yellow-500" />
      )}
    </button>
  );
};

export default ThemeToggle;
