// React Component and Package
import { useEffect, useState } from "react";
import {
  useSharedValue,
  useDerivedValue,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
// Interfaces and Enums
import { WeatherData } from "@/app/(tabs)/_layout";
// Components
import { BackgroundGradient } from "@/constants/Colors";
import { StyleSheet } from "react-native";

interface BackgroundProps {
  weatherData: WeatherData | null;
  style?: object;
}

export function Background({ weatherData, style }: BackgroundProps) {
  // Background Control
  const [backgroundColor, setBackgroundColor] = useState(
    BackgroundGradient.default
  );
  const newBackgroundColor = !weatherData
    ? BackgroundGradient.default
    : weatherData.time.split(" ")[1] < "18:00:00" &&
      weatherData.time.split(" ")[1] >= "06:00:00"
    ? BackgroundGradient.day[
        weatherData.weatherCode as keyof typeof BackgroundGradient.day
      ]
    : BackgroundGradient.night[
        weatherData.weatherCode as keyof typeof BackgroundGradient.night
      ];
  const color1 = useSharedValue(backgroundColor[0]);
  const color2 = useSharedValue(backgroundColor[1]);

  useEffect(() => {
    color1.value = withTiming(newBackgroundColor[0], { duration: 2000 });
    color2.value = withTiming(newBackgroundColor[1], { duration: 2000 });
  }, [newBackgroundColor]);

  useDerivedValue(() => {
    "worklet";
    runOnJS(setBackgroundColor)([color1.value, color2.value]);
  }, []);

  return (
    <LinearGradient
      colors={[backgroundColor[0], backgroundColor[1]]}
      style={[styles.linearGradient, style]}
    />
  );
}

const styles = StyleSheet.create({
  // Linear Gradient
  linearGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
});
