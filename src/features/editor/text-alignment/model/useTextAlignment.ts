import { ref, watch, type Ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import type { AlignmentOption } from '@entities/editor/model/types'

// Массив опций выравнивания текста с их характеристиками
export const alignments: AlignmentOption[] = [
  {
    icon: 'mdi-format-align-left',
    value: 'left',
    tooltip: 'По левому краю',
  },
  {
    icon: 'mdi-format-align-center',
    value: 'center',
    tooltip: 'По центру',
  },
  {
    icon: 'mdi-format-align-right',
    value: 'right',
    tooltip: 'По правому краю',
  },
  {
    icon: 'mdi-format-align-justify',
    value: 'justify',
    tooltip: 'По ширине',
  },
]

// Композабл для управления выравниванием текста в редакторе
export function useTextAlignment(editor: Ref<Editor | undefined>) {
  // Текущее выравнивание текста
  const selectedAlign = ref<'left' | 'center' | 'right' | 'justify'>('left')

  // Установка выравнивания для выделенного текста
  const setAlignment = (alignment: typeof selectedAlign.value) => {
    if (!editor.value) return
    editor.value.chain().focus().setTextAlign(alignment).run()
    selectedAlign.value = alignment
  }

  // Отслеживание изменений редактора для обновления текущего выравнивания
  watch(editor, (newEditor) => {
    if (!newEditor) return

    alignments.forEach(({ value }) => {
      if (newEditor.isActive({ textAlign: value })) {
        selectedAlign.value = value
      }
    })
  }, { immediate: true })

  return {
    selectedAlign,
    setAlignment,
    alignments
  }
}