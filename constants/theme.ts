import { Platform } from "react-native";

export const Colors = {
  light: {
    primary: "#2196F3",
    primaryContainer: "#E3F2FD",
    secondary: "#4CAF50",
    error: "#F44336",
    background: "#FFFFFF",
    surface: "#F5F5F5",
    surfaceVariant: "#EEEEEE",
    onSurface: "#212121",
    onSurfaceVariant: "#757575",
    text: "#212121",
    buttonText: "#FFFFFF",
    tabIconDefault: "#757575",
    tabIconSelected: "#2196F3",
    tabBarBackground: "#0D47A1",
    tabBarText: "#FFFFFF",
    link: "#2196F3",
    backgroundRoot: "#FFFFFF",
    backgroundDefault: "#F5F5F5",
    backgroundSecondary: "#EEEEEE",
    backgroundTertiary: "#E0E0E0",
    border: "#E0E0E0",
  },
  dark: {
    primary: "#90CAF9",
    primaryContainer: "#1565C0",
    secondary: "#81C784",
    error: "#EF5350",
    background: "#121212",
    surface: "#1E1E1E",
    surfaceVariant: "#2C2C2C",
    onSurface: "#E0E0E0",
    onSurfaceVariant: "#BDBDBD",
    text: "#E0E0E0",
    buttonText: "#FFFFFF",
    tabIconDefault: "#BDBDBD",
    tabIconSelected: "#90CAF9",
    tabBarBackground: "#0D47A1",
    tabBarText: "#FFFFFF",
    link: "#90CAF9",
    backgroundRoot: "#121212",
    backgroundDefault: "#1E1E1E",
    backgroundSecondary: "#2C2C2C",
    backgroundTertiary: "#383838",
    border: "#2C2C2C",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  inputHeight: 56,
  buttonHeight: 48,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700" as const,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
