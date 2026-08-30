import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../hooks/useTheme";

export default function NavigationItem({
  label,
  icon: Icon,
  active = false,
  onPress,
  isScan = false,
}) {
  const { color } = useTheme();

  if (isScan) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.scanWrapper,
          pressed && styles.scanPressed,
        ]}
      >
        <View
          style={[
            styles.scanButton,
            {
              backgroundColor: color.primary,
              borderColor: color.surface,
            },
          ]}
        >
          <Icon size={26} strokeWidth={2.2} color={color.white} />
        </View>

        <Text
          style={[
            styles.scanLabel,
            {
              color: color.primary,
            },
          ]}
        >
          {label}
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={[styles.iconContainer]}>
        <Icon
          size={20}
          strokeWidth={active ? 2.4 : 2}
          color={active ? color.primary : color.textSecondary}
        />
      </View>

      <Text
        style={[
          styles.label,
          {
            color: active ? color.primary : color.textSecondary,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 58,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
  },

  iconContainer: {
    width: 34,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },

  label: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: "600",
  },

  pressed: {
    opacity: 0.65,
    transform: [{ scale: 0.94 }],
  },

  scanWrapper: {
    width: 70,
    height: 82,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -22,
  },

  scanButton: {
    width: 58,
    height: 58,
    borderRadius: 29,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 4,

    elevation: 7,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.2,
    shadowRadius: 6,
  },

  scanLabel: {
    marginTop: 5,
    fontSize: 13,
    fontWeight: "700",
  },

  scanPressed: {
    transform: [{ scale: 0.92 }],
  },
});
