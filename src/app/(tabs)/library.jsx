import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import EmptyLibrary from "../../components/library/EmptyLibrary";
import LibraryHeader from "../../components/library/LibraryHeader";
import SearchDocuments from "../../components/library/SearchDocuments";
import { useTheme } from "../../hooks/useTheme";

export default function LibraryScreen() {
  const router = useRouter();
  const { color } = useTheme();

  const [search, setSearch] = useState("");

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
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <LibraryHeader onSort={() => {}} />

        <SearchDocuments value={search} onChangeText={setSearch} />

        <EmptyLibrary onScan={handleScan} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scroll: {
    flex: 1,
  },

  content: {
    flexGrow: 1,

    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 140,
  },
});
