import { useRouter } from "expo-router";
import { ArrowLeft, Crop, RotateCw, Sparkles } from "lucide-react-native";
import { useState } from "react";
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
  const { pages, updatePage } = useScanSession();

  const [currentIndex, setCurrentIndex] = useState(0);

  const currentPage = pages[currentIndex];

  const handleBack = () => {
    router.back();
  };

  const handlePageChange = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;

    const index = Math.round(offsetX / SCREEN_WIDTH);

    if (index >= 0 && index < pages.length) {
      setCurrentIndex(index);
    }
  };

  const handleRotate = () => {
    if (!currentPage) {
      return;
    }

    const currentRotation = currentPage.rotation || 0;

    const newRotation = (currentRotation + 90) % 360;

    updatePage(currentPage.id, {
      rotation: newRotation,
    });
  };

  if (pages.length === 0) {
    return (
      <View
        style={[
          styles.emptyContainer,
          {
            backgroundColor: color.black,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        <Text style={[styles.emptyText, { color: color.white }]}>
          No pages available
        </Text>

        <Pressable
          onPress={handleBack}
          style={[
            styles.backButton,
            {
              backgroundColor: color.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.backButtonText,
              {
                color: color.white,
              },
            ]}
          >
            Back
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
          backgroundColor: color.black,
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
          style={styles.circleButton}
          hitSlop={10}
        >
          <ArrowLeft size={22} color={color.white} strokeWidth={2.2} />
        </Pressable>

        <Text style={styles.headerTitle}>Edit</Text>

        <View style={styles.pageIndicator}>
          <Text style={styles.pageIndicatorText}>
            {currentIndex + 1} / {pages.length}
          </Text>
        </View>
      </View>

      {/* Photo Viewer */}
      <View style={styles.viewerContainer}>
        <FlatList
          data={pages}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handlePageChange}
          decelerationRate="fast"
          renderItem={({ item }) => (
            <View style={styles.pageSlide}>
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: item.uri }}
                  style={[
                    styles.pageImage,
                    {
                      transform: [
                        {
                          rotate: `${item.rotation || 0}deg`,
                        },
                      ],
                    },
                  ]}
                  resizeMode="contain"
                />
              </View>
            </View>
          )}
        />
      </View>

      {/* Page indicator */}
      <View style={styles.bottomPageIndicator}>
        <Text style={styles.bottomPageText}>
          Page {currentIndex + 1} of {pages.length}
        </Text>
      </View>

      {/* Editing Tools */}
      <View
        style={[
          styles.toolsContainer,
          {
            paddingBottom: Math.max(insets.bottom, 16) + 10,
          },
        ]}
      >
        <Pressable style={styles.toolButton} onPress={handleRotate}>
          <RotateCw size={22} color={color.white} strokeWidth={2} />

          <Text style={styles.toolText}>Rotate</Text>
        </Pressable>

        <Pressable
          style={styles.toolButton}
          onPress={() => {
            if (!currentPage) {
              return;
            }

            router.navigate({
              pathname: "/scanner/crop",
              params: {
                uri: currentPage.originalUri || currentPage.uri,
                pageId: currentPage.id,
              },
            });
          }}
        >
          <Crop size={22} color={color.white} strokeWidth={2} />

          <Text style={styles.toolText}>Crop</Text>
        </Pressable>

        <Pressable
          style={styles.toolButton}
          onPress={() => {
            if (!currentPage) {
              return;
            }

            router.navigate({
              pathname: "/scanner/enhance",
              params: {
                uri: currentPage.uri,
                pageId: currentPage.id,
              },
            });
          }}
        >
          <Sparkles size={22} color={color.white} strokeWidth={2} />

          <Text style={styles.toolText}>Enhance</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  /* Empty */

  emptyContainer: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 30,
  },

  emptyText: {
    fontSize: 17,
    fontWeight: "600",
  },

  backButton: {
    marginTop: 20,

    height: 48,

    paddingHorizontal: 24,

    borderRadius: 15,

    alignItems: "center",
    justifyContent: "center",
  },

  backButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },

  /* Header */

  header: {
    minHeight: 76,

    paddingHorizontal: 20,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  circleButton: {
    width: 44,
    height: 44,

    borderRadius: 22,

    backgroundColor: "rgba(255,255,255,0.12)",

    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    color: "#FFFFFF",

    fontSize: 18,
    fontWeight: "700",
  },

  pageIndicator: {
    minWidth: 55,

    paddingHorizontal: 10,
    paddingVertical: 7,

    borderRadius: 12,

    backgroundColor: "rgba(255,255,255,0.12)",

    alignItems: "center",
    justifyContent: "center",
  },

  pageIndicatorText: {
    color: "#FFFFFF",

    fontSize: 12,
    fontWeight: "600",
  },

  /* Viewer */

  viewerContainer: {
    flex: 1,

    justifyContent: "center",
  },

  pageSlide: {
    width: SCREEN_WIDTH,

    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  imageWrapper: {
    width: "100%",
    height: "100%",

    alignItems: "center",
    justifyContent: "center",

    overflow: "hidden",
  },

  pageImage: {
    width: "100%",
    height: "100%",
  },

  /* Page information */

  bottomPageIndicator: {
    alignItems: "center",

    paddingVertical: 8,
  },

  bottomPageText: {
    color: "#D1D5DB",

    fontSize: 12,
    fontWeight: "500",
  },

  /* Tools */

  toolsContainer: {
    minHeight: 88,

    paddingHorizontal: 30,

    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  toolButton: {
    minWidth: 80,

    alignItems: "center",
    justifyContent: "center",
  },

  toolText: {
    marginTop: 6,

    color: "#FFFFFF",

    fontSize: 12,
    fontWeight: "600",
  },
});
