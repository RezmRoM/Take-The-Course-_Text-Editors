import { ref, onMounted, onUnmounted } from "vue";
import type { Editor } from "@tiptap/vue-3";
import type { SelectionMenuState } from "@entities/editor/model/types";

// Композабл для управления меню форматирования выделенного текста
export function useSelectionMenu(editor: Editor | undefined) {
  // Состояние меню форматирования
  const selectionMenu = ref<SelectionMenuState>({
    show: false,
    top: 0,
    left: 0,
  });

  // Обновление позиции меню форматирования при изменении выделения
  const updateSelectionMenu = () => {
    if (!editor?.value) return;

    const selection = window.getSelection();
    // Проверка наличия выделения текста
    if (!selection || selection.isCollapsed || !selection.rangeCount) {
      return;
    }

    // Получение координат выделенного текста
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Проверка, находится ли выделение внутри редактора
    const editorElement = editor.value.options.element;
    if (!editorElement.contains(selection.anchorNode)) {
      return;
    }

    // Установка позиции меню над выделенным текстом
    selectionMenu.value = {
      show: true,
      top: rect.top - 40, // Отступ на 40px выше выделения
      left: rect.left + rect.width / 2, // По центру выделения
    };
  };

  // Скрытие меню форматирования при клике вне кнопок форматирования
  const hideSelectionMenu = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const isFormatButton = target.closest('.selection-toolbar')
    if (!isFormatButton) {
      selectionMenu.value.show = false
    }
  };

  // Подписка на события при монтировании компонента
  onMounted(() => {
    document.addEventListener("selectionchange", updateSelectionMenu);
    document.addEventListener("mouseup", updateSelectionMenu);
    document.addEventListener("mousedown", hideSelectionMenu);
  });

  // Отписка от событий при размонтировании компонента
  onUnmounted(() => {
    document.removeEventListener("selectionchange", updateSelectionMenu);
    document.removeEventListener("mouseup", updateSelectionMenu);
    document.removeEventListener("mousedown", hideSelectionMenu);
  });

  return {
    selectionMenu,
    updateSelectionMenu,
    hideSelectionMenu,
  };
}
