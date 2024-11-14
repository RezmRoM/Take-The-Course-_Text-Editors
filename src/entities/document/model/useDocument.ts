import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { documentApi } from "../api/documentApi";
import type { Document, SwapDocumentsParams } from "./types";
import { ref, toRaw } from "vue";

export const useDocument = (id?: string) => {
  const queryClient = useQueryClient();
  // Состояние ошибки
  const error = ref<string | null>(null);

  // Получение списка всех документов
  const documentsQuery = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      console.log("Fetching documents...");
      const docs = await documentApi.getAllDocuments();
      // Преобразование реактивных данных в обычный объект
      return toRaw(docs);
    },
  });

  // Получение конкретного документа по ID
  const documentQuery = useQuery({
    queryKey: ["document", id],
    queryFn: async () => {
      console.log("Fetching document:", id);
      const doc = await documentApi.getDocument(id!);
      // Преобразование реактивных данных в обычный объект
      return toRaw(doc);
    },
    // Запрос выполняется только при наличии ID
    enabled: !!id,
    // Отключение кэширования при переключении документов
    staleTime: 0,
    // Кэширование на 5 минут
    cacheTime: 1000 * 60 * 5,
  });

  // Создание нового документа
  const createDocument = useMutation({
    mutationFn: (document: Partial<Document>) =>
      documentApi.createDocument(document),
    onSuccess: (newDocument) => {
      // Обновление кэша после успешного создания
      queryClient.setQueryData(
        ["document", newDocument.id],
        toRaw(newDocument)
      );
      // Инвалидация кэша списка документов
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      error.value = null;
    },
    onError: (err: Error) => {
      error.value = err.message;
    },
  });

  // Обновление существующего документа
  const updateDocument = useMutation({
    mutationFn: async (document: Document) => {
      try {
        const result = await documentApi.updateDocument(document);
        return result;
      } catch (error: any) {
        console.error("Update mutation error:", error);
        throw new Error(error.message || "Failed to update document");
      }
    },
    onSuccess: (updatedDocument) => {
      // Обновление кэша конкретного документа
      queryClient.setQueryData(["document", updatedDocument.id], updatedDocument);
      // Обновление документа в списке всех документов
      queryClient.setQueryData<Document[]>(["documents"], (oldDocs) => {
        if (!oldDocs) return [updatedDocument];
        return oldDocs.map((doc) =>
          doc.id === updatedDocument.id ? updatedDocument : doc
        );
      });
      error.value = null;
    },
    onError: (err: Error) => {
      console.error("Update error:", err);
      error.value = err.message;
    },
  });

  // Удаление документа
  const deleteDocument = useMutation({
    mutationFn: (id: string) => documentApi.deleteDocument(id),
    onSuccess: (_, deletedId) => {
      // Удаление документа из кэша
      queryClient.removeQueries({ queryKey: ["document", deletedId] });
      // Обновление списка документов после удаления
      queryClient.setQueryData<Document[]>(["documents"], (oldDocs) => {
        if (!oldDocs) return [];
        return oldDocs.filter((doc) => doc.id !== deletedId);
      });
      console.log("Document deleted from cache:", deletedId);
      error.value = null;
    },
    onError: (err: Error) => {
      console.error("Delete error:", err);
      error.value = err.message;
    },
  });

  // Обмен позициями между документами
  const swapDocuments = useMutation({
    mutationFn: async ({ fromDoc, toDoc }: SwapDocumentsParams) => {
      return documentApi.swapDocuments(fromDoc, toDoc);
    },
    onSuccess: ({ doc1, doc2 }) => {
      // Обновление кэша для обоих документов
      queryClient.setQueryData(["document", doc1.id], doc1);
      queryClient.setQueryData(["document", doc2.id], doc2);
      
      // Обновление позиций документов в общем списке
      queryClient.setQueryData<Document[]>(["documents"], (oldDocs) => {
        if (!oldDocs) return [doc1, doc2];
        
        return oldDocs.map(doc => {
          if (doc.id === doc1.id) return doc1;
          if (doc.id === doc2.id) return doc2;
          return doc;
        });
      });
    },
    onError: (err: Error) => {
      console.error("Swap error:", err);
      throw err;
    },
  });

  return {
    documents: documentsQuery.data,
    document: documentQuery.data,
    // Состояние загрузки для всех операций
    isLoading:
      documentsQuery.isLoading ||
      documentQuery.isLoading ||
      createDocument.isPending ||
      updateDocument.isPending ||
      deleteDocument.isPending,
    error,
    createDocument,
    updateDocument,
    deleteDocument,
    swapDocuments,
  };
};
