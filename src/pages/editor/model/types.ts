import type { Document, TextBlock } from "@/entities/document/model/types";

// Состояние страницы редактора
export interface EditorPageState {
  blocks: TextBlock[];
  currentDocumentId?: string;
  error: string | null;
  isLoading: boolean;
  showDocumentsList: boolean;
  savingBlocks: Record<number, boolean>;
  isDeleting: boolean;
  isCreating: boolean;
}

// Состояние диалога удаления документа
export interface DeleteDialogState {
  show: boolean;
  document: Document | null;
}

// Состояние уведомления
export interface SnackbarState {
  show: boolean;
  text: string;
  color: "success" | "error";
}

// Пропсы компонента списка документов
export interface DocumentListProps {
  documents: Document[] | undefined;
  currentDocumentId?: string | undefined;
  isLoading: boolean;
  isCreating: boolean;
}

// События компонента списка документов
export interface DocumentListEmits {
  (e: "load-document", document: Document): void;
  (e: "create-document"): void;
  (e: "delete-document", document: Document): void;
  (e: "move-document", fromIndex: number, toIndex: number): void;
  (e: "close"): void;
}
