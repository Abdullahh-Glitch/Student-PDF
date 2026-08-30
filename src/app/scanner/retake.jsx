import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Zap } from "lucide-react-native";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useScanSession } from "../../context/ScanSessionContext";
import { useTheme } from "../../hooks/useTheme";

export default function ScannerRetakeScreen() {
  const router = useRouter();
  const { color } = useTheme();
  const insets = useSafeAreaInsets();
  const cameraRef = useRef(null);

  const { pageId } = useLocalSearchParams();
  const { pages, replacePage } = useScanSession();

  const [flash, setFlash] = useState("off");
  const [isCapturing, setIsCapturing] = useState(false);
  const [showCaptureFlash, setShowCaptureFlash] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const currentPage = pages.find((page) => page.id === pageId);

  const handleBack = () => {
    router.back();
  };

  const handleCapture = async () => {
    if (isCapturing || !pageId) {
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
        id: pageId,
        uri: photo.uri,
      };

      replacePage(pageId, newPage);

      setShowCaptureFlash(true);

      setTimeout(() => {
        setShowCaptureFlash(false);
      }, 120);

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      console.log("Page retaken:", newPage);

      router.replace({
        pathname: "/scanner/preview",
        params: {
          uri: photo.uri,
          pageId: pageId,
        },
      });
    } catch (error) {
      console.log("Retake error:", error);
    } finally {
      setIsCapturing(false);
    }
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
          Student PDF needs access to your camera to retake this page.
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

        <Pressable onPress={handleBack} style={styles.cancelButton}>
          <Text style={[styles.cancelText, { color: "#D1D5DB" }]}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  if (!currentPage) {
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
          Page not found
        </Text>

        <Pressable onPress={handleBack} style={styles.cancelButton}>
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

      {/* Capture flash */}
      {showCaptureFlash && (
        <View pointerEvents="none" style={styles.captureFlash} />
      )}

      {/* Top controls */}
      <View
        style={[
          styles.topBar,
          {
            top: insets.top + 12,
          },
        ]}
      >
        <Pressable onPress={handleBack} style={styles.circleButton}>
          <ArrowLeft size={22} color={color.white} strokeWidth={2.2} />
        </Pressable>

        <Text style={styles.headerTitle}>Retake Page</Text>

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
          Capture a new photo for this page
        </Text>
      </View>

      {/* Bottom controls */}
      <View
        style={[
          styles.bottomControls,
          {
            bottom: Math.max(insets.bottom, 16) + 18,
          },
        ]}
      >
        <View style={styles.sidePlaceholder} />

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

        <View style={styles.sidePlaceholder} />
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

  captureFlash: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor: "#FFFFFF",

    opacity: 0.75,

    zIndex: 50,
  },

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

  bottomControls: {
    position: "absolute",

    left: 25,
    right: 25,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sidePlaceholder: {
    width: 70,
    height: 70,
  },

  captureButton: {
    width: 76,
    height: 76,

    borderRadius: 38,

    backgroundColor: "#FFFFFF",

    alignItems: "center",
    justifyContent: "center",
  },

  captureButtonDisabled: {
    opacity: 0.65,
  },

  captureInner: {
    width: 64,
    height: 64,

    borderRadius: 32,

    borderWidth: 3,
    borderColor: "#D1D5DB",
  },
});
