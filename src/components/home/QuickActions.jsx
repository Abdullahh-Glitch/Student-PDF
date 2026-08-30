import { FilePlus2, ImagePlus } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "../../hooks/useTheme";

export default function QuickActions({ onImport, onCreate }) {
  const { color } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { color: color.text }]}>Quick Actions</Text>

      <View style={styles.actions}>
        <Pressable
          onPress={onImport}
          style={({ pressed }) => [
            styles.actionCard,
            {
              backgroundColor: color.surface,
              borderColor: color.border,
              transform: [{ scale: pressed ? 0.97 : 1 }],
            },
          ]}
        >
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: color.primaryLight },
            ]}
          >
            <ImagePlus size={22} color={color.primary} strokeWidth={2.2} />
          </View>

          <Text style={[styles.actionTitle, { color: color.text }]}>
            Import
          </Text>

          <Text style={[styles.actionSubtitle, { color: color.textSecondary }]}>
            From gallery
          </Text>
        </Pressable>

        <Pressable
          onPress={onCreate}
          style={({ pressed }) => [
            styles.actionCard,
            {
              backgroundColor: color.surface,
              borderColor: color.border,
              transform: [{ scale: pressed ? 0.97 : 1 }],
            },
          ]}
        >
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: color.primaryLight },
            ]}
          >
            <FilePlus2 size={22} color={color.primary} strokeWidth={2.2} />
          </View>

          <Text style={[styles.actionTitle, { color: color.text }]}>
            Create PDF
          </Text>

          <Text style={[styles.actionSubtitle, { color: color.textSecondary }]}>
            From images
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 28,
  },

  heading: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
  },

  actions: {
    flexDirection: "row",
    gap: 12,
  },

  actionCard: {
    flex: 1,

    minHeight: 125,

    padding: 16,

    borderRadius: 20,
    borderWidth: 1,

    justifyContent: "center",
  },

  iconContainer: {
    width: 44,
    height: 44,

    borderRadius: 14,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 12,
  },

  actionTitle: {
    fontSize: 15,
    fontWeight: "700",
  },

  actionSubtitle: {
    marginTop: 3,
    fontSize: 12,
  },
});
