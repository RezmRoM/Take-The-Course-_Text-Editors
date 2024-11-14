<script setup lang="ts">
import { Editor } from '@/widgets/editor'
import type { BlockManagerProps, BlockManagerEmits } from '../model/types'

const props = defineProps<BlockManagerProps>()
const emit = defineEmits<BlockManagerEmits>()

// Обработчик сохранения блока
const handleSaveBlock = async (index: number) => {
  try {
    await emit('save-block', index)
    emit('show-snackbar', 'blockSaved')
  } catch (err) {
    emit('show-snackbar', 'errorSaving', 'error')
  }
}

// Обработчик удаления блока
const handleRemoveBlock = async (index: number) => {
  try {
    await emit('remove-block', index)
    emit('show-snackbar', 'blockDeleted')
  } catch (err) {
    emit('show-snackbar', 'errorDeleting', 'error')
  }
}

// Обработчик добавления нового блока
const handleAddBlock = () => {
  emit('add-block')
  emit('show-snackbar', 'blockAdded')
}
</script>

<template>
  <div>
    <!-- Анимированный список блоков -->
    <v-slide-y-transition group>
      <div
        v-for="(block, index) in blocks"
        :key="block.id"
        :class="['mb-4', $vuetify.display.smAndDown ? 'mx-0' : 'mx-2']"
      >
        <!-- Компонент наведения для эффектов при ховере -->
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            v-bind="props"
            :elevation="isHovering ? 4 : 1"
            class="block-card"
            :class="$vuetify.display.smAndDown ? 'rounded-0' : ''"
          >
            <!-- Панель инструментов блока -->
            <v-toolbar
              flat
              color="primary"
              :height="$vuetify.display.smAndDown ? 48 : 56"
              class="px-2 px-sm-4"
            >
              <!-- Заголовок блока -->
              <v-toolbar-title class="text-white d-flex align-center">
                <v-icon start class="mr-2" :size="$vuetify.display.smAndDown ? 20 : 24">
                  mdi-text-box
                </v-icon>
                <span :class="$vuetify.display.smAndDown ? 'text-body-1' : 'text-h6'">
                  {{ $t('editor.blocks.title', { number: index + 1 }) }}
                </span>
              </v-toolbar-title>

              <v-spacer />

              <!-- Кнопки управления блоком -->
              <v-toolbar-items>
                <!-- Кнопка сохранения -->
                <v-btn
                  variant="text"
                  color="white"
                  :size="$vuetify.display.smAndDown ? 'small' : 'default'"
                  @click="handleSaveBlock(index)"
                  :loading="!!savingBlocks[index]"
                >
                  <v-icon start>mdi-content-save</v-icon>
                  <span class="d-none d-sm-inline">{{ $t('editor.blocks.save') }}</span>
                  <v-tooltip activator="parent" location="top">
                    {{ $t('editor.blocks.tooltips.save') }}
                  </v-tooltip>
                </v-btn>

                <!-- Кнопка удаления (отображается только если блоков больше одного) -->
                <v-btn
                  v-if="blocks.length > 1"
                  variant="text"
                  color="white"
                  :size="$vuetify.display.smAndDown ? 'small' : 'default'"
                  @click="handleRemoveBlock(index)"
                >
                  <v-icon>mdi-close-circle</v-icon>
                  <v-tooltip activator="parent" location="top">
                    {{ $t('editor.blocks.tooltips.delete') }}
                  </v-tooltip>
                </v-btn>
              </v-toolbar-items>
            </v-toolbar>

            <!-- Компонент редактора текста -->
            <Editor
              :block="block"
              @update:block="$emit('update:block', index, $event)"
            />
          </v-card>
        </v-hover>
      </div>
    </v-slide-y-transition>

    <!-- Карточка добавления нового блока -->
    <v-card
      class="mt-4 add-block-card"
      :class="$vuetify.display.smAndDown ? 'mx-2' : 'mx-4'"
      elevation="0"
      :rounded="$vuetify.display.smAndDown ? 'lg' : ''"
    >
      <!-- Кнопка добавления блока -->
      <v-btn
        block
        color="primary"
        :height="$vuetify.display.smAndDown ? 48 : 56"
        class="text-none"
        :class="$vuetify.display.smAndDown ? 'text-body-1' : 'text-h6'"
        prepend-icon="mdi-plus"
        @click="handleAddBlock"
      >
        {{ $t('editor.blocks.addText') }}
      </v-btn>
    </v-card>
  </div>
</template>

<style src="./styles/index.css" scoped></style> 