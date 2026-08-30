import { Camera } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "../../hooks/useTheme";

export default function QuickScanCard({ onPress }) {
  const { color } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: color.primary,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Camera size={28} color={color.white} strokeWidth={2.2} />
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: color.white }]}>
            Scan a document
          </Text>

          <Text style={[styles.subtitle, { color: color.primaryLight }]}>
            Capture your notes, assignments and study material.
          </Text>
        </View>
      </View>

      <View style={styles.action}>
        <Text style={[styles.actionText, { color: color.white }]}>
          Scan Now
        </Text>

        <Text style={[styles.arrow, { color: color.white }]}>→</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 150,

    borderRadius: 24,

    padding: 20,

    justifyContent: "space-between",

    elevation: 4,

    shadowOffset: {
      width: 0,
      height: 5,
    },

    shadowOpacity: 0.12,
    shadowRadius: 10,
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 56,
    height: 56,

    borderRadius: 18,

    backgroundColor: "rgba(255,255,255,0.16)",

    alignItems: "center",
    justifyContent: "center",
  },

  textContainer: {
    flex: 1,

    marginLeft: 14,
  },

  title: {
    fontSize: 19,
    fontWeight: "750",
  },

  subtitle: {
    marginTop: 5,

    fontSize: 13,

    lineHeight: 18,
  },

  action: {
    flexDirection: "row",
    alignItems: "center",

    alignSelf: "flex-end",

    marginTop: 12,
  },

  actionText: {
    fontSize: 14,
    fontWeight: "700",
  },

  arrow: {
    marginLeft: 7,

    fontSize: 20,
    fontWeight: "500",
  },
});
