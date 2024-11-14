/** Пропсы для панели инструментов документа */
export interface DocumentToolbarProps {
  isLoading: boolean
  isDeleting: boolean
  isCreating: boolean
}

/** События панели инструментов документа */
export interface DocumentToolbarEmits {
  (e: 'toggle-documents'): void
  (e: 'create-document'): void
} 