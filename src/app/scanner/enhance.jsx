import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Check } from "lucide-react-native";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../../hooks/useTheme";

const MODES = [
  {
    id: "original",
    label: "Original",
  },
  {
    id: "auto",
    label: "Auto",
  },
  {
    id: "grayscale",
    label: "Grayscale",
  },
  {
    id: "bw",
    label: "B&W",
  },
];

export default function EnhanceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { color } = useTheme();

  const { uri, pageId } = useLocalSearchParams();

  const [selectedMode, setSelectedMode] = useState("auto");

  const handleBack = () => {
    router.back();
  };

  const handleApply = () => {
    // Image processing will be added next.
    router.back();
  };

  if (!uri || !pageId) {
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
          Unable to enhance this page
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

        <Text style={styles.headerTitle}>Enhance</Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* Preview */}

      <View style={styles.previewContainer}>
        <Image
          source={{ uri }}
          style={styles.previewImage}
          resizeMode="contain"
        />
      </View>

      {/* Mode selector */}

      <View style={styles.modeSection}>
        <Text style={styles.sectionTitle}>Enhancement</Text>

        <View style={styles.modeRow}>
          {MODES.map((mode) => {
            const isSelected = selectedMode === mode.id;

            return (
              <Pressable
                key={mode.id}
                onPress={() => setSelectedMode(mode.id)}
                style={[
                  styles.modeButton,
                  isSelected && styles.modeButtonSelected,
                ]}
              >
                <Text
                  style={[
                    styles.modeText,
                    isSelected && styles.modeTextSelected,
                  ]}
                >
                  {mode.label}
                </Text>

                {isSelected && (
                  <View style={styles.checkIcon}>
                    <Check size={13} color={color.white} strokeWidth={3} />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Bottom actions */}

      <View
        style={[
          styles.bottomActions,
          {
            paddingBottom: Math.max(insets.bottom, 16) + 10,
          },
        ]}
      >
        <Pressable onPress={handleBack} style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>

        <Pressable
          onPress={handleApply}
          style={[
            styles.applyButton,
            {
              backgroundColor: color.primary,
            },
          ]}
        >
          <Text style={styles.applyText}>Apply</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

  headerSpacer: {
    width: 44,
  },

  /* Preview */

  previewContainer: {
    flex: 1,

    marginHorizontal: 16,

    alignItems: "center",
    justifyContent: "center",

    overflow: "hidden",
  },

  previewImage: {
    width: "100%",
    height: "100%",
  },

  /* Modes */

  modeSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },

  sectionTitle: {
    marginBottom: 12,

    color: "#D1D5DB",

    fontSize: 13,
    fontWeight: "600",
  },

  modeRow: {
    flexDirection: "row",
    gap: 8,
  },

  modeButton: {
    flex: 1,

    minHeight: 46,

    paddingHorizontal: 8,

    borderRadius: 12,

    backgroundColor: "rgba(255,255,255,0.08)",

    alignItems: "center",
    justifyContent: "center",

    position: "relative",
  },

  modeButtonSelected: {
    backgroundColor: "#4F46E5",
  },

  modeText: {
    color: "#D1D5DB",

    fontSize: 12,
    fontWeight: "600",
  },

  modeTextSelected: {
    color: "#FFFFFF",
  },

  checkIcon: {
    position: "absolute",

    top: 5,
    right: 5,

    width: 18,
    height: 18,

    borderRadius: 9,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "rgba(255,255,255,0.18)",
  },

  /* Bottom */

  bottomActions: {
    minHeight: 78,

    paddingHorizontal: 20,

    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    gap: 12,
  },

  cancelButton: {
    flex: 1,

    height: 48,

    borderRadius: 14,

    backgroundColor: "rgba(255,255,255,0.08)",

    alignItems: "center",
    justifyContent: "center",
  },

  cancelText: {
    color: "#FFFFFF",

    fontSize: 14,
    fontWeight: "600",
  },

  applyButton: {
    flex: 1,

    height: 48,

    borderRadius: 14,

    alignItems: "center",
    justifyContent: "center",
  },

  applyText: {
    color: "#FFFFFF",

    fontSize: 14,
    fontWeight: "700",
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
});
