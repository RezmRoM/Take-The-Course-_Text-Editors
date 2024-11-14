<script setup lang="ts">
import { supportedLocales } from "@/shared/config/i18n.config";
import type {
  LanguageSwitcherProps,
  LanguageSwitcherEmits,
} from "../model/types";
import { useDisplay } from "vuetify";

const props = defineProps<LanguageSwitcherProps>();
const emit = defineEmits<LanguageSwitcherEmits>();

// Получение флага мобильного устройства из Vuetify
const { xs } = useDisplay();

// Обработка смены языка
const handleLocaleChange = (locale: string) => {
  emit("change", locale);
};
</script>

<template>
  <!-- Выпадающее меню для выбора языка -->
  <v-menu location="bottom end" transition="scale-transition">
    <template v-slot:activator="{ props: menuProps }">
      <!-- Кнопка переключения языка -->
      <v-btn
        v-bind="menuProps"
        variant="text"
        :size="xs ? 'small' : 'default'"
        class="language-btn"
        color="white"
        elevation="0"
      >
        <span class="locale-flag">{{
          supportedLocales.find((l) => l.code === currentLocale)?.flag
        }}</span>
        <span v-if="!xs" class="locale-name ml-2">
          {{ supportedLocales.find((l) => l.code === currentLocale)?.name }}
        </span>
        <v-icon size="small" class="ml-1">mdi-chevron-down</v-icon>
      </v-btn>
    </template>

    <!-- Карточка со списком языков -->
    <v-card min-width="200" elevation="4" rounded="lg" class="language-menu">
      <v-list>
        <!-- Элемент списка для каждого языка -->
        <v-list-item
          v-for="locale in supportedLocales"
          :key="locale.code"
          :value="locale.code"
          @click="handleLocaleChange(locale.code)"
          :active="currentLocale === locale.code"
          :class="{ 'selected-locale': currentLocale === locale.code }"
          class="locale-item"
        >
          <template v-slot:prepend>
            <span class="locale-flag">{{ locale.flag }}</span>
          </template>
          <v-list-item-title class="locale-title">{{
            locale.name
          }}</v-list-item-title>
          <template v-slot:append v-if="currentLocale === locale.code">
            <v-icon color="primary" size="small">mdi-check</v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<style src="./styles/index.css"></style>