// Интерфейс для текстового блока документа
export interface TextBlock {
  id: string;            
  content: string;  
  fontFamily: string;          // Семейство шрифта (опционально)
  fontSize: string;           // Размер шрифта (опционально)
  color: string;               // Цвет текста (опционально)
  textAlign: string;          // Выравнивание текста (опционально)
  lastSaved: string | null;         
}

// Основной интерфейс документа
export interface Document {
  id: string;                 
  blocks: TextBlock[];     
  createdAt: string;  
  updatedAt: string;       
}

// Состояние меню выделения текста
export interface SelectionMenuState {
  show: boolean;                // Флаг отображения меню
  top: number;                  // Позиция сверху
  left: number;                 // Позиция слева
}

// Состояние диалога удаления
export interface DeleteDialogState {
  show: boolean;                // Флаг отображения диалога
  document: Document | null;     // Документ для удаления
}

// Уровни заголовков
export type Level = 1 | 2 | 3 | 4 | 5 | 6;

// Результат обмена позициями документов
export interface SwapDocumentsResult {
  doc1: Document;               // Первый документ после обмена
  doc2: Document;               // Второй документ после обмена
}

// Параметры для обмена позициями документов
export interface SwapDocumentsParams {
  fromDoc: Document;            // Исходный документ
  toDoc: Document;              // Целевой документ
}
