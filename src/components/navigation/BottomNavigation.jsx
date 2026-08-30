import { usePathname, useRouter } from "expo-router";
import {
  FilePlus2,
  Files,
  House,
  ScanLine,
  UserRound,
} from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../../hooks/useTheme";
import NavigationItem from "./NavigationItem";

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { color, mode } = useTheme();

  const isActive = (route) => {
    if (route === "home") {
      return pathname === "/" || pathname.includes("(tabs)");
    }

    return pathname.includes(route);
  };

  return (
    <View
      style={[
        styles.wrapper,
        {
          bottom: Math.max(insets.bottom, 12) + 8,
        },
      ]}
    >
      {/* Main navigation bar */}
      <View
        style={[
          styles.container,
          {
            backgroundColor:
              mode === "dark"
                ? "rgba(24,27,35,0.96)"
                : "rgba(255,255,255,0.96)",

            borderColor: color.border,
          },
        ]}
      >
        <View style={styles.navigationContent}>
          <NavigationItem
            label="Home"
            icon={House}
            active={isActive("home")}
            onPress={() => router.navigate("/(tabs)")}
          />

          <NavigationItem
            label="Library"
            icon={Files}
            active={isActive("library")}
            onPress={() => router.navigate("/(tabs)/library")}
          />

          <View style={styles.scanSpace} />

          <NavigationItem
            label="Create"
            icon={FilePlus2}
            active={isActive("create")}
            onPress={() => router.navigate("/(tabs)/create")}
          />

          <NavigationItem
            label="Profile"
            icon={UserRound}
            active={isActive("profile")}
            onPress={() => router.navigate("/(tabs)/profile")}
          />
        </View>
      </View>

      {/* Floating scan action */}
      <View style={styles.scanPosition}>
        <NavigationItem
          label="Scan"
          icon={ScanLine}
          isScan
          onPress={() => router.navigate("/scanner")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",

    left: 0,
    right: 0,

    alignItems: "center",

    zIndex: 100,
  },

  container: {
    width: "91%",
    maxWidth: 430,
    height: 70,

    borderRadius: 26,
    borderWidth: 1,

    elevation: 8,

    shadowOffset: {
      width: 0,
      height: 5,
    },

    shadowOpacity: 0.12,
    shadowRadius: 14,
  },

  navigationContent: {
    flex: 1,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",

    paddingHorizontal: 7,
  },

  scanSpace: {
    width: 70,
    height: 70,
  },

  scanPosition: {
    position: "absolute",

    top: -15,

    alignItems: "center",
    justifyContent: "center",

    zIndex: 200,
    elevation: 20,
  },
});
