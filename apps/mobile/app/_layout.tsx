import "@/global.css";

import "react-native-reanimated";

import { Slot } from "expo-router";

import { RootProvider } from "@/components/root-provider";

export default function RootLayout() {
  return (
    <RootProvider>
      <Slot />
    </RootProvider>
  );
}
