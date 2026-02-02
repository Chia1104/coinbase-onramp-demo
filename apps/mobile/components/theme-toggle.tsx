import { useTransition } from "react";
import { Platform, Pressable } from "react-native";
import { useColorScheme } from "react-native";
import Animated, { FadeOut, ZoomIn } from "react-native-reanimated";

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { withUniwind } from "uniwind";
import { Uniwind } from "uniwind";

const StyledIonicons = withUniwind(Ionicons);

export const ThemeToggle = () => {
  const [isPending, startTransition] = useTransition();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const toggleTheme = () => {
    Uniwind.setTheme(isDark ? "light" : "dark");
  };

  return (
    <Pressable
      disabled={isPending}
      onPress={() => {
        startTransition(() => {
          if (Platform.OS === "ios") {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        });
        toggleTheme();
      }}
      className="px-2.5">
      {!isDark ? (
        <Animated.View key="moon" entering={ZoomIn} exiting={FadeOut}>
          <StyledIonicons name="moon" size={20} className="text-black" />
        </Animated.View>
      ) : (
        <Animated.View key="sun" entering={ZoomIn} exiting={FadeOut}>
          <StyledIonicons name="sunny" size={20} className="text-white" />
        </Animated.View>
      )}
    </Pressable>
  );
};
