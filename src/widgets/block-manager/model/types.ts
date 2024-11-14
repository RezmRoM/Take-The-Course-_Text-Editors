import type { TextBlock } from "@/entities/document/model/types";

// Интерфейс пропсов менеджера блоков
export interface BlockManagerProps {
  blocks: TextBlock[];
  // Объект для отслеживания состояния сохранения блоков по их индексу
  savingBlocks: Record<number, boolean>;
}

// Интерфейс событий менеджера блоков
export interface BlockManagerEmits {
  (e: "update:block", index: number, block: TextBlock): void;
  (e: "save-block", index: number): void;
  (e: "remove-block", index: number): void;
  (e: "add-block"): void;
  // Отображение уведомления с указанным ключом и цветом
  (e: "show-snackbar", key: string, color?: "success" | "error"): void;
}
