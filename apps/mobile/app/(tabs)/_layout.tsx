import { Platform, View } from "react-native";
import { useColorScheme } from "react-native";

import { Stack } from "expo-router";
import { useThemeColor } from "heroui-native";

import { ThemeToggle } from "@/components/theme-toggle";

export default function Layout() {
  const themeColorForeground = useThemeColor("foreground");
  const themeColorBackground = useThemeColor("background");
  const colorScheme = useColorScheme();

  return (
    <View className="bg-background flex-1">
      <Stack
        screenOptions={{
          headerTitleAlign: "center",
          headerTransparent: true,
          headerBlurEffect: colorScheme === "dark" ? "dark" : "light",
          headerTintColor: themeColorForeground,
          headerStyle: {
            backgroundColor: Platform.select({
              ios: undefined,
              android: themeColorBackground,
            }),
          },
          headerRight: () => <ThemeToggle />,
          headerBackButtonDisplayMode: "generic",
          gestureEnabled: true,
          gestureDirection: "horizontal",
          contentStyle: {
            backgroundColor: themeColorBackground,
          },
        }}>
        <Stack.Screen name="index" />
      </Stack>
    </View>
  );
}
