import { ref, watch, onMounted } from "vue";
import type { Document, TextBlock } from "@/entities/document/model/types";
import type {
  EditorPageState,
  DeleteDialogState,
  SnackbarState,
} from "./types";
import { useDocument } from "@/entities/document/model/useDocument";
import { useQueryClient } from "@tanstack/vue-query";
import { useI18n } from "vue-i18n";
import { seedMockData } from "@/shared/api/mock/seedData";

// Основной композабл для управления страницей редактора
export function useEditorPage() {
  // Состояние страницы редактора
  const state = ref<EditorPageState>({
    blocks: [],
    currentDocumentId: undefined,
    error: null,
    isLoading: false,
    showDocumentsList: false,
    savingBlocks: {},
    isDeleting: false,
    isCreating: false,
  });

  // Состояние диалога удаления документа
  const deleteDialog = ref<DeleteDialogState>({
    show: false,
    document: null,
  });

  // Состояние уведомлений
  const snackbar = ref<SnackbarState>({
    show: false,
    text: "",
    color: "success",
  });

  const queryClient = useQueryClient();
  const { t, locale } = useI18n();

  // Получение методов для работы с документами
  const {
    documents,
    document,
    createDocument,
    updateDocument,
    deleteDocument,
    isLoading: documentIsLoading,
    error: documentError,
    swapDocuments,
  } = useDocument();

  // Отображение уведомления с переводом
  const showSnackbar = (
    key: string,
    color: "success" | "error" = "success"
  ) => {
    snackbar.value = {
      show: true,
      text: t(`editor.notifications.${key}`),
      color,
    };
  };

  // Загузка документа
  const loadDocument = async (doc: Document | undefined) => {
    if (!doc) return;

    try {
      state.value.currentDocumentId = doc.id;
      state.value.blocks = doc.blocks;
      showSnackbar("documentLoaded");
    } catch (err) {
      showSnackbar("errorLoading", "error");
    }
  };

  // Сохранение блока текста
  const saveBlock = async (index: number) => {
    try {
      // ... логика сохранения
      showSnackbar("blockSaved");
    } catch (err) {
      showSnackbar("errorSaving", "error");
    }
  };

  // Создание нового документа
  const createNewDocument = async () => {
    state.value.isCreating = true;
    try {
      // Получаем локализованный текст в зависимости от текущего языка
      const defaultContent =
        locale.value === "ru"
          ? "<p>Начните печатать здесь...</p>"
          : "<p>Start typing here...</p>";

      const newDocument: Document = {
        id: crypto.randomUUID(),
        blocks: [
          {
            id: crypto.randomUUID(),
            content: defaultContent,
            fontFamily: "Arial",
            fontSize: "16px",
            color: "#000000",
            textAlign: "left",
            lastSaved: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const createdDoc = await createDocument.mutateAsync(newDocument);

      // Закрытие списка документов
      state.value.showDocumentsList = false;

      // Загрузка созданного документа
      await loadDocument(createdDoc);

      showSnackbar("documentCreated");
    } catch (err: any) {
      state.value.error = err.message;
      showSnackbar("errorCreating", "error");
    } finally {
      state.value.isCreating = false;
    }
  };

  // Подтверждение удаления документа
  const deleteConfirmed = async () => {
    const docToDelete = deleteDialog.value.document;
    if (!docToDelete) return;

    state.value.isDeleting = true;
    try {
      await deleteDocument.mutateAsync(docToDelete.id);
      showSnackbar("documentDeleted");
      closeDeleteDialog();

      // Загрузка следующего документа после удаления текущего
      if (docToDelete.id === state.value.currentDocumentId) {
        const remainingDocs = documents.value?.filter(
          (doc) => doc.id !== docToDelete.id
        );
        if (remainingDocs?.length) {
          await loadDocument(remainingDocs[0]);
        }
      }
    } catch (err: any) {
      state.value.error = err.message;
      showSnackbar("errorDeleting", "error");
    } finally {
      state.value.isDeleting = false;
    }
  };

  // Перемещение документа в списке
  const moveDocument = async (fromIndex: number, toIndex: number) => {
    if (!documents.value) return;

    try {
      const fromDoc = documents.value[fromIndex];
      const toDoc = documents.value[toIndex];

      await swapDocuments.mutateAsync({ fromDoc, toDoc });

      // Обновление текущего документа после перемещения
      if (state.value.currentDocumentId === fromDoc.id) {
        await loadDocument(toDoc);
      } else if (state.value.currentDocumentId === toDoc.id) {
        await loadDocument(fromDoc);
      }

      showSnackbar("orderChanged");
    } catch (err: any) {
      console.error("Move error:", err);
      state.value.error =
        err.message || "Ошибка при изменении порядка документов";
      showSnackbar("errorGeneral", "error");
    }
  };

  // Инициализация страницы редактора
  const initializeDocument = async () => {
    try {
      state.value.isLoading = true;

      // Сначала проверяем и создаем приветственный документ если нужно
      await seedMockData();

      // Затем получаем список документов
      await queryClient.fetchQuery({ queryKey: ["documents"] });
      const cachedDocs = queryClient.getQueryData<Document[]>(["documents"]);

      // Загружаем первый документ (это будет либо существующий, либо только что созданный приветственный)
      if (cachedDocs && cachedDocs.length > 0) {
        await loadDocument(cachedDocs[0]);
      }
      // Убираем создание нового документа, так как seedMockData уже создаст приветственный если нужно
    } catch (err: any) {
      console.error("Initialization error:", err);
      state.value.error = err.message || "Ошибка при инициализации";
      showSnackbar("errorInitialization", "error");
    } finally {
      state.value.isLoading = false;
    }
  };

  // Инициализация при монтировании компонента
  onMounted(() => {
    initializeDocument();
  });

  // Отслеживание ошибок документа
  watch(documentError, (newError: string | null) => {
    if (newError) {
      state.value.error = newError;
      setTimeout(() => {
        state.value.error = null;
      }, 5000);
    }
  });

  // Закрытие диалога удаления
  const closeDeleteDialog = () => {
    deleteDialog.value = {
      show: false,
      document: null,
    };
  };

  return {
    state,
    deleteDialog,
    snackbar,
    documents,
    document,
    documentIsLoading,
    updateDocument,
    loadDocument,
    createNewDocument,
    deleteConfirmed,
    showSnackbar,
    moveDocument,
    initializeDocument,
    closeDeleteDialog,
  };
}
