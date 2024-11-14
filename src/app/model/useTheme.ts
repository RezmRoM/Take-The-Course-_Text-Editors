import { ref, watch } from 'vue'
import { usePreferredColorScheme } from '@shared/lib/usePreferredColorScheme'

// Композабл для управления темной/светлой темой приложения
export function useTheme() {
  const isDark = ref(false)
  const preferredScheme = usePreferredColorScheme()

  // Синхронизация с системной темой
  watch(preferredScheme, (newScheme) => {
    isDark.value = newScheme === 'dark'
  }, { immediate: true })

  return {
    isDark
  }
} 