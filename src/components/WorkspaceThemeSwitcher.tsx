import React, { useEffect, useState } from "react";

interface Props {
  workspaceId: string;
  onThemeChange: (workspaceId: string, theme: string) => void;
}

const themes = [
  { value: 'workspace-theme-sunrise', label: '🌅 Sunrise' },
  { value: 'workspace-theme-forest', label: '🌲 Forest' },
  { value: 'workspace-theme-twilight', label: '🌌 Twilight' },
  { value: 'workspace-theme-coralreef', label: '🪸 Coral Reef' },
  { value: 'workspace-theme-minty', label: '🌿 Minty Fresh' }
];


const WorkspaceThemeSwitcher: React.FC<Props> = ({ workspaceId, onThemeChange }) => {
  // Lazy load initial theme from localStorage
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(`workspace-theme-${workspaceId}`) || "workspace-theme-light";
  });

  // Notify parent only once on mount
  useEffect(() => {
    onThemeChange(workspaceId, theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // only run once, not on theme changes

  const handleChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem(`workspace-theme-${workspaceId}`, newTheme);
    onThemeChange(workspaceId, newTheme);
  };

  return (
    <select value={theme} onChange={(e) => handleChange(e.target.value)}>
      {themes.map((t) => (
        <option key={t.value} value={t.value}>
          {t.label}
        </option>
      ))}
    </select>
  );
};

export default WorkspaceThemeSwitcher;
