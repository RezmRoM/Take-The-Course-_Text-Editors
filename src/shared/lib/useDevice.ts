import { computed } from 'vue'
import { useDisplay } from 'vuetify'

// Хук для определения параметров устройства и адаптивных стилей
export function useDevice() {
  const display = useDisplay()

  // Определение характеристик устройства
  const device = computed(() => ({
    isMobile: display.xs,
    isTablet: display.sm || display.md,
    isDesktop: display.lg || display.xl,
    isTouch: 'ontouchstart' in window,
    isLandscape: window.innerWidth > window.innerHeight,
    isReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    isHighDPI: window.devicePixelRatio > 1,
  }))

  // Адаптивные отступы в зависимости от устройства
  const spacing = computed(() => ({
    padding: device.value.isMobile ? '8px' : '16px',
    margin: device.value.isMobile ? '8px' : '16px',
    gap: device.value.isMobile ? '8px' : '16px',
    borderRadius: device.value.isMobile ? '8px' : '12px',
  }))

  // Адаптивная типография в зависимости от устройства
  const typography = computed(() => ({
    h1: device.value.isMobile ? '24px' : '32px',
    h2: device.value.isMobile ? '20px' : '24px',
    h3: device.value.isMobile ? '18px' : '20px',
    body: device.value.isMobile ? '14px' : '16px',
    caption: device.value.isMobile ? '12px' : '14px',
  }))

  return {
    device,
    spacing,
    typography
  }
} 