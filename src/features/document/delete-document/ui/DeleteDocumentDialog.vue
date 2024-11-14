<script setup lang="ts">
// Импорт типов для пропсов и событий диалога удаления документа
import type { DeleteDocumentDialogProps, DeleteDocumentDialogEmits } from '../model/types'

const props = defineProps<DeleteDocumentDialogProps>()
const emit = defineEmits<DeleteDocumentDialogEmits>()
</script>

<template>
  <!-- Диалоговое окно подтверждения удаления документа -->
  <v-dialog :model-value="show" max-width="400">
    <v-card>
      <!-- Заголовок диалога -->
      <v-card-title>{{ $t('editor.delete.title') }}</v-card-title>
      <v-card-text>
        <!-- Сообщение с предупреждением об удалении -->
        <p>{{ $t('editor.delete.message') }}</p>
        <!-- Отображение даты создания документа -->
        <p v-if="document" class="mt-2 text-grey">
          {{ $t('editor.documents.created') }}: {{ new Date(document.createdAt).toLocaleString() }}
        </p>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <!-- Кнопка отмены удаления -->
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="emit('update:show', false)"
        >
          {{ $t('editor.delete.cancel') }}
        </v-btn>
        <!-- Кнопка подтверждения удаления -->
        <v-btn
          color="error"
          variant="tonal"
          :loading="isDeleting"
          @click="emit('confirm')"
        >
          {{ $t('editor.delete.confirm') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template> 