// Подключение типов для Vite, Vuetify и Vue
/// <reference types="vite/client" />
/// <reference types="vuetify" />
/// <reference types="@vue/runtime-core" />

// Определение типов для Vue компонентов
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// Расширение типов Vue и определение основных API
declare module "vue" {
  interface ComponentCustomProperties {
    $vuetify: any;
  }
  
  // Экспорт основных API Vue
  export { createApp } from '@vue/runtime-dom'
  export const ref: <T>(value: T) => { value: T }
  export const computed: <T>(getter: () => T) => { value: T }
  export const watch: any
  export const onMounted: (callback: () => void) => void
  export const onUnmounted: (callback: () => void) => void
  export const defineProps: <T>() => T
  export const defineEmits: <T>() => T
  export const withDefaults: <T, D>(props: T, defaults: D) => T & D
  export const toRaw: <T>(value: T) => T
}

// Определение типов для Vuetify и его компонентов
declare module "vuetify" {
  export { createVuetify } from 'vuetify/lib/framework'
  
  // Интерфейс пороговых значений для адаптивного дизайна
  interface DisplayThresholds {
    xs: number
    sm: number
    md: number
    lg: number
    xl: number
    xxl: number
  }

  // Интерфейс для работы с брейкпоинтами и адаптивностью
  interface DisplayBreakpoint {
    xs: boolean
    sm: boolean
    md: boolean
    lg: boolean
    xl: boolean
    xxl: boolean
    
    xsOnly: boolean
    smOnly: boolean
    smAndDown: boolean
    smAndUp: boolean
    mdOnly: boolean
    mdAndDown: boolean
    mdAndUp: boolean
    lgOnly: boolean
    lgAndDown: boolean
    lgAndUp: boolean
    xlOnly: boolean
    xlAndUp: boolean
    
    name: string
    height: number
    width: number
    mobile: boolean
    mobileBreakpoint: number | string
    thresholds: DisplayThresholds
    update: () => void
  }

  export const useDisplay: () => DisplayBreakpoint
}

// Определение типов для Vue Router и его методов
declare module "vue-router" {
  export { RouterView } from 'vue-router'
  export { createRouter, createWebHistory } from 'vue-router'
  export const useRouter: any
  export const useRoute: any
}

// Определение типов для TipTap редактора и его компонентов
declare module "@tiptap/vue-3" {
  import type { Editor } from "@tiptap/core"
  export { Editor }
  export const useEditor: any
  export const EditorContent: any
}

// Определение типов для базового набора расширений TipTap
declare module "@tiptap/starter-kit" {
  const StarterKit: any
  export default StarterKit
}

// Определение типов для расширения выравнивания текста
declare module "@tiptap/extension-text-align" {
  const TextAlign: any
  export default TextAlign
}

// Определение типов для расширения семейства шрифтов
declare module "@tiptap/extension-font-family" {
  const FontFamily: any
  export default FontFamily
}

// Определение типов для расширения стилей текста
declare module "@tiptap/extension-text-style" {
  const TextStyle: any
  export default TextStyle
}

// Определение типов для расширения цвета текста
declare module "@tiptap/extension-color" {
  const Color: any
  export default Color
}

// Определение типов для расширения подчеркивания текста
declare module "@tiptap/extension-underline" {
  const Underline: any
  export default Underline
}

// Определение типов для переменных окружения
interface ImportMetaEnv {
  readonly BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 