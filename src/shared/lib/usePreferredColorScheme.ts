import { ref, onMounted, onUnmounted } from 'vue'

// Тип цветовой схемы (светлая или темная)
export type ColorScheme = 'light' | 'dark'

// Хук для отслеживания предпочитаемой цветовой схемы системы
export function usePreferredColorScheme() {
  const colorScheme = ref<ColorScheme>('light')

  // Обновление цветовой схемы на основе системных настроек
  const updateColorScheme = () => {
    colorScheme.value = window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light'
  }

  // Инициализация слушателя при монтировании компонента
  onMounted(() => {
    updateColorScheme()
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', updateColorScheme)
  })

  // Удаление слушателя при размонтировании компонента
  onUnmounted(() => {
    window.matchMedia('(prefers-color-scheme: dark)')
      .removeEventListener('change', updateColorScheme)
  })

  return colorScheme
} 