import { ref, type Ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import type { FontSizeOption, Level } from '@entities/editor/model/types'

// Массив опций размеров шрифта с их характеристиками
export const fontSizes: FontSizeOption[] = [
  { title: '32px', value: 1, tag: 'h1', description: 'Очень большой' },
  { title: '24px', value: 2, tag: 'h2', description: 'Большой' },
  { title: '20px', value: 3, tag: 'h3', description: 'Средний' },
  { title: '18px', value: 4, tag: 'h4', description: 'Чуть больше' },
  { title: '16px', value: 0, tag: 'p', description: 'Обычный' },
  { title: '14px', value: 5, tag: 'h5', description: 'Чуть меньше' },
  { title: '12px', value: 6, tag: 'h6', description: 'Маленький' },
].sort((a, b) => {
  // Извлечение числового значения из строки размера
  const aSize = parseInt(a.title);
  const bSize = parseInt(b.title);
  // Сортировка по убыванию
  return bSize - aSize;
});

// Композабл для управления размером шрифта в редакторе
export function useFontSize(editor: Ref<Editor | undefined>) {
  // Проверка активности определенного размера шрифта
  const isActiveFontSize = (level: number) => {
    if (!editor.value) return false
    if (level === 0) return editor.value.isActive('paragraph')
    return editor.value.isActive('heading', { level })
  }

  // Установка размера шрифта для выделенного текста
  const setFontSize = (level: Level) => {
    if (!editor.value) return
    if (level === 0) {
      editor.value.chain().focus().setParagraph().run()
    } else {
      editor.value.chain().focus().toggleHeading({ level }).run()
    }
  }

  return {
    isActiveFontSize,
    setFontSize,
    fontSizes
  }
}