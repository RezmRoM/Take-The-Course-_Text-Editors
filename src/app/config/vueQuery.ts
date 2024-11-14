// Конфигурация TanStack Query
export const vueQueryConfig = {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        // Отключение автоматического обновления данных при фокусе окна
        refetchOnWindowFocus: false,
        // Количество повторных попыток при неудачном запросе
        retry: 1
      }
    }
  }
} 