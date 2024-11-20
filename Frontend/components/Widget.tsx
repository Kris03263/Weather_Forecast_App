import { ReactNode, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SvgImage } from "./Svg";

interface WidgetProps {
  title?: string;
  svgName?: string;
  children?: ReactNode;
  style?: object;
  isVisible?: boolean;
  isPressable?: boolean;
  onPress?: () => void;
  widthMutiplier?: number;
  heightMultiplier?: number;
}

export function Widget({
  title = "",
  svgName = "",
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
      <Pressable style={[styles.emptyWidget, style]} onPress={onPress}>
        <Animated.View style={{ width: "100%", opacity: opacityValue }}>
          <View style={styles.titleLayout}>
            <SvgImage style={styles.svgImage} name={svgName} />
            <Text style={styles.titleText}>{title}</Text>
          </View>
          <View style={styles.separator} />
          {children}
        </Animated.View>
      </Pressable>
    );
  else
    return (
      <View style={[styles.emptyWidget, style]}>
        <Animated.View style={{ width: "100%", opacity: opacityValue }}>
          <View style={styles.titleLayout}>
            <SvgImage style={styles.svgImage} name={svgName} />
            <Text style={styles.titleText}>{title}</Text>
          </View>
          <View style={styles.separator} />
          {children}
        </Animated.View>
      </View>
    );
}

// Default Style
const styles = StyleSheet.create({
  emptyWidget: {
    height: 150,
    width: 150,
    alignItems: "flex-start",
    padding: 10,
    margin: 5,
    backgroundColor: "#0000000A",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  titleLayout: {
    width: "100%",
    height: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
  },
  titleText: {
    color: "#9ca8b7",
    fontSize: 14,
    textAlign: "left",
  },
  svgImage: {
    width: 20,
    height: 20,
  },
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: "#9ca8b7",
    marginVertical: 2,
  },
});
