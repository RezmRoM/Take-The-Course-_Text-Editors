<script setup lang="ts">
import { LanguageSwitcher } from "@/features/language-switcher";
import { useI18n } from "vue-i18n";
import type {
  DocumentToolbarProps,
  DocumentToolbarEmits,
} from "../model/types";

const props = defineProps<DocumentToolbarProps>();
const emit = defineEmits<DocumentToolbarEmits>();

// Получение текущей локали из i18n
const { locale } = useI18n();

// Обработка изменения языка
const handleLocaleChange = (newLocale: string) => {
  locale.value = newLocale;
};
</script>

<template>
  <!-- Верхняя панель приложения с адаптивной высотой -->
  <v-app-bar
    color="primary"
    elevation="2"
    :height="$vuetify.display.smAndDown ? 56 : 64"
  >
    <v-container class="px-2 px-sm-6" fluid>
      <div class="d-flex align-center">
        <!-- Заголовок приложения с иконкой -->
        <v-app-bar-title class="d-flex align-center">
          <v-icon :size="$vuetify.display.smAndDown ? 24 : 32" class="mr-2">
            mdi-text-box-edit
          </v-icon>
          <span
            :class="[
              $vuetify.display.smAndDown ? 'text-h6' : 'text-h5',
              'font-weight-bold',
            ]"
          >
            {{ $t("editor.title") }}
          </span>
        </v-app-bar-title>

        <v-spacer />

        <!-- Компонент переключения языка -->
        <LanguageSwitcher
          :current-locale="locale"
          @change="handleLocaleChange"
        />

        <!-- Индикатор загрузки с анимацией появления -->
        <v-fade-transition>
          <div v-if="isLoading || isDeleting" class="d-flex align-center">
            <span class="text-caption mr-2 d-none d-sm-block">
              {{
                isDeleting
                  ? $t("editor.documents.deleting")
                  : $t("editor.documents.loading")
              }}
            </span>
            <v-progress-circular
              indeterminate
              :size="$vuetify.display.smAndDown ? 16 : 20"
              color="white"
            />
          </div>
        </v-fade-transition>

        <!-- Кнопка открытия списка документов -->
        <v-btn icon class="ml-2" @click="$emit('toggle-documents')">
          <v-icon>mdi-file-document-multiple</v-icon>
          <v-tooltip activator="parent">{{
            $t("editor.toolbar.documents")
          }}</v-tooltip>
        </v-btn>

        <!-- Кнопка создания нового документа -->
        <v-btn
          icon
          class="ml-2"
          @click="$emit('create-document')"
          :loading="isCreating"
        >
          <v-icon>mdi-plus-circle</v-icon>
          <v-tooltip activator="parent">{{
            $t("editor.toolbar.new")
          }}</v-tooltip>
        </v-btn>
      </div>
    </v-container>
  </v-app-bar>
</template>
