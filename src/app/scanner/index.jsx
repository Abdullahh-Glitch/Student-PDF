import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Image as ImageIcon, Zap } from "lucide-react-native";
import { useRef, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useScanSession } from "../../context/ScanSessionContext";
import { useTheme } from "../../hooks/useTheme";

export default function ScannerScreen() {
  const router = useRouter();
  const { replacePageId } = useLocalSearchParams();
  const { color } = useTheme();
  const insets = useSafeAreaInsets();
  const cameraRef = useRef(null);

  const { pages, addPage, replacePage, clearSession } = useScanSession();

  const [flash, setFlash] = useState("off");
  const [isCapturing, setIsCapturing] = useState(false);
  const [showCaptureFlash, setShowCaptureFlash] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const handleCapture = async () => {
    if (isCapturing) {
      return;
    }

    try {
      if (!cameraRef.current) {
        return;
      }

      setIsCapturing(true);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
      });

      if (!photo?.uri) {
        return;
      }

      const newPage = {
        id: replacePageId || Date.now().toString(),
        uri: photo.uri,
      };

      if (replacePageId) {
        replacePage(replacePageId, newPage);
      } else {
        addPage(newPage);
      }

      setShowCaptureFlash(true);

      setTimeout(() => {
        setShowCaptureFlash(false);
      }, 120);

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      console.log(replacePageId ? "Page replaced:" : "Page captured:", newPage);

      /*
       * Retake mode:
       * Replace the old page and return to its preview.
       *
       * router.replace() is important here because we do NOT
       * want to create another camera screen in the navigation stack.
       */
      if (replacePageId) {
        router.replace({
          pathname: "/scanner/preview",
          params: {
            uri: photo.uri,
            pageId: replacePageId,
          },
        });
      }
    } catch (error) {
      console.log("Capture error:", error);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (result.canceled) {
        return;
      }

      const newPages = result.assets
        .filter((asset) => asset?.uri)
        .map((asset, index) => ({
          id: `${Date.now()}-${index}`,
          uri: asset.uri,
        }));

      newPages.forEach((page) => addPage(page));

      console.log("Gallery pages added:", newPages);
    } catch (error) {
      console.log("Gallery error:", error);
    }
  };

  /*
   * Camera Back behavior
   *
   * Normal camera:
   * - No pages -> Home
   * - Pages exist -> Ask before discarding
   *
   * Retake camera:
   * - Go directly back to Preview
   * - Never ask to discard the whole scan
   */
  const handleCameraBack = () => {
    if (replacePageId) {
      router.back();
      return;
    }

    if (pages.length === 0) {
      router.replace("/");
      return;
    }

    Alert.alert(
      "Discard Scan?",
      "Your captured and selected pages will be discarded.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => {
            clearSession();
            router.replace("/");
          },
        },
      ],
    );
  };

  if (!permission) {
    return (
      <View
        style={[
          styles.center,
          {
            backgroundColor: color.black,
          },
        ]}
      >
        <Text style={[styles.message, { color: color.white }]}>
          Loading camera...
        </Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View
        style={[
          styles.center,
          {
            backgroundColor: color.black,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        <Text style={[styles.permissionTitle, { color: color.white }]}>
          Camera Access Required
        </Text>

        <Text style={[styles.permissionText, { color: "#D1D5DB" }]}>
          Student PDF needs access to your camera to scan documents.
        </Text>

        <Pressable
          onPress={requestPermission}
          style={[
            styles.permissionButton,
            {
              backgroundColor: color.primary,
            },
          ]}
        >
          <Text style={[styles.permissionButtonText, { color: color.white }]}>
            Allow Camera
          </Text>
        </Pressable>

        <Pressable onPress={handleCameraBack} style={styles.cancelButton}>
          <Text style={[styles.cancelText, { color: "#D1D5DB" }]}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera */}
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing="back"
        flash={flash}
      />

      {showCaptureFlash && (
        <View pointerEvents="none" style={styles.captureFlash} />
      )}

      {/* Scan frame */}
      <View pointerEvents="none" style={styles.scanFrame}>
        <View style={[styles.corner, styles.topLeft]} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />
      </View>

      {/* Top controls */}
      <View
        style={[
          styles.topBar,
          {
            top: insets.top + 12,
          },
        ]}
      >
        <Pressable onPress={handleCameraBack} style={styles.circleButton}>
          <ArrowLeft size={22} color={color.white} strokeWidth={2.2} />
        </Pressable>

        <Text style={styles.headerTitle}>Scan Document</Text>

        <Pressable
          style={[styles.circleButton, flash === "on" && styles.flashActive]}
          onPress={() =>
            setFlash((current) => (current === "off" ? "on" : "off"))
          }
        >
          <Zap size={21} color={color.white} strokeWidth={2} />
        </Pressable>
      </View>

      {/* Instruction */}
      <View style={styles.instructionContainer}>
        <Text style={styles.instruction}>
          Position your document inside the frame
        </Text>
      </View>

      {/* Captured pages */}
      {pages.length > 0 && (
        <View style={styles.pagesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pagesContent}
          >
            {pages.map((page, index) => (
              <Pressable
                key={page.id}
                style={styles.pageThumbnail}
                onPress={() => {
                  router.push({
                    pathname: "/scanner/preview",
                    params: {
                      uri: page.uri,
                      pageId: page.id,
                    },
                  });
                }}
              >
                <Image
                  source={{ uri: page.uri }}
                  style={styles.thumbnailImage}
                  resizeMode="cover"
                />

                <View style={styles.pageNumber}>
                  <Text style={styles.pageNumberText}>{index + 1}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>

          <Text style={styles.pageCount}>
            {pages.length} {pages.length === 1 ? "page" : "pages"} captured
          </Text>
        </View>
      )}

      {/* Bottom controls */}
      <View
        style={[
          styles.bottomControls,
          {
            bottom: Math.max(insets.bottom, 16) + 18,
          },
        ]}
      >
        <Pressable style={styles.galleryButton} onPress={handleGallery}>
          <ImageIcon size={23} color={color.white} strokeWidth={2} />

          <Text style={styles.controlLabel}>Gallery</Text>
        </Pressable>

        <Pressable
          style={[
            styles.captureButton,
            isCapturing && styles.captureButtonDisabled,
          ]}
          onPress={handleCapture}
          disabled={isCapturing}
        >
          <View style={styles.captureInner} />
        </Pressable>

        {/* Right side placeholder for Done button */}
        <View style={styles.galleryButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },

  message: {
    fontSize: 16,
  },

  permissionTitle: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },

  permissionText: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },

  permissionButton: {
    marginTop: 24,
    height: 48,
    paddingHorizontal: 24,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  permissionButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },

  cancelButton: {
    marginTop: 15,
    padding: 10,
  },

  cancelText: {
    fontSize: 14,
  },

  /* Camera overlay */

  scanFrame: {
    position: "absolute",
    width: "86%",
    height: "42%",
    top: "50%",
    left: "7%",
    marginTop: "-21%",
  },

  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },

  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },

  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },

  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
  },

  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 8,
  },

  captureFlash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FFFFFF",
    opacity: 0.75,
    zIndex: 50,
  },

  /* Top */

  topBar: {
    position: "absolute",
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },

  flashActive: {
    backgroundColor: "rgba(255,255,255,0.28)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  /* Instruction */

  instructionContainer: {
    position: "absolute",
    left: 20,
    right: 20,
    top: "73%",
    alignItems: "center",
  },

  instruction: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    overflow: "hidden",
  },

  /* Captured pages */

  pagesContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 125,
    alignItems: "center",
  },

  pagesContent: {
    paddingHorizontal: 16,
    gap: 10,
  },

  pageThumbnail: {
    width: 58,
    height: 76,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.7)",
  },

  thumbnailImage: {
    width: "100%",
    height: "100%",
  },

  pageNumber: {
    position: "absolute",
    left: 4,
    top: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },

  pageNumberText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },

  pageCount: {
    marginTop: 7,
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    backgroundColor: "rgba(0,0,0,0.35)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  /* Bottom */

  bottomControls: {
    position: "absolute",
    left: 25,
    right: 25,
    bottom: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  galleryButton: {
    width: 70,
    alignItems: "center",
    justifyContent: "center",
  },

  captureButtonDisabled: {
    opacity: 0.65,
  },

  controlLabel: {
    marginTop: 5,
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },

  captureButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  captureInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: "#D1D5DB",
  },
});
