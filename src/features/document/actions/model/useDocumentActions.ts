import { ref } from "vue";
import type { Document, TextBlock } from "@/entities/document/model/types";
import type { DocumentActionsState } from "./types";
import { useDocument } from "@/entities/document/model/useDocument";

// Композабл для управления действиями с документами (создание, удаление)
export function useDocumentActions() {
  // Состояние для отслеживания процессов создания/удаления и ошибок
  const state = ref<DocumentActionsState>({
    isDeleting: false,
    isCreating: false,
    error: null,
  });

  // Получение методов для работы с документами из основного композабла
  const { createDocument, deleteDocument } = useDocument();

  // Создание нового документа с начальным текстовым блоком
  const createNewDocument = async () => {
    // Предотвращение повторного создания документа
    if (state.value.isCreating) return;

    try {
      state.value.isCreating = true;
      // Создание начального блока с дефолтными настройками
      const initialBlock: TextBlock = {
        id: crypto.randomUUID(),
        content: "Начните печатать здесь...",
        fontFamily: "Arial",
        color: "#000000",
        textAlign: "left",
      };

      // Отправка запроса на создание документа
      return await createDocument.mutateAsync({
        blocks: [initialBlock],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      // Сохранение сообщения об ошибке
      state.value.error = err.message;
      throw err;
    } finally {
      // Сброс флага создания
      state.value.isCreating = false;
    }
  };

  // Удаление существующего документа
  const deleteExistingDocument = async (doc: Document) => {
    // Предотвращение повторного удаления документа
    if (state.value.isDeleting) return;

    try {
      state.value.isDeleting = true;
      // Отправка запроса на удаление документа
      await deleteDocument.mutateAsync(doc.id);
    } catch (err: any) {
      // Сохранение сообщения об ошибке
      state.value.error = err.message;
      throw err;
    } finally {
      // Сброс флага удаления
      state.value.isDeleting = false;
    }
  };

  return {
    state,
    createNewDocument,
    deleteExistingDocument,
  };
}
