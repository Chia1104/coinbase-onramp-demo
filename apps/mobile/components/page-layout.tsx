import { useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { ScreenScrollView } from "./screen-scroll-view";

export const PageLayout = ({ children }: React.PropsWithChildren) => {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView>
      <ScreenScrollView className="my-10">{children}</ScreenScrollView>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
};
