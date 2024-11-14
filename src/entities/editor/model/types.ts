import type { Editor } from '@tiptap/vue-3'

// Состояние меню выделения текста
export interface SelectionMenuState {
  show: boolean
  top: number
  left: number
}

// Опция шрифта
export interface FontOption {
  title: string
  value: string
}

// Опция цвета
export interface ColorOption {
  value: string
  label: string
}

// Опция выравнивания текста
export interface AlignmentOption {
  icon: string
  value: 'left' | 'center' | 'right' | 'justify'
  tooltip: string
}

// Опция размера шрифта
export interface FontSizeOption {
  title: string
  value: number
  tag: string
  description: string
}

// Уровни заголовков (0 - обычный текст, 1-6 - заголовки h1-h6)
export type Level = 0 | 1 | 2 | 3 | 4 | 5 | 6