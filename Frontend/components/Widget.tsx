import { ReactNode, useEffect, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface WidgetProps {
  children?: ReactNode;
  style?: object;
  isVisible?: boolean;
  isPressable?: boolean;
  onPress?: () => void;
}

export function Widget({
  children = null,
  style = {},
  isVisible = false,
  isPressable = false,
  onPress = () => {},
}: WidgetProps) {
  // Animation Control
  const [opacityValue, setOpacityValue_page] = useState(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const fetchWeatherData = async () => {
      // Wait for weather data to load
      if (isVisible) {
        opacity.value = withTiming(1, { duration: 2000 });
      }
    };

    fetchWeatherData();
  }, [isVisible]);

  useDerivedValue(() => {
    setOpacityValue_page(opacity.value);
  }, []);

  if (isPressable)
    return (
      <Pressable style={{ flex: 1, width: "100%" }} onPress={onPress}>
        <Animated.View
          style={[styles.emptyWidget, style, { opacity: opacityValue }]}
        >
          {children}
        </Animated.View>
      </Pressable>
    );
  else
    return (
      <Animated.View
        style={[styles.emptyWidget, style, { opacity: opacityValue }]}
      >
        {children}
      </Animated.View>
    );
}

// Default Style
const styles = StyleSheet.create({
  emptyWidget: {
    flex: 1,
    minHeight: 150,
    width: "auto",
    paddingVertical: 20,
    paddingHorizontal: "5%",
    margin: 5,
    backgroundColor: "#0000000A",
    borderRadius: 15,
    gap: 10,
  },
});
