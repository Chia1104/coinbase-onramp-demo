import { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { HeroUINativeProvider } from "heroui-native";
import { Uniwind } from "uniwind";

import { useColorScheme } from "@/hooks/use-color-scheme";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export const RootProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  const colorScheme = useColorScheme();

  useEffect(() => {
    Uniwind.setTheme(colorScheme === "dark" ? "dark" : "light");
  }, [colorScheme]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <GestureHandlerRootView style={styles.root}>
        <HeroUINativeProvider
          config={{
            textProps: {
              allowFontScaling: false,
            },
          }}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </HeroUINativeProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
