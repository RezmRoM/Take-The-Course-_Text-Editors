<script setup lang="ts">
// Импорт основных компонентов и типов TipTap
import {
  useEditor,
  EditorContent,
  type Editor as TiptapEditor,
} from "@tiptap/vue-3";

// Импорт расширений TipTap
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import FontFamily from "@tiptap/extension-font-family";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Underline from "@tiptap/extension-underline";

// Импорт утилит Vuetify
import { useDisplay } from "vuetify";

// Импорт пользовательских хуков для работы с редактором
import { useTextFormatting } from "@features/editor/text-formatting/model/useTextFormatting";
import { useTextAlignment } from "@features/editor/text-alignment/model/useTextAlignment";
import { useFontSize } from "@features/editor/font-size/model/useFontSize";
import { useSelectionMenu } from "@features/editor/selection-menu/model/useSelectionMenu";

// Импорт типов и конфигурации
import type { TextBlock } from "@entities/document/model/types";
import { colors } from "@shared/config/editor.config";

// Импорт стилей
import "./styles/toolbar.css";

// Определение входных параметров компонента
const props = withDefaults(
  defineProps<{
    block: TextBlock;
    modelValue?: string;
  }>(),
  {
    modelValue: "",
  }
);

// Определение событий компонента
const emit = defineEmits<{
  "update:modelValue": [value: string];
  "update:block": [block: TextBlock];
}>();

// Инициализация редактора с конфигурацией
const editor = useEditor({
  content: props.modelValue || props.block.content,
  extensions: [
    // Настройка базового набора расширений
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3, 4, 5, 6],
      },
      bold: {
        HTMLAttributes: {
          class: "font-weight-bold",
        },
      },
      italic: {
        HTMLAttributes: {
          class: "font-style-italic",
        },
      },
      strike: {
        HTMLAttributes: {
          class: "text-decoration-line-through",
        },
      },
    }),
    // Подключение дополнительных расширений
    TextStyle,
    Color.configure({ types: ["textStyle"] }),
    TextAlign.configure({
      types: ["paragraph", "heading"],
      alignments: ["left", "center", "right", "justify"],
      defaultAlignment: "left",
    }),
    FontFamily,
    Underline,
  ],
  // Обработка обновления содержимого
  onUpdate: ({ editor }) => {
    const html = editor.getHTML();
    emit("update:modelValue", html);
    emit("update:block", {
      ...props.block,
      content: html,
    });
  },
  // Обработка изменения выделения текста
  onSelectionUpdate: () => {
    updateSelectionMenu();
  },
});

// Инициализация хуков для работы с форматированием текста
const { selectedFont, selectedColor, setFont, setColor, fonts } =
  useTextFormatting(editor);
const { selectedAlign, setAlignment, alignments } = useTextAlignment(editor);
const { isActiveFontSize, setFontSize, fontSizes } = useFontSize(editor);
const { selectionMenu, updateSelectionMenu } = useSelectionMenu(editor);

// Получение информации о размере экрана
const { xs, sm, md } = useDisplay();

// Обработчик выбора выравнивания текста
const handleAlignmentSelect = (
  alignment: "left" | "center" | "right" | "justify"
) => {
  setAlignment(alignment);
};
</script>

<template>
  <div class="editor-wrapper">
    <div class="editor-container">
      <v-toolbar
        flat
        :density="$vuetify.display.smAndDown ? 'compact' : 'comfortable'"
        color="grey-lighten-5"
        border
        class="editor-toolbar"
      >
        <div
          class="tools-container"
          :class="{ mobile: $vuetify.display.smAndDown }"
        >
          <!-- Выбор шрифта -->
          <v-select
            v-model="selectedFont"
            :items="fonts"
            :label="$t('editor.toolbar.font')"
            variant="outlined"
            density="compact"
            hide-details
            class="tool-item font-select"
            prepend-inner-icon="mdi-format-font"
            @update:model-value="setFont"
          >
            <v-tooltip activator="parent">
              {{ $t("editor.toolbar.tooltips.font") }}
            </v-tooltip>
          </v-select>

          <!-- Меню выбора размера шрифта -->
          <v-menu location="bottom" transition="scale-transition">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                variant="outlined"
                class="tool-item font-size-btn"
              >
                <v-icon start>mdi-format-size</v-icon>
                <span class="hide-on-mobile">{{
                  $t("editor.toolbar.fontSize")
                }}</span>
              </v-btn>
            </template>

            <v-list density="compact">
              <v-list-item
                v-for="size in fontSizes"
                :key="size.value"
                :value="size.value"
                @click="setFontSize(size.value)"
              >
                <v-list-item-title>
                  {{ size.title }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <!-- Меню выбора цвета текста -->
          <v-menu
            :close-on-content-click="false"
            location="bottom"
            transition="scale-transition"
          >
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                variant="outlined"
                class="tool-item color-btn"
              >
                <v-icon start :color="selectedColor">mdi-circle</v-icon>
                <span class="hide-on-mobile">{{
                  $t("editor.toolbar.textColor")
                }}</span>
              </v-btn>
            </template>

            <v-card
              :min-width="$vuetify.display.smAndDown ? 280 : 320"
              class="color-picker-card"
              elevation="4"
            >
              <v-card-title class="text-subtitle-1 px-4 py-2">
                {{ $t("editor.toolbar.chooseColor") }}
              </v-card-title>
              <v-divider />
              <v-card-text class="pa-4">
                <div class="color-grid">
                  <v-tooltip
                    v-for="color in colors"
                    :key="color.value"
                    :text="$t(color.label)"
                    location="top"
                  >
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        :color="color.value"
                        :size="$vuetify.display.smAndDown ? 36 : 40"
                        elevation="2"
                        class="color-btn-grid"
                        :class="{
                          'color-selected': selectedColor === color.value,
                        }"
                        @click="setColor(color.value)"
                      >
                        <v-icon
                          v-if="selectedColor === color.value"
                          color="white"
                          size="small"
                        >
                          mdi-check
                        </v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>
                </div>
              </v-card-text>
            </v-card>
          </v-menu>

          <!-- Кнопки выравнивания текста -->
          <v-btn-group variant="outlined" class="tool-item align-buttons">
            <v-btn
              v-for="align in alignments"
              :key="align.value"
              icon
              :color="selectedAlign === align.value ? 'primary' : undefined"
              @click="handleAlignmentSelect(align.value)"
            >
              <v-icon>{{ align.icon }}</v-icon>
              <v-tooltip activator="parent" location="top">
                {{ $t(`editor.toolbar.align.${align.value}`) }}
              </v-tooltip>
            </v-btn>
          </v-btn-group>

          <!-- Кнопки форматирования текста -->
          <v-btn-group variant="outlined" class="tool-item format-buttons">
            <v-btn
              icon
              :color="editor?.isActive('bold') ? 'primary' : undefined"
              @click="editor?.chain().focus().toggleBold().run()"
            >
              <v-icon>mdi-format-bold</v-icon>
              <v-tooltip activator="parent" location="top">
                {{ $t("editor.toolbar.formatting.bold") }}
              </v-tooltip>
            </v-btn>

            <v-btn
              icon
              :color="editor?.isActive('italic') ? 'primary' : undefined"
              @click="editor?.chain().focus().toggleItalic().run()"
            >
              <v-icon>mdi-format-italic</v-icon>
              <v-tooltip activator="parent" location="top">
                {{ $t("editor.toolbar.formatting.italic") }}
              </v-tooltip>
            </v-btn>

            <v-btn
              icon
              :color="editor?.isActive('underline') ? 'primary' : undefined"
              @click="editor?.chain().focus().toggleUnderline().run()"
            >
              <v-icon>mdi-format-underline</v-icon>
              <v-tooltip activator="parent" location="top">
                {{ $t("editor.toolbar.formatting.underline") }}
              </v-tooltip>
            </v-btn>

            <v-btn
              icon
              :color="editor?.isActive('strike') ? 'primary' : undefined"
              @click="editor?.chain().focus().toggleStrike().run()"
            >
              <v-icon>mdi-format-strikethrough</v-icon>
              <v-tooltip activator="parent" location="top">
                {{ $t("editor.toolbar.formatting.strike") }}
              </v-tooltip>
            </v-btn>
          </v-btn-group>
        </div>
      </v-toolbar>

      <!-- Основное содержимое редактора -->
      <v-card-text
        class="editor-content"
        :class="{
          'pa-2': xs,
          'pa-3': sm,
          'pa-4': md,
        }"
      >
        <editor-content :editor="editor" />
      </v-card-text>
    </div>

    <!-- Всплывающая панель форматирования при выделении текста -->
    <Teleport to="body">
      <div
        v-show="selectionMenu.show"
        class="selection-toolbar"
        :style="{
          top: `${selectionMenu.top}px`,
          left: `${selectionMenu.left}px`,
        }"
      >
        <v-btn-group
          density="compact"
          variant="elevated"
          class="selection-buttons"
        >
          <!-- Меню выбора шрифта во всплывающей панели -->
          <v-menu location="top" :close-on-content-click="false">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" size="small" class="font-select-btn">
                <v-icon size="small">mdi-format-font</v-icon>
              </v-btn>
            </template>
            <v-list density="compact">
              <v-list-item
                v-for="font in fonts"
                :key="font.value"
                :value="font.value"
                @click="setFont(font.value)"
              >
                <v-list-item-title :style="{ fontFamily: font.value }">
                  {{ font.title }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <!-- Меню выбора размера шрифта во всплывающей панели -->
          <v-menu location="top" :close-on-content-click="false">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" size="small" class="font-size-btn">
                <v-icon size="small" start>mdi-format-size</v-icon>
              </v-btn>
            </template>
            <v-list density="compact">
              <v-list-item
                v-for="size in fontSizes"
                :key="size.value"
                :value="size.value"
                @click="setFontSize(size.value)"
                :active="isActiveFontSize(size.value)"
              >
                <v-list-item-title>
                  {{ size.title }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <!-- Кнопки форматирования во всплывающей панели -->
          <v-btn
            size="small"
            icon
            :color="editor?.isActive('bold') ? 'primary' : undefined"
            @click="editor?.chain().focus().toggleBold().run()"
          >
            <v-icon size="small">mdi-format-bold</v-icon>
          </v-btn>

          <v-btn
            size="small"
            icon
            :color="editor?.isActive('italic') ? 'primary' : undefined"
            @click="editor?.chain().focus().toggleItalic().run()"
          >
            <v-icon size="small">mdi-format-italic</v-icon>
          </v-btn>

          <v-btn
            size="small"
            icon
            :color="editor?.isActive('underline') ? 'primary' : undefined"
            @click="editor?.chain().focus().toggleUnderline().run()"
          >
            <v-icon size="small">mdi-format-underline</v-icon>
          </v-btn>

          <v-btn
            size="small"
            icon
            :color="editor?.isActive('strike') ? 'primary' : undefined"
            @click="editor?.chain().focus().toggleStrike().run()"
          >
            <v-icon size="small">mdi-format-strikethrough</v-icon>
          </v-btn>

          <!-- Меню выбора цвета во всплывающей панели -->
          <v-menu location="top" :close-on-content-click="false">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                size="small"
                class="color-btn"
                :style="{ backgroundColor: selectedColor }"
              >
                <v-icon
                  size="small"
                  :color="selectedColor === '#000000' ? 'white' : 'black'"
                >
                  mdi-palette
                </v-icon>
              </v-btn>
            </template>
            <v-card min-width="320">
              <v-card-text class="pa-2">
                <div class="color-grid">
                  <v-btn
                    v-for="color in colors"
                    :key="color.value"
                    icon
                    class="color-btn-grid"
                    :class="{ 'color-selected': selectedColor === color.value }"
                    :style="{ backgroundColor: color.value }"
                    @click="setColor(color.value)"
                  >
                    <v-icon
                      v-if="selectedColor === color.value"
                      :color="color.value === '#000000' ? 'white' : 'black'"
                      size="small"
                    >
                      mdi-check
                    </v-icon>
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-menu>

          <!-- Кнопки выравнивания во всплывающей панели -->
          <v-btn-group variant="outlined" class="align-buttons">
            <v-btn
              v-for="align in alignments"
              :key="align.value"
              size="small"
              icon
              :color="selectedAlign === align.value ? 'primary' : undefined"
              @click="handleAlignmentSelect(align.value)"
            >
              <v-icon size="small">{{ align.icon }}</v-icon>
            </v-btn>
          </v-btn-group>
        </v-btn-group>
      </div>
    </Teleport>
  </div>
</template>

<style src="./styles/index.css" scoped></style>
