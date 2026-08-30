import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useScanSession } from "../../context/ScanSessionContext";
import { useTheme } from "../../hooks/useTheme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function EditorScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { color } = useTheme();

  const { pages } = useScanSession();

  const [currentIndex, setCurrentIndex] = useState(0);

  const flatListRef = useRef(null);

  const handleBack = () => {
    router.back();
  };

  const handlePageChange = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;

    const index = Math.round(offsetX / SCREEN_WIDTH);

    if (index >= 0 && index < pages.length && index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  if (pages.length === 0) {
    return (
      <View
        style={[
          styles.emptyContainer,
          {
            backgroundColor: color.background,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        <Text
          style={[
            styles.emptyTitle,
            {
              color: color.text,
            },
          ]}
        >
          No Pages
        </Text>

        <Text
          style={[
            styles.emptyText,
            {
              color: color.textSecondary,
            },
          ]}
        >
          There are no pages available to edit.
        </Text>

        <Pressable
          onPress={handleBack}
          style={[
            styles.emptyButton,
            {
              backgroundColor: color.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.emptyButtonText,
              {
                color: color.white,
              },
            ]}
          >
            Back to Camera
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: color.background,
        },
      ]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 10,
          },
        ]}
      >
        <Pressable
          onPress={handleBack}
          style={[
            styles.backButton,
            {
              backgroundColor: color.surface,
              borderColor: color.border,
            },
          ]}
        >
          <ArrowLeft size={22} color={color.text} strokeWidth={2.2} />
        </Pressable>

        <Text
          style={[
            styles.title,
            {
              color: color.text,
            },
          ]}
        >
          Editor
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* Page viewer */}
      <View style={styles.viewerContainer}>
        <FlatList
          ref={flatListRef}
          data={pages}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handlePageChange}
          renderItem={({ item }) => (
            <View style={styles.pageSlide}>
              <View
                style={[
                  styles.pageWrapper,
                  {
                    backgroundColor: color.surface,
                    borderColor: color.border,
                  },
                ]}
              >
                <Image
                  source={{ uri: item.uri }}
                  style={styles.pageImage}
                  resizeMode="contain"
                />
              </View>
            </View>
          )}
        />
      </View>

      {/* Page indicator */}
      <View
        style={[
          styles.pageIndicator,
          {
            backgroundColor: color.surface,
            borderColor: color.border,
          },
        ]}
      >
        <Text
          style={[
            styles.pageIndicatorText,
            {
              color: color.text,
            },
          ]}
        >
          {currentIndex + 1} / {pages.length}
        </Text>
      </View>

      {/* Editing toolbar placeholder */}
      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: Math.max(insets.bottom, 16) + 10,
            backgroundColor: color.surface,
            borderTopColor: color.border,
          },
        ]}
      >
        <View style={styles.toolPlaceholder}>
          <Text
            style={[
              styles.toolPlaceholderText,
              {
                color: color.textSecondary,
              },
            ]}
          >
            Editing tools coming next
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    minHeight: 76,

    paddingHorizontal: 20,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 44,
    height: 44,

    borderRadius: 22,

    borderWidth: 1,

    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
  },

  headerSpacer: {
    width: 44,
  },

  viewerContainer: {
    flex: 1,

    justifyContent: "center",
  },

  pageSlide: {
    width: SCREEN_WIDTH,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 16,
  },

  pageWrapper: {
    width: "100%",
    height: "90%",

    borderRadius: 12,

    borderWidth: 1,

    overflow: "hidden",

    alignItems: "center",
    justifyContent: "center",
  },

  pageImage: {
    width: "100%",
    height: "100%",
  },

  pageIndicator: {
    alignSelf: "center",

    marginBottom: 12,

    paddingHorizontal: 14,
    paddingVertical: 7,

    borderRadius: 14,

    borderWidth: 1,
  },

  pageIndicatorText: {
    fontSize: 13,
    fontWeight: "600",
  },

  bottomBar: {
    minHeight: 90,

    paddingHorizontal: 20,

    borderTopWidth: 1,

    alignItems: "center",
    justifyContent: "center",
  },

  toolPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },

  toolPlaceholderText: {
    fontSize: 13,
  },

  emptyContainer: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 30,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
  },

  emptyText: {
    marginTop: 8,

    fontSize: 14,

    textAlign: "center",
  },

  emptyButton: {
    marginTop: 22,

    height: 48,

    paddingHorizontal: 22,

    borderRadius: 14,

    alignItems: "center",
    justifyContent: "center",
  },

  emptyButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
