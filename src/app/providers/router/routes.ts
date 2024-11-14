import type { RouteRecordRaw } from "vue-router";

// Определение маршрутов приложения
export const routes: RouteRecordRaw[] = [
  {
    // Главный маршрут - страница редактора
    path: "/",
    name: "editor",
    // Ленивая загрузка компонента страницы редактора
    component: () => import("@pages/editor/ui/EditorPage.vue"),
  },
  {
    // Обработка несуществующих маршрутов
    path: "/:pathMatch(.*)*",
    name: "not-found",
    // Перенаправление на главную страницу
    redirect: "/",
  },
];
