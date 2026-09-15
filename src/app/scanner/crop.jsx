import * as ImageManipulator from "expo-image-manipulator";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Check, X } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useScanSession } from "../../context/ScanSessionContext";
import { useTheme } from "../../hooks/useTheme";

const MIN_CROP_SIZE = 80;

export default function CropScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { color } = useTheme();
  const { updatePage } = useScanSession();

  const { uri, pageId } = useLocalSearchParams();

  const [containerSize, setContainerSize] = useState({
    width: 0,
    height: 0,
  });

  const [imageSize, setImageSize] = useState({
    width: 0,
    height: 0,
  });

  const [imageBounds, setImageBounds] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });

  const [crop, setCrop] = useState({
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  });

  const [isApplying, setIsApplying] = useState(false);

  const cropRef = useRef(crop);

  /*
   * Keep the latest image bounds in a ref.
   *
   * PanResponder is created only once, so it cannot
   * safely depend directly on the imageBounds state.
   */
  const imageBoundsRef = useRef(imageBounds);

  const dragStartRef = useRef(null);

  /*
   * Get the original image dimensions.
   */
  useEffect(() => {
    if (!uri) {
      return;
    }

    Image.getSize(
      uri,
      (width, height) => {
        setImageSize({
          width,
          height,
        });
      },
      () => {
        setImageSize({
          width: 0,
          height: 0,
        });
      },
    );
  }, [uri]);

  /*
   * Calculate the actual displayed image bounds
   * when using resizeMode="contain".
   */
  useEffect(() => {
    if (
      !containerSize.width ||
      !containerSize.height ||
      !imageSize.width ||
      !imageSize.height
    ) {
      return;
    }

    const imageAspectRatio = imageSize.width / imageSize.height;

    const containerAspectRatio = containerSize.width / containerSize.height;

    let displayedWidth;
    let displayedHeight;

    if (imageAspectRatio > containerAspectRatio) {
      displayedWidth = containerSize.width;
      displayedHeight = containerSize.width / imageAspectRatio;
    } else {
      displayedHeight = containerSize.height;
      displayedWidth = containerSize.height * imageAspectRatio;
    }

    const left = (containerSize.width - displayedWidth) / 2;

    const top = (containerSize.height - displayedHeight) / 2;

    const nextBounds = {
      left,
      top,
      width: displayedWidth,
      height: displayedHeight,
    };

    imageBoundsRef.current = nextBounds;
    setImageBounds(nextBounds);
  }, [containerSize, imageSize]);

  /*
   * Initialize crop selection once the actual image
   * bounds are available.
   */
  useEffect(() => {
    if (
      !imageBounds.width ||
      !imageBounds.height ||
      cropRef.current.right !== 0
    ) {
      return;
    }

    const initialCrop = {
      left: imageBounds.left + imageBounds.width * 0.07,

      top: imageBounds.top + imageBounds.height * 0.1,

      right: imageBounds.left + imageBounds.width * 0.93,

      bottom: imageBounds.top + imageBounds.height * 0.9,
    };

    cropRef.current = initialCrop;
    setCrop(initialCrop);
  }, [imageBounds]);

  const updateCrop = (newCrop) => {
    cropRef.current = newCrop;
    setCrop(newCrop);
  };

  const createPanResponder = (corner) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onStartShouldSetPanResponderCapture: () => true,

      onMoveShouldSetPanResponder: () => true,

      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: () => {
        dragStartRef.current = {
          corner,
          crop: { ...cropRef.current },
        };
      },

      onPanResponderMove: (_, gesture) => {
        if (!dragStartRef.current) {
          return;
        }

        /*
         * IMPORTANT:
         * Read the latest image bounds from the ref,
         * not from the state captured when the responder
         * was originally created.
         */
        const bounds = imageBoundsRef.current;

        if (!bounds.width || !bounds.height) {
          return;
        }

        const start = dragStartRef.current.crop;

        const imageLeft = bounds.left;
        const imageTop = bounds.top;

        const imageRight = bounds.left + bounds.width;

        const imageBottom = bounds.top + bounds.height;

        const next = {
          ...start,
        };

        if (corner === "topLeft") {
          next.left = Math.max(
            imageLeft,
            Math.min(start.right - MIN_CROP_SIZE, start.left + gesture.dx),
          );

          next.top = Math.max(
            imageTop,
            Math.min(start.bottom - MIN_CROP_SIZE, start.top + gesture.dy),
          );
        }

        if (corner === "topRight") {
          next.right = Math.min(
            imageRight,
            Math.max(start.left + MIN_CROP_SIZE, start.right + gesture.dx),
          );

          next.top = Math.max(
            imageTop,
            Math.min(start.bottom - MIN_CROP_SIZE, start.top + gesture.dy),
          );
        }

        if (corner === "bottomLeft") {
          next.left = Math.max(
            imageLeft,
            Math.min(start.right - MIN_CROP_SIZE, start.left + gesture.dx),
          );

          next.bottom = Math.min(
            imageBottom,
            Math.max(start.top + MIN_CROP_SIZE, start.bottom + gesture.dy),
          );
        }

        if (corner === "bottomRight") {
          next.right = Math.min(
            imageRight,
            Math.max(start.left + MIN_CROP_SIZE, start.right + gesture.dx),
          );

          next.bottom = Math.min(
            imageBottom,
            Math.max(start.top + MIN_CROP_SIZE, start.bottom + gesture.dy),
          );
        }

        updateCrop(next);
      },

      onPanResponderRelease: () => {
        dragStartRef.current = null;
      },

      onPanResponderTerminate: () => {
        dragStartRef.current = null;
      },

      onPanResponderTerminationRequest: () => false,
    });
  };

  /*
   * Create the responders once.
   * They now read dynamic values through refs.
   */
  const topLeftResponder = useRef(createPanResponder("topLeft")).current;

  const topRightResponder = useRef(createPanResponder("topRight")).current;

  const bottomLeftResponder = useRef(createPanResponder("bottomLeft")).current;

  const bottomRightResponder = useRef(
    createPanResponder("bottomRight"),
  ).current;

  const handleCancel = () => {
    if (isApplying) {
      return;
    }

    router.back();
  };

  const handleApply = async () => {
    if (
      isApplying ||
      !uri ||
      !pageId ||
      !imageSize.width ||
      !imageSize.height ||
      !imageBounds.width ||
      !imageBounds.height
    ) {
      return;
    }

    try {
      setIsApplying(true);

      const currentCrop = cropRef.current;

      /*
       * Convert from container coordinates
       * to coordinates relative to the displayed image.
       */
      const relativeLeft = currentCrop.left - imageBounds.left;

      const relativeTop = currentCrop.top - imageBounds.top;

      const relativeRight = currentCrop.right - imageBounds.left;

      const relativeBottom = currentCrop.bottom - imageBounds.top;

      /*
       * Convert displayed-image coordinates
       * into original-image pixel coordinates.
       */
      const scaleX = imageSize.width / imageBounds.width;

      const scaleY = imageSize.height / imageBounds.height;

      let originX = Math.round(relativeLeft * scaleX);

      let originY = Math.round(relativeTop * scaleY);

      let cropWidth = Math.round((relativeRight - relativeLeft) * scaleX);

      let cropHeight = Math.round((relativeBottom - relativeTop) * scaleY);

      /*
       * Keep everything inside the original image.
       */
      originX = Math.max(0, Math.min(originX, imageSize.width - 1));

      originY = Math.max(0, Math.min(originY, imageSize.height - 1));

      cropWidth = Math.min(cropWidth, imageSize.width - originX);

      cropHeight = Math.min(cropHeight, imageSize.height - originY);

      if (cropWidth <= 0 || cropHeight <= 0) {
        setIsApplying(false);
        return;
      }

      /*
       * Perform the actual crop.
       */
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [
          {
            crop: {
              originX,
              originY,
              width: cropWidth,
              height: cropHeight,
            },
          },
        ],
        {
          compress: 1,
          format: ImageManipulator.SaveFormat.JPEG,
        },
      );

      /*
       * Replace only the URI.
       *
       * Existing page id, rotation and any other
       * page properties remain untouched.
       */
      updatePage(pageId, {
        uri: result.uri,
        originalUri: uri,
      });

      router.back();
    } catch (error) {
      console.error("Failed to crop image:", error);

      setIsApplying(false);
    }
  };

  const hasImage =
    imageSize.width > 0 &&
    imageSize.height > 0 &&
    imageBounds.width > 0 &&
    imageBounds.height > 0;

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
          onPress={handleCancel}
          style={styles.headerButton}
          hitSlop={10}
          disabled={isApplying}
        >
          <X size={22} color={color.white} strokeWidth={2.2} />
        </Pressable>

        <Text style={styles.headerTitle}>Crop</Text>

        <Pressable
          onPress={handleApply}
          style={[
            styles.applyButton,
            {
              backgroundColor: color.primary,
              opacity: isApplying ? 0.7 : 1,
            },
          ]}
          disabled={isApplying}
        >
          {isApplying ? (
            <ActivityIndicator size="small" color={color.white} />
          ) : (
            <>
              <Check size={19} color={color.white} strokeWidth={2.5} />

              <Text style={styles.applyText}>Apply</Text>
            </>
          )}
        </Pressable>
      </View>

      {/* Image */}

      <View
        style={styles.imageContainer}
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;

          setContainerSize({
            width,
            height,
          });
        }}
      >
        {uri ? (
          <Image source={{ uri }} style={styles.image} resizeMode="contain" />
        ) : (
          <Text style={styles.errorText}>No image found</Text>
        )}

        {/* Dark outside crop */}

        {hasImage && (
          <View pointerEvents="none" style={styles.darkOverlay}>
            <View
              style={[
                styles.darkTop,
                {
                  left: imageBounds.left,
                  top: imageBounds.top,
                  width: imageBounds.width,
                  height: Math.max(0, crop.top - imageBounds.top),
                },
              ]}
            />

            <View
              style={[
                styles.darkBottom,
                {
                  left: imageBounds.left,
                  top: crop.bottom,
                  width: imageBounds.width,
                  height: Math.max(
                    0,
                    imageBounds.top + imageBounds.height - crop.bottom,
                  ),
                },
              ]}
            />

            <View
              style={[
                styles.darkLeft,
                {
                  left: imageBounds.left,
                  top: crop.top,
                  width: Math.max(0, crop.left - imageBounds.left),
                  height: Math.max(0, crop.bottom - crop.top),
                },
              ]}
            />

            <View
              style={[
                styles.darkRight,
                {
                  left: crop.right,
                  top: crop.top,
                  width: Math.max(
                    0,
                    imageBounds.left + imageBounds.width - crop.right,
                  ),
                  height: Math.max(0, crop.bottom - crop.top),
                },
              ]}
            />
          </View>
        )}

        {/* Crop selection */}

        {hasImage && (
          <View
            pointerEvents="box-none"
            style={[
              styles.cropSelection,
              {
                left: crop.left,
                top: crop.top,
                width: crop.right - crop.left,
                height: crop.bottom - crop.top,
              },
            ]}
          >
            {/* Grid */}

            <View style={styles.gridVerticalLeft} />

            <View style={styles.gridVerticalRight} />

            <View style={styles.gridHorizontalTop} />

            <View style={styles.gridHorizontalBottom} />

            {/* Corners */}

            <View
              {...topLeftResponder.panHandlers}
              style={[styles.corner, styles.topLeft]}
            />

            <View
              {...topRightResponder.panHandlers}
              style={[styles.corner, styles.topRight]}
            />

            <View
              {...bottomLeftResponder.panHandlers}
              style={[styles.corner, styles.bottomLeft]}
            />

            <View
              {...bottomRightResponder.panHandlers}
              style={[styles.corner, styles.bottomRight]}
            />
          </View>
        )}
      </View>

      {/* Bottom */}

      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: Math.max(insets.bottom, 16) + 10,
          },
        ]}
      >
        <Text style={styles.instruction}>
          Drag the corners to select the document
        </Text>
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

  headerButton: {
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

  applyButton: {
    height: 44,

    minWidth: 84,

    paddingHorizontal: 15,

    borderRadius: 14,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 6,
  },

  applyText: {
    color: "#FFFFFF",

    fontSize: 14,
    fontWeight: "700",
  },

  /* Image */

  imageContainer: {
    flex: 1,

    marginHorizontal: 12,

    position: "relative",

    alignItems: "center",
    justifyContent: "center",

    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  errorText: {
    color: "#FFFFFF",

    fontSize: 15,
  },

  /* Dark outside crop */

  darkOverlay: {
    ...StyleSheet.absoluteFillObject,

    zIndex: 2,
  },

  darkTop: {
    position: "absolute",

    backgroundColor: "rgba(0,0,0,0.48)",
  },

  darkBottom: {
    position: "absolute",

    backgroundColor: "rgba(0,0,0,0.48)",
  },

  darkLeft: {
    position: "absolute",

    backgroundColor: "rgba(0,0,0,0.48)",
  },

  darkRight: {
    position: "absolute",

    backgroundColor: "rgba(0,0,0,0.48)",
  },

  /* Crop */

  cropSelection: {
    position: "absolute",

    minWidth: MIN_CROP_SIZE,
    minHeight: MIN_CROP_SIZE,

    zIndex: 5,

    borderWidth: 1,

    borderColor: "rgba(255,255,255,0.95)",
  },

  /* Grid */

  gridVerticalLeft: {
    position: "absolute",

    left: "33.33%",
    top: 0,
    bottom: 0,

    width: 1,

    backgroundColor: "rgba(255,255,255,0.35)",
  },

  gridVerticalRight: {
    position: "absolute",

    left: "66.66%",
    top: 0,
    bottom: 0,

    width: 1,

    backgroundColor: "rgba(255,255,255,0.35)",
  },

  gridHorizontalTop: {
    position: "absolute",

    left: 0,
    right: 0,
    top: "33.33%",

    height: 1,

    backgroundColor: "rgba(255,255,255,0.35)",
  },

  gridHorizontalBottom: {
    position: "absolute",

    left: 0,
    right: 0,
    top: "66.66%",

    height: 1,

    backgroundColor: "rgba(255,255,255,0.35)",
  },

  /* Corners */

  corner: {
    position: "absolute",

    width: 34,
    height: 34,

    borderWidth: 3,

    borderColor: "#FFFFFF",

    zIndex: 20,
  },

  topLeft: {
    left: -2,
    top: -2,

    borderRightWidth: 0,
    borderBottomWidth: 0,

    borderTopLeftRadius: 5,
  },

  topRight: {
    right: -2,
    top: -2,

    borderLeftWidth: 0,
    borderBottomWidth: 0,

    borderTopRightRadius: 5,
  },

  bottomLeft: {
    left: -2,
    bottom: -2,

    borderRightWidth: 0,
    borderTopWidth: 0,

    borderBottomLeftRadius: 5,
  },

  bottomRight: {
    right: -2,
    bottom: -2,

    borderLeftWidth: 0,
    borderTopWidth: 0,

    borderBottomRightRadius: 5,
  },

  /* Bottom */

  bottomBar: {
    minHeight: 64,

    paddingHorizontal: 20,

    alignItems: "center",
    justifyContent: "center",
  },

  instruction: {
    color: "#D1D5DB",

    fontSize: 12,

    textAlign: "center",
  },
});
