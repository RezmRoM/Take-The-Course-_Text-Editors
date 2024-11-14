<script setup lang="ts">
import type { Document } from "@/entities/document/model/types";
import type {
  DocumentListProps,
  DocumentListEmits,
} from "@/pages/editor/model/types";
import { ref, computed } from "vue";
import { useDisplay } from "vuetify";

const props = defineProps<DocumentListProps>();
const emit = defineEmits<DocumentListEmits>();

// Состояние для drag & drop функционала
const draggedItem = ref<number | null>(null);
const dragOverItem = ref<number | null>(null);
const isDragging = ref(false);

// Состояние поиска
const searchQuery = ref("");

// Фильтрация документов на основе поискового запроса
const filteredDocuments = computed(() => {
  if (!props.documents) return [];
  if (!searchQuery.value) return props.documents;

  return props.documents.filter((doc) => {
    const content = doc.blocks[0]?.content || "";
    return content.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

// Обработка начала перетаскивания при клике на точки
const startDrag = (event: MouseEvent, index: number) => {
  // Находим ближайший draggable элемент (v-list-item)
  const listItem = (event.target as HTMLElement).closest('.document-item') as HTMLElement;
  if (!listItem) return;

  // Устанавливаем draggable атрибут
  listItem.draggable = true;
  
  // Добавляем класс для визуального эффекта
  listItem.classList.add('dragging');
  
  // Устанавливаем индекс перетаскиваемого элемента
  draggedItem.value = index;
  isDragging.value = true;

  // Удаляем draggable атрибут после окончания перетаскивания
  const cleanup = () => {
    listItem.draggable = false;
    listItem.classList.remove('dragging');
    window.removeEventListener('dragend', cleanup);
  };
  
  window.addEventListener('dragend', cleanup);
};

// Обновленный обработчик начала перетаскивания
const onDragStart = (index: number, e: DragEvent) => {
  if (!e.dataTransfer) return;
  
  isDragging.value = true;
  draggedItem.value = index;
  
  // Устанавливаем эффект перемещения
  e.dataTransfer.effectAllowed = 'move';
  
  // Добавляем пустое изображение для скрытия стандартного превью
  const img = new Image();
  img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
  e.dataTransfer.setDragImage(img, 0, 0);
  
  // Добавляем класс для стилизации
  const element = e.target as HTMLElement;
  const listItem = element.closest('.document-item');
  if (listItem) {
    listItem.classList.add('dragging');
  }
};

// Обновленный обработчик окончания перетаскивания
const onDragEnd = (e: DragEvent) => {
  isDragging.value = false;
  draggedItem.value = null;
  dragOverItem.value = null;

  // Удаляем класс dragging со всех элементов
  const items = document.querySelectorAll('.document-item');
  items.forEach(item => item.classList.remove('dragging'));
};

// Обработка перетаскивания над элементом
const onDragOver = (index: number, e: DragEvent) => {
  e.preventDefault();
  dragOverItem.value = index;
};

// Обработка выхода за пределы элемента при перетаскивании
const onDragLeave = () => {
  dragOverItem.value = null;
};

// Обработка сброса перетаскиваемого элемента
const onDrop = async (targetIndex: number, e: DragEvent) => {
  e.preventDefault();
  if (draggedItem.value === null || !props.documents) return;

  console.log("Dropping item", draggedItem.value, "to", targetIndex);

  if (draggedItem.value !== targetIndex) {
    await emit("move-document", draggedItem.value, targetIndex);
  }

  // Очистка состояния перетаскивания
  draggedItem.value = null;
  dragOverItem.value = null;
  isDragging.value = false;
};

// Загрузка выбранного документа
const handleLoadDocument = async (doc: Document) => {
  if (props.currentDocumentId === doc.id) return; // Пропуск повторной загрузки того же документа
  emit("load-document", doc);
};

// Форматирование даты в российском формате
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// Вычисление динамической высоты списка
const listHeight = computed(() => {
  const itemCount = filteredDocuments.value.length;
  // 84px - примерная высота одного элемента списка
  const height = Math.min(itemCount * 84, 400); // 400px - максимальная высота
  return itemCount ? `${height}px` : "0px";
});

// Определение параметров отображения для адаптивности
const display = useDisplay();

// Обработка жестов на мобильных устройствах
const touchStartY = ref(0);
const touchEndY = ref(0);

// Обработка начала касания
const handleTouchStart = (e: TouchEvent) => {
  touchStartY.value = e.touches[0].clientY;
};

// Обработка движения пальца
const handleTouchMove = (e: TouchEvent) => {
  touchEndY.value = e.touches[0].clientY;
};

// Обработка окончания касания
const handleTouchEnd = (index: number) => {
  const swipeDistance = touchEndY.value - touchStartY.value;
  if (Math.abs(swipeDistance) > 50) {
    // Минимальное расстояние для свайпа
    if (swipeDistance < 0) {
      // Свайп вверх - удаление документа
      emit("delete-document", props.documents![index]);
    }
  }
};
</script>

<template>
  <v-card
    class="document-list"
    :class="{
      mobile: display.mobile,
      xs: display.xs,
      sm: display.sm,
    }"
  >
    <!-- Заголовок карточки -->
    <v-card-title
      class="d-flex align-center"
      :class="{
        'pa-4': !display.mobile,
        'pa-2': display.mobile,
        'text-h5': !display.xs,
        'text-h6': display.xs,
      }"
    >
      <span>{{ $t("editor.documents.title") }}</span>
      <v-spacer />
      <v-btn
        color="primary"
        variant="tonal"
        prepend-icon="mdi-plus"
        @click="emit('create-document')"
        :loading="isCreating"
        :size="display.mobile ? 'small' : 'default'"
      >
        <span v-if="!display.xs">{{
          $t("editor.documents.actions.create")
        }}</span>
        <v-tooltip v-else activator="parent">{{
          $t("editor.documents.actions.create")
        }}</v-tooltip>
      </v-btn>
    </v-card-title>

    <!-- Поле поиска -->
    <v-card-text
      :class="{ 'pa-4 pt-0': !display.mobile, 'pa-2': display.mobile }"
    >
      <v-text-field
        v-model="searchQuery"
        :label="$t('editor.documents.search')"
        :placeholder="$t('editor.documents.searchPlaceholder')"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        :density="display.mobile ? 'compact' : 'comfortable'"
        hide-details
        class="mb-4"
        clearable
      />

      <!-- Список документов -->
      <v-expand-transition>
        <div
          class="list-container"
          :style="{
            height: listHeight,
            maxHeight: display.mobile ? '60vh' : '70vh',
          }"
        >
          <v-list class="document-list-items">
            <v-slide-y-transition group>
              <v-list-item
                v-for="(doc, index) in filteredDocuments"
                :key="doc.id"
                :active="doc.id === currentDocumentId"
                class="document-item"
                :class="{
                  'mb-3': !display.mobile,
                  'mb-2': display.mobile,
                  dragging: draggedItem === index,
                  'drag-over': dragOverItem === index && draggedItem !== index,
                  'is-dragging': isDragging,
                }"
                elevation="2"
                rounded="lg"
                :draggable="!display.mobile"
                @dragstart="onDragStart(index, $event)"
                @dragend="onDragEnd"
                @dragover.prevent="onDragOver(index, $event)"
                @dragleave="onDragLeave"
                @drop="onDrop(index, $event)"
                @touchstart="handleTouchStart"
                @touchmove="handleTouchMove"
                @touchend="() => handleTouchEnd(index)"
              >
                <!-- Иконка для перетаскивания (только для десктопа) -->
                <template v-slot:prepend>
                  <div 
                    class="drag-handle" 
                    :draggable="!display.mobile"
                    @mousedown="startDrag($event, index)"
                    @dragstart="onDragStart(index, $event)"
                  >
                    <div class="dots-grid">
                      <div v-for="n in 6" :key="n" class="dot"></div>
                    </div>
                  </div>
                </template>

                <!-- Содержимое документа -->
                <v-list-item-title
                  class="d-flex align-center cursor-pointer"
                  :class="{ 'text-body-2': display.mobile }"
                  @click="handleLoadDocument(doc)"
                >
                  <v-icon
                    :color="
                      doc.id === currentDocumentId ? 'primary' : 'grey-darken-1'
                    "
                    class="mr-2"
                    :size="display.mobile ? 18 : 20"
                  >
                    mdi-file-document-outline
                  </v-icon>
                  <div
                    class="document-content"
                    :class="{ 'mobile-content': display.mobile }"
                  >
                    {{
                      (doc.blocks[0]?.content || "Без названия").replace(
                        /<[^>]*>/g,
                        ""
                      )
                    }}
                  </div>
                </v-list-item-title>

                <!-- Временная метка документа -->
                <v-list-item-subtitle
                  class="d-flex align-center mt-1"
                  :class="{
                    'text-caption': !display.mobile,
                    'text-caption text-body-2': display.mobile,
                  }"
                >
                  <v-icon :size="display.mobile ? 14 : 16" class="mr-1">
                    mdi-clock-outline
                  </v-icon>
                  {{ formatDate(doc.updatedAt) }}
                </v-list-item-subtitle>

                <!-- Кнопки действий -->
                <template v-slot:append>
                  <div class="d-flex align-center">
                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-pencil"
                          variant="text"
                          :size="display.mobile ? 'x-small' : 'small'"
                          @click="handleLoadDocument(doc)"
                        />
                      </template>
                      <span>{{
                        $t("editor.documents.actions.editTooltip")
                      }}</span>
                    </v-tooltip>

                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-delete"
                          variant="text"
                          :size="display.mobile ? 'x-small' : 'small'"
                          color="error"
                          @click="emit('delete-document', doc)"
                        />
                      </template>
                      <span>{{
                        $t("editor.documents.actions.deleteTooltip")
                      }}</span>
                    </v-tooltip>
                  </div>
                </template>
              </v-list-item>
            </v-slide-y-transition>
          </v-list>
        </div>
      </v-expand-transition>

      <!-- Состояние пустого списка -->
      <v-fade-transition>
        <div
          v-if="filteredDocuments.length === 0"
          class="text-center py-8 text-grey-darken-1"
        >
          <v-icon
            icon="mdi-file-search-outline"
            :size="display.mobile ? 36 : 48"
            color="grey-darken-1"
            class="mb-2"
          />
          <div :class="display.mobile ? 'text-body-2' : 'text-body-1'">
            {{
              searchQuery
                ? $t("editor.documents.emptySearch")
                : $t("editor.documents.empty")
            }}
          </div>
          <div :class="display.mobile ? 'text-caption' : 'text-body-2'">
            {{ $t("editor.documents.emptyCreate") }}
          </div>
        </div>
      </v-fade-transition>
    </v-card-text>

    <!-- Действия карточки -->
    <v-card-actions
      :class="{ 'pa-4': !display.mobile, 'pa-2': display.mobile }"
    >
      <v-spacer />
      <v-btn
        color="grey-darken-1"
        variant="text"
        @click="emit('close')"
        :size="display.mobile ? 'small' : 'default'"
      >
        {{ $t("editor.documents.actions.close") }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style src="./styles/index.css" scoped></style>
