import { FileText } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "../../hooks/useTheme";

export default function EmptyDocuments() {
  const { color } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: color.surface,
          borderColor: color.border,
        },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: color.primaryLight,
          },
        ]}
      >
        <FileText size={28} color={color.primary} strokeWidth={2} />
      </View>

      <Text style={[styles.title, { color: color.text }]}>
        No documents yet
      </Text>

      <Text style={[styles.description, { color: color.textSecondary }]}>
        Scan your first document and it will appear here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 14,

    minHeight: 170,

    borderRadius: 20,
    borderWidth: 1,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 24,
    paddingVertical: 24,
  },

  iconContainer: {
    width: 58,
    height: 58,

    borderRadius: 18,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
  },

  description: {
    marginTop: 5,

    fontSize: 13,
    lineHeight: 19,

    textAlign: "center",

    maxWidth: 270,
  },
});
