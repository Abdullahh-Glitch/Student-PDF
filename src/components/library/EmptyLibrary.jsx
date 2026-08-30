import { FileText, ScanLine } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "../../hooks/useTheme";

export default function EmptyLibrary({ onScan }) {
  const { color } = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: color.primaryLight,
          },
        ]}
      >
        <FileText size={32} color={color.primary} strokeWidth={2} />
      </View>

      <Text style={[styles.title, { color: color.text }]}>
        Your library is empty
      </Text>

      <Text
        style={[
          styles.description,
          {
            color: color.textSecondary,
          },
        ]}
      >
        Documents you scan or create will appear here.
      </Text>

      <Pressable
        onPress={onScan}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: color.primary,
          },
          pressed && styles.pressed,
        ]}
      >
        <ScanLine size={18} color={color.white} strokeWidth={2.2} />

        <Text
          style={[
            styles.buttonText,
            {
              color: color.white,
            },
          ]}
        >
          Scan a Document
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 320,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 28,
    paddingVertical: 35,
  },

  iconContainer: {
    width: 72,
    height: 72,

    borderRadius: 22,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 18,
  },

  title: {
    fontSize: 19,
    fontWeight: "750",

    textAlign: "center",
  },

  description: {
    marginTop: 7,

    maxWidth: 280,

    fontSize: 14,
    lineHeight: 20,

    textAlign: "center",
  },

  button: {
    marginTop: 22,

    height: 46,

    paddingHorizontal: 18,

    borderRadius: 14,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    marginLeft: 8,

    fontSize: 14,
    fontWeight: "700",
  },

  pressed: {
    opacity: 0.8,
  },
});
