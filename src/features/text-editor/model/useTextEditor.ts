import { ref, computed } from "vue";
import type { Editor as TiptapEditor } from "@tiptap/core";
import type { TextBlock } from "@entities/document/model/types";
import { useI18n } from "vue-i18n";

// Композабл для управления текстовым редактором
export function useTextEditor() {
  const activeBlock = ref<TextBlock | null>(null);
  const blocks = ref<TextBlock[]>([]);
  const { t, locale } = useI18n();

  // Добавление нового текстового блока
  const addBlock = () => {
    // Получаем локализованный текст в зависимости от текущего языка
    const defaultContent =
      locale.value === "ru"
        ? "<p>Начните печатать здесь...</p>"
        : "<p>Start typing here...</p>";

    const newBlock: TextBlock = {
      id: crypto.randomUUID(),
      content: defaultContent,
      fontFamily: "Arial",
      fontSize: "16px",
      color: "#000000",
      textAlign: "left",
      lastSaved: new Date().toISOString(),
    };
    blocks.value.push(newBlock);
    activeBlock.value = newBlock;
  };

  // Обновление содержимого блока
  const updateBlockContent = (blockId: string, editor: TiptapEditor) => {
    const block = blocks.value.find((b) => b.id === blockId);
    if (block) {
      block.content = editor.getHTML();
    }
  };

  // Проверка наличия блоков
  const hasBlocks = computed(() => blocks.value.length > 0);

  return {
    blocks,
    activeBlock,
    addBlock,
    updateBlockContent,
    hasBlocks,
  };
}
