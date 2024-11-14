import type { TextBlock } from '@/entities/document/model/types'

// Состояние блоков документа
export interface BlocksState {
  blocks: TextBlock[]
  savingBlocks: Record<number, boolean>  // Флаги сохранения для каждого блока
}

// Действия для управления блоками
export interface BlocksActions {
  addBlock: () => void
  removeBlock: (index: number) => void
  updateBlock: (index: number, block: TextBlock) => void
  saveBlock: (index: number) => Promise<void>
}