import { ref } from "vue";
import type { Document, TextBlock } from "@/entities/document/model/types";
import type { ManageDocumentState, ManageDocumentActions } from "./types";
import { useDocument } from "@/entities/document/model/useDocument";
import { useI18n } from "vue-i18n";

// Композабл для управления документом (создание, удаление, загрузка)
export function useManageDocument() {
  const { t, locale } = useI18n();
  const state = ref<ManageDocumentState>({
    isCreating: false,
    isDeleting: false,
    isLoading: false,
    error: null,
  });

  const {
    createDocument,
    deleteDocument,
    updateDocument,
    isLoading: documentIsLoading,
    error: documentError,
  } = useDocument();

  const actions: ManageDocumentActions = {
    // Создание нового документа
    createDocument: async () => {
      state.value.isCreating = true;
      try {
        // Получаем локализованный текст в зависимости от текущего языка
        const defaultContent =
          locale.value === "ru"
            ? "<p>Начните печатать здесь...</p>"
            : "<p>Start typing here...</p>";

        // Создание начального блока текста
        const initialBlock: TextBlock = {
          id: crypto.randomUUID(),
          content: defaultContent,
          fontFamily: "Arial",
          fontSize: "16px",
          color: "#000000",
          textAlign: "left",
          lastSaved: new Date().toISOString(),
        };

        // Отправка запроса на создание документа
        await createDocument.mutateAsync({
          blocks: [initialBlock],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } catch (err: any) {
        state.value.error = err.message;
        throw err;
      } finally {
        state.value.isCreating = false;
      }
    },

    // Удаление существующего документа
    deleteDocument: async (doc: Document) => {
      state.value.isDeleting = true;
      try {
        await deleteDocument.mutateAsync(doc.id);
      } catch (err: any) {
        state.value.error = err.message;
        throw err;
      } finally {
        state.value.isDeleting = false;
      }
    },

    // Загрузка существующего документа
    loadDocument: async (doc: Document) => {
      state.value.isLoading = true;
      try {
        await updateDocument.mutateAsync(doc);
      } catch (err: any) {
        state.value.error = err.message;
        throw err;
      } finally {
        state.value.isLoading = false;
      }
    },
  };

  return {
    state,
    actions,
    documentIsLoading,
    documentError,
  };
}
