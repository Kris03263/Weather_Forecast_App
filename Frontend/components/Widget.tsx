import { ReactNode, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
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
      <Pressable
        style={[styles.emptyWidget, style, { opacity: opacityValue }]}
        onPress={onPress}
      >
        <View style={styles.titleLayout}>
          <SvgImage style={styles.svgImage} name={svgName} />
          <Text style={styles.titleText}>{title}</Text>
        </View>
        <View style={styles.separator} />
        {children}
      </Pressable>
    );
  else
    return (
      <View style={[styles.emptyWidget, style, { opacity: opacityValue }]}>
        <View style={styles.titleLayout}>
          <SvgImage style={styles.svgImage} name={svgName} />
          <Text style={styles.titleText}>{title}</Text>
        </View>
        <View style={styles.separator} />
        {children}
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
    margin: 10,
    backgroundColor: "#0000000A",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  // Title
  titleLayout: {
    width: "100%",
    height: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
  },
  titleText: {
    color: "white",
    fontSize: 14,
    textAlign: "left",
  },
  // Svg
  svgImage: {
    width: 20,
    height: 20,
  },
  // Separator
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: "white",
    marginVertical: 2,
  },
});
