import { Stack } from "expo-router";
import { ScanSessionProvider } from "../context/ScanSessionContext";

export default function RootLayout() {
  return (
    <ScanSessionProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </ScanSessionProvider>
  );
}
