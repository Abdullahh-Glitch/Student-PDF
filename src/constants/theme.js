import { Platform } from "react-native";

export const Colors = {
  light: {
    primary: "#4F46E5",
    primaryDark: "#4338CA",
    primaryLight: "#EEF2FF",

    background: "#F8F9FF",
    surface: "#FFFFFF",

    text: "#111827",
    textSecondary: "#6B7280",
    textTertiary: "#9CA3AF",

    border: "#E5E7EB",
    divider: "#F3F4F6",

    success: "#16A34A",
    error: "#DC2626",
    warning: "#D97706",

    white: "#FFFFFF",
    black: "#000000",
  },

  dark: {
    primary: "#6366F1",
    primaryDark: "#818CF8",
    primaryLight: "#1E1B4B",

    background: "#0F1117",
    surface: "#181B23",

    text: "#F8FAFC",
    textSecondary: "#9CA3AF",
    textTertiary: "#6B7280",

    border: "#2A2E38",
    divider: "#222630",

    success: "#22C55E",
    error: "#EF4444",
    warning: "#F59E0B",

    white: "#FFFFFF",
    black: "#000000",
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "System",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },

  android: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },

  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },

  web: {
    sans: "system-ui",
    serif: "serif",
    rounded: "ui-rounded",
    mono: "monospace",
  },
});

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const Shadows = {
  card: {
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  button: {
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
};

export const BottomTabInset =
  Platform.select({
    ios: 50,
    android: 80,
  }) ?? 0;

export const MaxContentWidth = 800;
