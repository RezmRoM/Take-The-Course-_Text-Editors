import type { Document } from '@entities/document/model/types'

// Интерфейс пропсов компонента списка документов
export interface DocumentListProps {
  documents: Document[] | undefined
  currentDocumentId?: string | undefined
  isLoading: boolean
  isCreating: boolean
}

// Интерфейс событий компонента списка документов
export interface DocumentListEmits {
  (e: 'load-document', document: Document): void
  (e: 'create-document'): void
  (e: 'delete-document', document: Document): void
} 