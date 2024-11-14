import type { Document } from '@/entities/document/model/types'

// Состояние действий с документом
export interface DocumentActionsState {
  isDeleting: boolean      // Флаг процесса удаления документа
  isCreating: boolean      // Флаг процесса создания документа
  error: string | null     // Сообщение об ошибке
}

// События действий с документом
export interface DocumentActionsEmits {
  (e: 'delete', document: Document): void   // Событие удаления документа
  (e: 'create'): void                       // Событие создания нового документа  
  (e: 'load', document: Document): void     // Событие загрузки документа
}