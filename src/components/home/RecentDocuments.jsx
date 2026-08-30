import { ChevronRight, Clock3 } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "../../hooks/useTheme";

export default function RecentDocuments({ onSeeAll }) {
  const { color } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Clock3 size={19} color={color.primary} strokeWidth={2.2} />

          <Text style={[styles.title, { color: color.text }]}>
            Recent Documents
          </Text>
        </View>

        <Pressable
          onPress={onSeeAll}
          style={({ pressed }) => [
            styles.seeAllButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={[styles.seeAllText, { color: color.primary }]}>
            See all
          </Text>

          <ChevronRight size={16} color={color.primary} strokeWidth={2.3} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    marginLeft: 8,

    fontSize: 18,
    fontWeight: "700",
  },

  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",

    paddingVertical: 6,
    paddingLeft: 8,
  },

  seeAllText: {
    fontSize: 13,
    fontWeight: "600",
  },

  pressed: {
    opacity: 0.65,
  },
});
