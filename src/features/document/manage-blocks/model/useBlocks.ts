import { ref } from 'vue'
import type { TextBlock } from '@/entities/document/model/types'
import type { BlocksState, BlocksActions } from './types'
import { useDocument } from '@/entities/document/model/useDocument'

// Композабл для управления текстовыми блоками документа
export function useBlocks() {
  // Инициализация состояния блоков
  const state = ref<BlocksState>({
    blocks: [],
    savingBlocks: {} // Объект для отслеживания состояния сохранения блоков
  })

  const { updateDocument } = useDocument()

  const actions: BlocksActions = {
    // Добавление нового текстового блока
    addBlock: () => {
      const newBlock: TextBlock = {
        id: crypto.randomUUID(),
        content: '',
        fontFamily: 'Arial',
        color: '#000000',
        textAlign: 'left'
      }
      state.value.blocks.push(newBlock)
    },

    // Удаление текстового блока по индексу
    removeBlock: (index: number) => {
      // Предотвращение удаления последнего блока
      if (state.value.blocks.length > 1) {
        state.value.blocks = state.value.blocks.filter((_, i) => i !== index)
      }
    },

    // Обновление содержимого блока по индексу
    updateBlock: (index: number, block: TextBlock) => {
      const newBlocks = [...state.value.blocks]
      newBlocks[index] = block
      state.value.blocks = newBlocks
    },

    // Сохранение изменений блока на сервере
    saveBlock: async (index: number) => {
      try {
        // Установка флага сохранения
        state.value.savingBlocks[index] = true
        // Логика сохранения с использованием updateDocument
        await updateDocument(state.value.blocks)
      } catch (err: any) {
        throw new Error(err.message || 'Error saving block')
      } finally {
        // Сброс флага сохранения
        state.value.savingBlocks[index] = false
      }
    }
  }

  return {
    state,
    actions
  }
} 