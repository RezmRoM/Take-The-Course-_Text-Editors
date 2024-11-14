import type { Document } from '@/entities/document/model/types'

// Состояние управления документом
export interface ManageDocumentState {
  isCreating: boolean
  isDeleting: boolean
  isLoading: boolean
  error: string | null
}

// Действия для управления документом
export interface ManageDocumentActions {
  createDocument: () => Promise<void>
  deleteDocument: (doc: Document) => Promise<void>
  loadDocument: (doc: Document) => Promise<void>
}
