import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

import EmptyDocuments from "../../components/home/EmptyDocuments";
import HomeHeader from "../../components/home/HomeHeader";
import QuickActions from "../../components/home/QuickActions";
import QuickScanCard from "../../components/home/QuickScanCard";
import RecentDocuments from "../../components/home/RecentDocuments";
import { useTheme } from "../../hooks/useTheme";

export default function HomeScreen() {
  const router = useRouter();
  const { color } = useTheme();

  const handleScan = () => {
    router.navigate("/scanner");
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: color.background,
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader />

        <QuickScanCard onPress={handleScan} />

        <QuickActions onImport={() => {}} onCreate={() => {}} />

        <RecentDocuments onSeeAll={() => router.navigate("/(tabs)/library")} />
        <EmptyDocuments />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 120,
  },
});
