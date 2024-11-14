<script setup lang="ts">
import type { AppSnackbarProps, AppSnackbarEmits } from './model/types'

// Определение пропсов компонента с дефолтным значением цвета 'success'
const props = withDefaults(defineProps<AppSnackbarProps>(), {
  color: 'success'
})

// Определение эмитов для обновления состояния видимости уведомления
const emit = defineEmits<AppSnackbarEmits>()
</script>

<template>
  <!-- Компонент уведомления Vuetify -->
  <v-snackbar 
    :model-value="show" 
    :color="color" 
    :timeout="3000" 
    location="top"
    @update:model-value="emit('update:show', $event)"
  >
    {{ text }}

    <template v-slot:actions>
      <!-- Кнопка закрытия уведомления -->
      <v-btn variant="text" @click="emit('update:show', false)">
        {{ $t('editor.documents.actions.close') }}
      </v-btn>
    </template>
  </v-snackbar>
</template> 