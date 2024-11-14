import type {
  ColorOption,
  FontOption,
  AlignmentOption,
  FontSizeOption,
} from "@entities/editor/model/types";

// Настройка цветовой палитры для редактора
export const colors: ColorOption[] = [
  { value: "#000000", label: "editor.colors.black" },
  { value: "#FF0000", label: "editor.colors.red" },
  { value: "#00FF00", label: "editor.colors.green" },
  { value: "#0000FF", label: "editor.colors.blue" },
  { value: "#FFA500", label: "editor.colors.orange" },
  { value: "#800080", label: "editor.colors.purple" },
  { value: "#FFC0CB", label: "editor.colors.pink" },
  { value: "#A52A2A", label: "editor.colors.brown" },
];

// Доступные шрифты для текста
export const fonts: FontOption[] = [
  { title: "Arial", value: "Arial" },
  { title: "Times New Roman", value: "Times New Roman" },
  { title: "Courier New", value: "Courier New" },
  { title: "Georgia", value: "Georgia" },
  { title: "Verdana", value: "Verdana" },
];

// Варианты выравнивания текста с иконками и подсказками
export const alignments: AlignmentOption[] = [
  { icon: "mdi-format-align-left", value: "left", tooltip: "По левому краю" },
  { icon: "mdi-format-align-center", value: "center", tooltip: "По центру" },
  {
    icon: "mdi-format-align-right",
    value: "right",
    tooltip: "По правому краю",
  },
  { icon: "mdi-format-align-justify", value: "justify", tooltip: "По ширине" },
];

// Настройка размеров шрифта с соответствующими HTML-тегами и описаниями
export const fontSizes: FontSizeOption[] = [
  { title: "32px", value: 1, tag: "h1", description: "Очень большой" },
  { title: "24px", value: 2, tag: "h2", description: "Большой" },
  { title: "20px", value: 3, tag: "h3", description: "Средний" },
  { title: "18px", value: 4, tag: "h4", description: "Чуть больше" },
  { title: "16px", value: 0, tag: "p", description: "Обычный" },
  { title: "14px", value: 5, tag: "h5", description: "Чуть меньше" },
  { title: "12px", value: 6, tag: "h6", description: "Маленький" },
];
