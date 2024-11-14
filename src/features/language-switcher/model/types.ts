// Интерфейс для описания локали (языка)
export interface Locale {
  code: string    // Код языка (например, 'ru', 'en')
  name: string    // Название языка
  flag: string    // Иконка флага для языка
}

// Пропсы компонента переключателя языков
export interface LanguageSwitcherProps {
  currentLocale: string
}

// События компонента переключателя языков
export interface LanguageSwitcherEmits {
  (e: 'change', locale: string): void
}
