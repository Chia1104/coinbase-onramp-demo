import "@/global.css";

import "react-native-reanimated";

import { Stack } from "expo-router";

import { RootProvider } from "@/components/root-provider";

export default function RootLayout() {
  return (
    <RootProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </RootProvider>
  );
}
