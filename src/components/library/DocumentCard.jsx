import { FileText, MoreVertical } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "../../hooks/useTheme";

export default function DocumentCard({
  title = "Sample Document",
  pages = 1,
  date = "Today",
  onPress,
  onMenu,
}) {
  const { color } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: color.surface,
          borderColor: color.border,
        },
        pressed && styles.pressed,
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
        <FileText size={25} color={color.primary} strokeWidth={2} />
      </View>

      <View style={styles.content}>
        <Text
          numberOfLines={1}
          style={[
            styles.title,
            {
              color: color.text,
            },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.details,
            {
              color: color.textSecondary,
            },
          ]}
        >
          {pages} {pages === 1 ? "page" : "pages"} · {date}
        </Text>
      </View>

      <Pressable onPress={onMenu} hitSlop={10} style={styles.menuButton}>
        <MoreVertical size={21} color={color.textSecondary} strokeWidth={2} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 76,

    flexDirection: "row",
    alignItems: "center",

    padding: 12,

    borderRadius: 18,
    borderWidth: 1,

    marginBottom: 10,
  },

  iconContainer: {
    width: 50,
    height: 50,

    borderRadius: 15,

    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    flex: 1,

    marginLeft: 13,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
  },

  details: {
    marginTop: 4,

    fontSize: 12,
  },

  menuButton: {
    width: 38,
    height: 38,

    alignItems: "center",
    justifyContent: "center",
  },

  pressed: {
    opacity: 0.7,
  },
});
