// Импорт API для работы с документами и типов
import { documentApi } from "@entities/document/api";
import type { Document } from "@entities/document/model/types";
import { i18n } from "@/app/providers/i18n";

// Начальные тестовые данные для заполнения БД
export const seedMockData = async () => {
  try {
    console.log("Checking for existing documents...");
    const documents = await documentApi.getAllDocuments();

    if (!documents || documents.length === 0) {
      console.log("No documents found, creating initial data...");

      // Получаем текущую локаль из i18n
      const currentLocale = i18n.global.locale.value;

      // Выбираем текст в зависимости от языка
      const welcomeContent = currentLocale === "ru"
        ? "<p>Добро пожаловать в текстовый редактор!</p><p>Это ваш первый документ. Начните печатать здесь или создайте новый документ.</p>"
        : "<p>Welcome to the text editor!</p><p>This is your first document. Start typing here or create a new document.</p>";

      const initialDoc: Document = {
        id: crypto.randomUUID(),
        blocks: [
          {
            id: crypto.randomUUID(),
            content: welcomeContent,
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

      await documentApi.createDocument(initialDoc);
      console.log("Initial welcome document created successfully");
    } else {
      console.log("Existing documents found:", documents.length);
    }
  } catch (error) {
    console.error("Error in seedMockData:", error);
  }
};
