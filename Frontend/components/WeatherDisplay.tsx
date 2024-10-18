import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { useSelector } from "react-redux";

import {
  Selecter,
  WeatherDataList,
  indicatorsDictionary,
} from "@/app/(tabs)/_layout";

import { SvgImage } from "./Svg";
import { DynamicImage } from "./DynamicImage";

interface WeatherDisplayProps {
  isSecendLayout: boolean;
}

export function WeatherDisplay({ isSecendLayout }: WeatherDisplayProps) {
  const weatherDataList = useSelector(
    (state: { weatherData: WeatherDataList }) => state.weatherData
  );
  const selecter = useSelector(
    (state: { selecter: Selecter }) => state.selecter
  );
  const weatherData = weatherDataList?.[selecter.region]?.[0]?.[0] ?? null;
  const temp =
    indicatorsDictionary["temp" as keyof typeof indicatorsDictionary];
  temp.value = weatherDataList?.[selecter.region]?.[0]?.[0]?.temp ?? "--";
  const bodyTemp =
    indicatorsDictionary["bodyTemp" as keyof typeof indicatorsDictionary];
  bodyTemp.value =
    weatherDataList?.[selecter.region]?.[0]?.[0]?.bodyTemp ?? "--";

  if (isSecendLayout) {
    return (
      <View style={styles2.layout}>
        <View style={styles2.temperatureDisplay}>
          <Text style={styles2.temperature}>{temp.value + temp.unit}</Text>
          <Text style={styles2.body_temperature}>
            {"| " + bodyTemp.value + bodyTemp.unit}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.layout}>
      <View style={styles.temperatureDisplay}>
        <Text style={styles.temperature}>{temp.value + temp.unit}</Text>
        <DynamicImage
          style={styles.weatherIcon}
          path={
            !weatherData
              ? ""
              : weatherData.time.split(" ")[1] < "18:00:00" &&
                weatherData.time.split(" ")[1] >= "06:00:00"
              ? `day/${weatherData.weatherCode}.png`
              : `night/${weatherData.weatherCode}.png`
          }
        />
      </View>
      <Text style={styles.body_temperature}>
        {"| " + bodyTemp.value + bodyTemp.unit}
      </Text>
    </View>
  );
}

// Default Style
const styles = StyleSheet.create({
  layout: {
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: 20,
    gap: 10,
  },
  temperatureDisplay: {
    gap: 10,
    height: 75,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  temperature: {
    color: "white",
    fontSize: 64,
    fontWeight: "bold",
    textAlign: "left",
  },
  body_temperature: {
    marginBottom: 2,
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
  },
  weatherIcon: {
    height: "100%",
    marginRight: 10,
  },
});

const styles2 = StyleSheet.create({
  layout: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 10,
  },
  temperatureDisplay: {
    gap: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  temperature: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "left",
  },
  body_temperature: {
    marginBottom: 2,
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
  },
  weatherIcon: {
    height: "100%",
    marginRight: 10,
  },
});
