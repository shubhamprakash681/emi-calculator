import { MoonIcon, SunIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "./index";

interface ThemeToggleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  theme: "light" | "dark";
  toggleTheme: React.MouseEventHandler<HTMLButtonElement>;
}
const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ theme, toggleTheme, ...props }) => {
  if (theme === "light") {
    return (
      <Button
        {...props}
        className="rounded-full p-2"
        title="Swich to Dark Mode"
        variant="outlined"
        onClick={toggleTheme}
      >
        <SunIcon height={"20px"} width={"20px"} />
      </Button>
    );
  }

  return (
    <Button {...props} className="rounded-full p-2" title="Swich to Dark Mode" variant="outlined" onClick={toggleTheme}>
      <MoonIcon height={"20px"} width={"20px"} />
    </Button>
  );
};

const Header: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">(
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );

  const toggleTheme: React.MouseEventHandler<HTMLButtonElement> = () => {
    setTheme((prevVal) => (prevVal === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    const html = document.querySelector("html");

    if (html) {
      html.classList.remove("light", "dark");
      html.classList.add(theme);
    }
  }, [theme]);

  return (
    <header className="py-3 px-1 sm:px-3 grid items-center border-b" style={{ gridTemplateColumns: "auto 1fr" }}>
      <span className="text-xl font-bold w-fit prevent-select">EMI Calculator</span>

      <div className="justify-self-end flex items-center space-x-1 sm:space-x-2">
        <ThemeToggleButton key={"theme-toggle-md"} theme={theme} toggleTheme={toggleTheme} />
      </div>
    </header>
  );
};

export default Header;
