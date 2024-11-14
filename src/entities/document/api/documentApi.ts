import { baseAPI } from "@shared/api/base";
import type { Document, SwapDocumentsResult, SwapDocumentsParams } from "../model/types";

export const documentApi = {
  // Получение списка всех документов
  getAllDocuments: async () => {
    console.log("Fetching all documents...");
    const { data } = await baseAPI.get<Document[]>("/documents");
    console.log("Fetched documents:", data);
    return data;
  },

  // Получение документа по ID
  getDocument: async (id: string) => {
    console.log("Fetching document:", id);
    const { data } = await baseAPI.get<Document>(`/documents/${id}`);
    console.log("Fetched document:", data);
    return data;
  },

  // Обновление существующего документа
  updateDocument: async (document: Document) => {
    console.log("Updating document with ID:", document.id);
    try {
      // Проверка наличия обязательных полей
      if (!document.id) {
        throw new Error("Document ID is required for update");
      }

      // Формирование данных для обновления
      const payload = {
        ...document,
        updatedAt: new Date().toISOString(),
      };

      console.log("Sending update payload:", payload);

      const { data } = await baseAPI.patch<Document>(
        `/documents/${document.id}`,
        payload
      );

      console.log("Document updated successfully:", data);
      return data;
    } catch (error: any) {
      console.error("Error updating document:", error);
      
      // Если документ не найден (404), пробуем создать новый
      if (error.response?.status === 404) {
        console.log("Document not found, creating new one...");
        return documentApi.createDocument(document);
      }

      // Переброс ошибки с более информативным сообщением
      throw new Error(error.message || "Failed to update document");
    }
  },

  // Создание нового документа
  createDocument: async (document: Partial<Document>) => {
    console.log("Creating new document...");
    // Формирование объекта нового документа с обязательными полями
    const newDocument = {
      ...document,
      id: document.id || crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("Sending new document:", newDocument);
    const { data } = await baseAPI.post<Document>("/documents", newDocument);
    console.log("Document created:", data);
    return data;
  },

  // Удаление документа по ID
  deleteDocument: async (id: string) => {
    console.log("Deleting document:", id);
    try {
      const { data } = await baseAPI.delete<Document>(`/documents/${id}`);
      console.log("Document deleted successfully:", id);
      return data;
    } catch (error: any) {
      console.error("Error deleting document:", error);
      throw error;
    }
  },

  // Обмен позициями между двумя документами
  swapDocuments: async (fromDoc: Document, toDoc: Document): Promise<SwapDocumentsResult> => {
    console.log("Swapping documents:", fromDoc.id, toDoc.id);
    try {
      // Сохранение оригинальных ID
      const id1 = fromDoc.id;
      const id2 = toDoc.id;

      // Создание копий документов с обновленными позициями
      const updatedDoc1 = {
        ...toDoc,
        id: id1,
        updatedAt: new Date().toISOString()
      };

      const updatedDoc2 = {
        ...fromDoc,
        id: id2,
        updatedAt: new Date().toISOString()
      };

      // Параллельное обновление обоих документов
      const [result1, result2] = await Promise.all([
        baseAPI.patch(`/documents/${id1}`, updatedDoc1),
        baseAPI.patch(`/documents/${id2}`, updatedDoc2)
      ]);

      return {
        doc1: result1.data,
        doc2: result2.data
      };
    } catch (error: any) {
      console.error("Error swapping documents:", error);
      throw new Error(error.message || "Failed to swap documents");
    }
  },
};
