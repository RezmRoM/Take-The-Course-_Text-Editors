<script setup lang="ts">
import { DocumentList } from "@/widgets/document-list";
import { DocumentToolbar } from "@/widgets/document-toolbar";
import { DeleteDocumentDialog } from "@/features/document/delete-document";
import { AppSnackbar } from "@/shared/ui/AppSnackbar";
import { useEditorPage } from "../model/useEditorPage";
import { BlockManager } from "@/widgets/block-manager";
import type { Document, TextBlock } from "@/entities/document/model/types";

// Получение состояния и методов из композабла страницы редактора
const {
  state,
  deleteDialog,
  snackbar,
  documents,
  document,
  documentIsLoading,
  updateDocument,
  loadDocument,
  createNewDocument,
  deleteConfirmed,
  showSnackbar,
  moveDocument,
} = useEditorPage();

// Открытие диалога подтверждения удаления
const confirmDelete = (doc: Document) => {
  deleteDialog.value = {
    show: true,
    document: doc,
  };
};

// Закрытие диалога удаления
const closeDeleteDialog = () => {
  deleteDialog.value.show = false;
  deleteDialog.value.document = null;
};

// Добавление нового текстового блока
const addBlock = () => {
  const newBlock: TextBlock = {
    id: crypto.randomUUID(),
    content: "",
    fontFamily: "Arial",
    fontSize: "16px",
    color: "#000000",
    textAlign: "left",
    lastSaved: null
  };
  state.value.blocks.push(newBlock);
};

// Удаление текстового блока
const removeBlock = (index: number) => {
  if (state.value.blocks.length > 1) {
    state.value.blocks = state.value.blocks.filter(
      (_, i: number) => i !== index
    );
  }
};

// Обновление текстового блока
const updateBlock = (index: number, block: TextBlock) => {
  const newBlocks = [...state.value.blocks];
  newBlocks[index] = block;
  state.value.blocks = newBlocks;
};

// Сохранение текстового блока
const saveBlock = async (index: number) => {
  if (!state.value.currentDocumentId) {
    showSnackbar('documentNotSelected', 'error');
    return;
  }

  state.value.savingBlocks[index] = true;
  try {
    const updatedDocument: Document = {
      id: state.value.currentDocumentId,
      blocks: state.value.blocks.map((block, i) => ({
        ...block,
        lastSaved: i === index ? new Date().toISOString() : block.lastSaved,
      })),
      createdAt: document.value?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await updateDocument.mutateAsync(updatedDocument);

    state.value.blocks = result.blocks;
    showSnackbar('blockSaved');
  } catch (err: any) {
    console.error("Save error:", err);
    showSnackbar('errorSaving', 'error');
  } finally {
    state.value.savingBlocks[index] = false;
  }
};
</script>

<template>
  <v-layout class="fill-height">
    <!-- Панель инструментов документа -->
    <DocumentToolbar
      :is-loading="documentIsLoading || state.isLoading"
      :is-deleting="state.isDeleting"
      :is-creating="state.isCreating"
      @toggle-documents="state.showDocumentsList = !state.showDocumentsList"
      @create-document="createNewDocument"
    />

    <!-- Индикатор загрузки -->
    <v-overlay
      v-model="state.isLoading"
      class="align-center justify-center"
      persistent
    >
      <v-progress-circular
        indeterminate
        size="64"
        color="primary"
      />
    </v-overlay>

    <!-- Диалог со списком документов -->
    <v-dialog v-model="state.showDocumentsList" max-width="500">
      <DocumentList
        :documents="documents"
        :current-document-id="state.currentDocumentId"
        :is-loading="documentIsLoading"
        :is-creating="state.isCreating"
        @load-document="loadDocument"
        @create-document="createNewDocument"
        @delete-document="confirmDelete"
        @move-document="moveDocument"
        @close="state.showDocumentsList = false"
      />
    </v-dialog>

    <!-- Диалог подтверждения удаления -->
    <DeleteDocumentDialog
      v-model:show="deleteDialog.show"
      :document="deleteDialog.document"
      :is-deleting="state.isDeleting"
      @confirm="deleteConfirmed"
      @close="closeDeleteDialog"
    />

    <!-- Основная область редактора -->
    <v-main class="bg-grey-lighten-4 editor-main">
      <v-container
        fluid
        class="fill-height pa-0 pa-sm-2 pa-md-4 editor-container"
      >
        <v-row justify="center" align="start" no-gutters>
          <v-col
            cols="12"
            :class="[
              $vuetify.display.lgAndUp ? 'px-8' : 'px-0',
              $vuetify.display.smAndDown ? 'px-0' : 'px-4',
            ]"
          >
            <!-- Отображение ошибок -->
            <v-slide-y-transition>
              <v-alert
                v-if="state.error"
                type="error"
                variant="tonal"
                closable
                class="mb-4 mx-2"
                @click:close="state.error = null"
              >
                {{ state.error }}
              </v-alert>
            </v-slide-y-transition>

            <!-- Менеджер текстовых блоков -->
            <BlockManager
              :blocks="state.blocks"
              :saving-blocks="state.savingBlocks"
              @update:block="updateBlock"
              @save-block="saveBlock"
              @remove-block="removeBlock"
              @add-block="addBlock"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Уведомления -->
    <AppSnackbar
      v-model:show="snackbar.show"
      :text="snackbar.text"
      :color="snackbar.color"
    />
  </v-layout>
</template>

<style src="./styles/index.css"></style>