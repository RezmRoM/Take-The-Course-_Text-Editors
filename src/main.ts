// Импорт основных зависимостей Vue
import { createApp } from "vue";
import { createVuetify } from "vuetify";
import { VueQueryPlugin } from "@tanstack/vue-query";
import App from "@/app/ui/App.vue";
import router from "@/app/providers/router";
import { i18n } from "@/app/providers/i18n";
import { seedMockData } from "@shared/api/mock/seedData";

// Импорт стилей и компонентов Vuetify
import "vuetify/styles";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import "@mdi/font/css/materialdesignicons.css";

// Создание экземпляра Vuetify с настройками
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "light", // Установка светлой темы по умолчанию
  },
  display: {
    mobileBreakpoint: "sm",
    thresholds: {
      // Определение пороговых значений для адаптивного дизайна
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
      xxl: 2560,
    },
  },
  icons: {
    defaultSet: "mdi", // Использование Material Design Icons по умолчанию
    aliases,
    sets: {
      mdi,
    },
  },
});

// Создание экземпляра приложения Vue
const app = createApp(App);

// Подключение плагинов
app.use(i18n);
app.use(VueQueryPlugin);
app.use(router);
app.use(vuetify);

// Инициализация тестовых данных
seedMockData();

// Монтирование приложения
app.mount("#app");
