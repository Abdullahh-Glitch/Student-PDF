import { useColorScheme } from "react-native";
import { Colors } from "../constants/theme";

export function useTheme() {
  const scheme = useColorScheme();

  const mode = scheme === "dark" ? "dark" : "light";

  return {
    mode,
    color: Colors[mode],
  };
}
