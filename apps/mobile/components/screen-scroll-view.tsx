import type { FC, PropsWithChildren } from "react";
import { ScrollView } from "react-native";
import type { ScrollViewProps } from "react-native";
import Animated from "react-native-reanimated";
import type { AnimatedProps } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useHeaderHeight } from "@react-navigation/elements";
import { cn } from "heroui-native";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

interface Props extends AnimatedProps<ScrollViewProps> {
  className?: string;
  contentContainerClassName?: string;
}

export const ScreenScrollView: FC<PropsWithChildren<Props>> = ({
  children,
  className,
  contentContainerClassName,
  ...props
}) => {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  return (
    <AnimatedScrollView
      className={cn("bg-background", className)}
      contentContainerClassName={cn("px-5", contentContainerClassName)}
      contentContainerStyle={{
        paddingTop: headerHeight,
        paddingBottom: insets.bottom + 32,
      }}
      showsVerticalScrollIndicator={false}
      {...props}>
      {children}
    </AnimatedScrollView>
  );
};
