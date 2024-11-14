import axios from 'axios'

// Создание базового экземпляра axios с настройками
export const baseAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://65ca6d81adcb760b.mokky.dev',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // Таймаут запроса в миллисекундах
})

// Настройка перехватчика ответов
baseAPI.interceptors.response.use(
  // Успешный ответ возвращается без изменений
  (response) => response,
  // Обработка ошибок
  (error) => {
    let errorMessage = 'Произошла ошибка при сохранении'
    
    if (error.response) {
      // Формирование специфичных сообщений об ошибках в зависимости от статус-кода
      switch (error.response.status) {
        case 401:
          errorMessage = 'Ошибка авторизации. Проверьте API ключ'
          break
        case 403:
          errorMessage = 'Доступ запрещен'
          break
        case 404:
          errorMessage = 'Документ не найден'
          break
        case 400:
          errorMessage = 'Некорректные данные'
          break
        case 500:
          errorMessage = 'Ошибка сервера'
          break
        default:
          errorMessage = `Ошибка: ${error.response.status}`
      }
      
      // Логирование детальной информации об ошибке
      console.error('API Error:', {
        message: errorMessage,
        status: error.response.status,
        data: error.response.data,
        url: error.config.url,
        method: error.config.method
      })
    } else if (error.request) {
      // Обработка ошибок сети
      errorMessage = 'Нет ответа от сервера. Проверьте подключение к интернету'
      console.error('Network Error:', error.message)
    } else {
      // Обработка остальных ошибок
      console.error('Error:', error.message)
    }

    // Возврат отклоненного промиса с расширенной информацией об ошибке
    return Promise.reject({
      message: errorMessage,
      originalError: error
    })
  }
) 