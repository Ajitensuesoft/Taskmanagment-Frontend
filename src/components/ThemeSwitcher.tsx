import React from "react";
import { useTheme } from "./ThemeContext";

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="theme-selector">
      <label htmlFor="theme">🎨 Theme:</label>
      <select
        id="theme"
        value={theme}
        onChange={(e) => setTheme(e.target.value as any)}
      >
        <option value="light">🌞 Light</option>
        <option value="dark">🌙 Dark</option>
        <option value="ocean">🌊 Ocean</option>
        <option value="pastel">🌸 Pastel</option>
        <option value="contrast">⚡ High Contrast</option>
        <option value="nature">🌿 Nature</option>
        <option value="sunset">🌅 Sunset</option>
        <option value="rose">🌹 Rose</option>
        <option value="forest">🌲 Forest</option>
        <option value="lavender">💜 Lavender</option>
        <option value="gold">🏆 Gold</option>
        <option value="midnight">🌌 Midnight</option>
        <option value="neon">🌈 Neon</option>
        <option value="coffee">☕ Coffee</option>
        <option value="aqua">💧 Aqua</option>
      </select>
    </div>
  );
};

export default ThemeSwitcher;
