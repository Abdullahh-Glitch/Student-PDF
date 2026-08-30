import { useLocalSearchParams, useRouter } from "expo-router";
import { Check, RotateCcw, Trash2 } from "lucide-react-native";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useScanSession } from "../../context/ScanSessionContext";
import { useTheme } from "../../hooks/useTheme";

export default function ScannerPreviewScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { color } = useTheme();

  const { deletePage } = useScanSession();

  const { uri, pageId } = useLocalSearchParams();

  const handleRetake = () => {
    if (!pageId) {
      return;
    }

    router.push({
      pathname: "/scanner/retake",
      params: {
        pageId,
      },
    });
  };

  const handleDelete = () => {
    if (!pageId) {
      return;
    }

    Alert.alert("Delete Page?", "Are you sure you want to delete this page?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deletePage(pageId);

          // Return to the existing camera session.
          router.dismissTo("/scanner");
        },
      },
    ]);
  };

  const handleContinue = () => {
    // Return to the existing camera session
    // without creating another navigation layer.
    router.dismissTo("/scanner");
  };

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
        <Text style={styles.title}>Preview</Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* Image */}
      <View style={styles.imageContainer}>
        {uri ? (
          <Image source={{ uri }} style={styles.image} resizeMode="contain" />
        ) : (
          <View style={styles.noImage}>
            <Text style={styles.noImageText}>No image found</Text>
          </View>
        )}
      </View>

      {/* Bottom actions */}
      <View
        style={[
          styles.bottomControls,
          {
            paddingBottom: Math.max(insets.bottom, 16) + 10,
          },
        ]}
      >
        <View style={styles.leftActions}>
          <Pressable onPress={handleRetake} style={styles.actionButton}>
            <RotateCcw size={22} color={color.white} strokeWidth={2} />

            <Text style={styles.actionText}>Retake</Text>
          </Pressable>

          <Pressable onPress={handleDelete} style={styles.actionButton}>
            <Trash2 size={22} color="#FF6B6B" strokeWidth={2} />

            <Text style={[styles.actionText, { color: "#FF6B6B" }]}>
              Delete
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={handleContinue}
          style={[
            styles.continueButton,
            {
              backgroundColor: color.primary,
            },
          ]}
        >
          <Check size={22} color={color.white} strokeWidth={2.5} />

          <Text style={styles.continueText}>Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    minHeight: 80,

    paddingHorizontal: 20,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    color: "#FFFFFF",

    fontSize: 18,
    fontWeight: "700",
  },

  headerSpacer: {
    width: 44,
  },

  imageContainer: {
    flex: 1,

    marginHorizontal: 16,

    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  noImage: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
  },

  noImageText: {
    color: "#FFFFFF",

    fontSize: 15,
  },

  bottomControls: {
    minHeight: 100,

    paddingHorizontal: 25,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  actionButton: {
    minWidth: 90,

    alignItems: "center",
    justifyContent: "center",
  },

  leftActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },

  actionText: {
    marginTop: 6,

    color: "#FFFFFF",

    fontSize: 13,
    fontWeight: "600",
  },

  continueButton: {
    height: 52,

    paddingHorizontal: 22,

    borderRadius: 17,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 8,
  },

  continueText: {
    color: "#FFFFFF",

    fontSize: 15,
    fontWeight: "700",
  },
});
