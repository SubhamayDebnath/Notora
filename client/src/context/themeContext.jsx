import { createContext, useContext, useState ,useEffect} from "react";
const themeContext = createContext({
	theme: "auto",
	setTheme: (theme) => {},
});

export const ThemeProvider = ({ children }) => {
	const [theme, setTheme] = useState("auto");
	useEffect(() => {
    const saved = localStorage.getItem("theme");
    setTheme(saved || "auto");
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "auto") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.add(prefersDark ? "dark" : "light");
    } else {
      root.classList.add(theme);
    }

    localStorage.setItem("theme", theme);
  }, [theme]);
	return (
		<themeContext.Provider value={{ theme, setTheme }}>
			{children}
		</themeContext.Provider>
	);
};
export const useTheme = () => useContext(themeContext);
