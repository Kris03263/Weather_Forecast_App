import { ReactNode, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface WidgetProps {
  children?: ReactNode;
  style?: object;
  isShow?: boolean;
}

export function Widget({
  children = null,
  style = {},
  isShow = false,
}: WidgetProps) {
  // Animation Control
  const [opacityValue, setOpacityValue_page] = useState(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const fetchWeatherData = async () => {
      // Wait for weather data to load
      if (isShow) {
        opacity.value = withTiming(1, { duration: 2000 });
      }
    };

    fetchWeatherData();
  }, [isShow]);

  useDerivedValue(() => {
    setOpacityValue_page(opacity.value);
  }, []);

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
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: "5%",
    backgroundColor: "#0000000A",
    borderRadius: 15,
    padding: 10,
    gap: 10,
  },
});
