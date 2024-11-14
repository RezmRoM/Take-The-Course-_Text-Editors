import { createI18n } from 'vue-i18n'
import { messages, defaultLocale } from '@/shared/config/i18n.config'

// Создание и экспорт экземпляра i18n с базовой конфигурацией
export const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: 'en',
  messages
}) 