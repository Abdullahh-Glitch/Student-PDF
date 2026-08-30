import { SortAsc } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "../../hooks/useTheme";

export default function LibraryHeader({ onSort }) {
  const { color } = useTheme();

  return (
    <View style={styles.container}>
      <View>
        <Text style={[styles.title, { color: color.text }]}>Your Library</Text>

        <Text style={[styles.subtitle, { color: color.textSecondary }]}>
          All your documents in one place.
        </Text>
      </View>

      <Pressable
        onPress={onSort}
        style={({ pressed }) => [
          styles.sortButton,
          {
            backgroundColor: color.surface,
            borderColor: color.border,
          },
          pressed && styles.pressed,
        ]}
      >
        <SortAsc size={20} color={color.textSecondary} strokeWidth={2} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 22,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.4,
  },

  subtitle: {
    marginTop: 5,

    fontSize: 14,
    lineHeight: 20,
  },

  sortButton: {
    width: 44,
    height: 44,

    borderRadius: 14,
    borderWidth: 1,

    alignItems: "center",
    justifyContent: "center",
  },

  pressed: {
    opacity: 0.65,
  },
});
