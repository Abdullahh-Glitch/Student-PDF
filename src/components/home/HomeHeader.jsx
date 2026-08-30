import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../hooks/useTheme";

export default function HomeHeader() {
  const { color } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.greeting, { color: color.textSecondary }]}>
        Welcome back 👋
      </Text>

      <Text style={[styles.title, { color: color.text }]}>Student PDF</Text>

      <Text style={[styles.subtitle, { color: color.textSecondary }]}>
        Scan, organize and manage your documents.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },

  greeting: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  subtitle: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 21,
  },
});
