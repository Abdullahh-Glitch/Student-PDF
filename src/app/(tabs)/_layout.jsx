import { Tabs } from "expo-router";

import BottomNavigation from "../../components/navigation/BottomNavigation";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={() => <BottomNavigation />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />

      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
}
