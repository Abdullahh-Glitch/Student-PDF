import { Search, X } from "lucide-react-native";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { useTheme } from "../../hooks/useTheme";

export default function SearchDocuments({ value, onChangeText }) {
  const { color } = useTheme();

  const hasText = value?.length > 0;

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
      <Search size={20} color={color.textSecondary} strokeWidth={2} />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search documents..."
        placeholderTextColor={color.textTertiary}
        style={[
          styles.input,
          {
            color: color.text,
          },
        ]}
        returnKeyType="search"
        autoCorrect={false}
      />

      {hasText && (
        <Pressable
          onPress={() => onChangeText("")}
          style={styles.clearButton}
          hitSlop={8}
        >
          <X size={18} color={color.textSecondary} strokeWidth={2.2} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 15,

    borderRadius: 16,
    borderWidth: 1,
  },

  input: {
    flex: 1,

    marginLeft: 10,

    fontSize: 14,

    paddingVertical: 0,
  },

  clearButton: {
    width: 30,
    height: 30,

    alignItems: "center",
    justifyContent: "center",
  },
});
