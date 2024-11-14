// Локаль по умолчанию
export const defaultLocale = "ru";

// Поддерживаемые локали с названиями и флагами
export const supportedLocales = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
];

// Словарь переводов для всех поддерживаемых языков
export const messages = {
  // Английская локализация
  en: {
    editor: {
      title: "Text Editor",
      toolbar: {
        font: "Font",
        fontSize: "Font Size",
        textColor: "Text Color",
        new: "New Document",
        documents: "Documents",
        chooseColor: "Choose Color",
        formatting: {
          bold: "Bold",
          italic: "Italic",
          underline: "Underline",
          strike: "Strikethrough"
        },
        align: {
          left: "Align left",
          center: "Center",
          right: "Align right",
          justify: "Justify",
          tooltip: "Text alignment"
        }
      },
      documents: {
        title: "Documents List",
        search: "Search documents",
        searchPlaceholder: "Type to search...",
        new: "New Document",
        empty: "No documents found",
        emptySearch: "Try changing your search query",
        emptyCreate: "Create a new document to get started",
        untitled: "Untitled",
        created: "Created",
        updated: "Updated",
        loading: "Loading...",
        deleting: "Deleting...",
        creating: "Creating...",
        saving: "Saving...",
        dragHint: "Drag to reorder",
        actions: {
          edit: "Edit",
          editTooltip: "Edit document",
          delete: "Delete",
          deleteTooltip: "Delete document",
          close: "Close",
          save: "Save",
          create: "Create"
        }
      },
      blocks: {
        title: "Block {number}",
        addText: "Add Text Block",
        save: "Save",
        saveTooltip: "Save block",
        delete: "Delete",
        deleteTooltip: "Delete block",
        tooltips: {
          add: "Add new block",
          delete: "Delete block",
          drag: "Drag to reorder",
          save: "Save block"
        }
      },
      notifications: {
        blockSaved: "Block saved successfully",
        blockDeleted: "Block deleted successfully",
        blockAdded: "New block added",
        documentSaved: "Document saved successfully",
        documentDeleted: "Document deleted successfully",
        documentCreated: "Document created successfully",
        documentLoaded: "Document loaded successfully",
        orderChanged: "Document order changed",
        error: "An error occurred",
        errorSaving: "Error while saving",
        errorDeleting: "Error while deleting",
        errorCreating: "Error while creating",
        errorLoading: "Error while loading",
        errorGeneral: "Something went wrong",
        documentNotSelected: "No document selected"
      },
      colors: {
        black: "Black",
        white: "White",
        gray: "Gray",
        red: "Red",
        orange: "Orange",
        yellow: "Yellow",
        green: "Green",
        blue: "Blue",
        purple: "Purple",
        pink: "Pink",
        brown: "Brown"
      },
      delete: {
        title: 'Delete Document',
        message: 'Are you sure you want to delete this document?',
        cancel: 'Cancel',
        confirm: 'Delete'
      }
    }
  },
  // Русская локализация
  ru: {
    editor: {
      title: "Текстовый редактор",
      toolbar: {
        font: "Шрифт",
        fontSize: "Размер шрифта",
        textColor: "Цвет текста",
        new: "Новый документ",
        documents: "Документы",
        chooseColor: "Выберите цвет",
        formatting: {
          bold: "Жирный",
          italic: "Курсив",
          underline: "Подчёркнутый",
          strike: "Зачёркнутый"
        },
        align: {
          left: "По левому краю",
          center: "По центру",
          right: "По правому краю",
          justify: "По ширине",
          tooltip: "Выравнивание текста"
        }
      },
      documents: {
        title: "Список документов",
        search: "Поиск документов",
        searchPlaceholder: "Введите для поиска...",
        new: "Новый документ",
        empty: "Нет документов",
        emptySearch: "Попробуйте изменить поисковый запрос",
        emptyCreate: "Создайте новый документ, чтобы начать работу",
        untitled: "Без названия",
        created: "Создан",
        updated: "Обновлен",
        loading: "Загрузка...",
        deleting: "Удаление...",
        creating: "Создание...",
        saving: "Сохранение...",
        dragHint: "Перетащите для изменения порядка",
        actions: {
          edit: "Редактировать",
          editTooltip: "Редактировать документ",
          delete: "Удалить",
          deleteTooltip: "Удалить документ",
          close: "Закрыть",
          save: "Сохранить",
          create: "Создать"
        }
      },
      blocks: {
        title: "Блок {number}",
        addText: "Добавить текстовый блок",
        save: "Сохранить",
        saveTooltip: "Сохранить блок",
        delete: "Удалить",
        deleteTooltip: "Удалить блок",
        tooltips: {
          add: "Добавить новый блок",
          delete: "Удалить блок",
          drag: "Перетащите для изменения порядка",
          save: "Сохранить блок"
        }
      },
      notifications: {
        blockSaved: "Блок успешно сохранен",
        blockDeleted: "Блок успешно удален",
        blockAdded: "Добавлен новый блок",
        documentSaved: "Документ успешно сохранен",
        documentDeleted: "Документ успешно удален",
        documentCreated: "Документ успешно создан",
        documentLoaded: "Документ успешно загружен",
        orderChanged: "Порядок документов изменен",
        error: "Произошла ошибка",
        errorSaving: "Ошибка при сохранении",
        errorDeleting: "Ошибка при удалении",
        errorCreating: "Ошибка при создании",
        errorLoading: "Ошибка при загрузке",
        errorGeneral: "Что-то пошло не так"
      },
      colors: {
        black: "Черный",
        white: "Белый",
        gray: "Серый",
        red: "Красный",
        orange: "Оранжевый",
        yellow: "Желтый",
        green: "Зеленый",
        blue: "Синий",
        purple: "Фиолетовый",
        pink: "Розовый",
        brown: "Коричневый"
      },
      delete: {
        title: 'Удалить документ',
        message: 'Вы уверены, что хотите удалить этот документ?',
        cancel: 'Отмена',
        confirm: 'Удалить'
      }
    }
  }
};
