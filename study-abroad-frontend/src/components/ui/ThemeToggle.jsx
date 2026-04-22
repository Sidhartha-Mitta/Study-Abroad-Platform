import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '../../store/themeStore'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()
  return (
    <button className={`theme-toggle ${theme === 'light' ? 'light' : ''}`} onClick={toggleTheme} aria-label="Toggle theme">
      <span className="theme-thumb">{theme === 'light' ? <Sun size={15} /> : <Moon size={15} />}</span>
    </button>
  )
}
