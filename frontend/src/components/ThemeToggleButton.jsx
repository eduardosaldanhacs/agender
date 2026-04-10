import { useTheme } from '../hooks/useTheme'

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        fill="currentColor"
        d="M12 4a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V5a1 1 0 0 1 1-1Zm0 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm8-6a1 1 0 0 1 1 1 1 1 0 0 1-1 1h-1a1 1 0 1 1 0-2h1ZM5 12a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2h1Zm11.657 5.243a1 1 0 0 1 1.414 0l.707.707a1 1 0 1 1-1.414 1.414l-.707-.707a1 1 0 0 1 0-1.414ZM6.343 6.343a1 1 0 0 1 1.414 0l.707.707A1 1 0 0 1 7.05 8.464l-.707-.707a1 1 0 0 1 0-1.414Zm11.435 2.121a1 1 0 0 1 0-1.414l.707-.707a1 1 0 1 1 1.414 1.414l-.707.707a1 1 0 0 1-1.414 0ZM6.222 17.657a1 1 0 0 1 1.414 1.414l-.707.707a1 1 0 1 1-1.414-1.414l.707-.707ZM12 18a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1Z"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        fill="currentColor"
        d="M14.768 3.96a1 1 0 0 1 .62 1.607A8 8 0 1 0 18.43 18.61a1 1 0 0 1 1.607.62A10 10 0 1 1 14.148 3.33a1 1 0 0 1 .62.63Z"
      />
    </svg>
  )
}

export default function ThemeToggleButton({ className = '' }) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Alternar para tema claro' : 'Alternar para tema escuro'}
      title={isDark ? 'Tema claro' : 'Tema escuro'}
      className={className}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
