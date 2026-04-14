
import { createContext, useContext } from "react";

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  // Light mode only - no theme switching
  const theme = "ligth";
  const setTheme = () => {}; // No-op function for compatibility

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom Hook
const useTheme = () => useContext(ThemeContext);

export { useTheme, ThemeProvider };