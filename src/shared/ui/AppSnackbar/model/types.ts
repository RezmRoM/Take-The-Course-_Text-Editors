// Интерфейс пропсов для компонента уведомлений
export interface AppSnackbarProps {
  show: boolean
  text: string
  color?: 'success' | 'error'
}

// Интерфейс событий компонента уведомлений
export interface AppSnackbarEmits {
  (e: 'update:show', value: boolean): void
} 