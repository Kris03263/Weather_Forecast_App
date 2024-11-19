import { useEffect, useState } from "react";
import {
  useSharedValue,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { BackgroundGradient } from "@/constants/Colors";
import { WeatherData } from "@/app/(tabs)/_layout";

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
    setBackgroundColor([color1.value, color2.value]);
  }, []);

  return (
    <LinearGradient
      colors={backgroundColor}
      style={[
        {
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: "100%",
        },
        style,
      ]}
    />
  );
}
