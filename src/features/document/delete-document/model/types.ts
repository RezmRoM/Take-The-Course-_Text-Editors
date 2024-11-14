import type { Document } from '@/entities/document/model/types'

// Пропсы диалога удаления документа
export interface DeleteDocumentDialogProps {
  show: boolean
  document: Document | null
  isDeleting: boolean
}

// События диалога удаления документа
export interface DeleteDocumentDialogEmits {
  (e: 'update:show', value: boolean): void
  (e: 'confirm'): void
  (e: 'close'): void
}