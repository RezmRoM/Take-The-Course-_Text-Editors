import { ref, type Ref } from "vue";
import type { Editor } from "@tiptap/vue-3";
import { colors, fonts } from "@shared/config/editor.config";

// Композабл для управления форматированием текста в редакторе
export function useTextFormatting(editor: Ref<Editor | undefined>) {
  const selectedFont = ref('Arial')
  const selectedColor = ref('#000000')

  // Установка шрифта для выделенного текста
  const setFont = (font: string) => {
    if (!editor.value) return
    editor.value.chain().focus().setFontFamily(font).run()
    selectedFont.value = font
  }

  // Установка цвета для выделенного текста
  const setColor = (color: string) => {
    if (!editor.value) return
    editor.value.chain().focus().setColor(color).run()
    selectedColor.value = color
  }

  return {
    selectedFont,
    selectedColor,
    setFont,
    setColor,
    fonts,
    colors
  }
}
