import { StyleSheet, Text, View } from "react-native";

export default function EditorScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Editor</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    fontSize: 24,
    fontWeight: "600",
  },
});
