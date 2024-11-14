// Импорт необходимых компонентов и типов из Vuetify
import { type VuetifyOptions } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";

export const vuetifyConfig: VuetifyOptions = {
  components,
  directives,
  // Настройка темы
  theme: {
    defaultTheme: "light",
  },
  // Настройка отображения и брейкпоинтов
  display: {
    mobileBreakpoint: "sm",
    thresholds: {
      xs: 0, // Мобильные устройства
      sm: 600, // Планшеты
      md: 960, // Небольшие десктопы
      lg: 1280, // Средние десктопы
      xl: 1920, // Большие десктопы
      xxl: 2560, // Сверхбольшие экраны
    },
  },
  // Настройка иконок
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
} as const
