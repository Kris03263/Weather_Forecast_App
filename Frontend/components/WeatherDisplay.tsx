import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { useSelector } from "react-redux";

import {
  Selecter,
  WeatherDataList,
  indicatorsDictionary,
} from "@/app/(tabs)/_layout";

import { SvgImage } from "./Svg";
import { DynamicImage } from "./DynamicImage";

export function WeatherDisplay() {
  const weatherDataList = useSelector(
    (state: { weatherData: WeatherDataList }) => state.weatherData
  );
  const selecter = useSelector(
    (state: { selecter: Selecter }) => state.selecter
  );
  const temp =
    indicatorsDictionary["temp" as keyof typeof indicatorsDictionary];
  const bodyTemp =
    indicatorsDictionary["bodyTemp" as keyof typeof indicatorsDictionary];

  if (Object.keys(weatherDataList).length === 0) {
    return (
      <View style={styles.layout}>
        <View style={styles.cityNameDisplay}>
          <Text style={styles.cityName}>--, --</Text>
        </View>
        <View style={styles.temperatureDisplay}>
          <Text style={styles.temperature}>--°C</Text>
        </View>
        <Text style={styles.body_temperature}>| --°C </Text>
      </View>
    );
  }
  temp.value = weatherDataList?.[selecter.region]?.[0]?.[0]?.temp ?? "";
  bodyTemp.value = weatherDataList?.[selecter.region]?.[0]?.[0]?.bodyTemp ?? "";

  return (
    <View style={styles.layout}>
      <View style={styles.cityNameDisplay}>
        <Text style={styles.cityName}>{selecter.region} </Text>
        <TouchableOpacity>
          <SvgImage style={{ width: 25, height: 25 }} name="list" />
        </TouchableOpacity>
      </View>
      <View style={styles.temperatureDisplay}>
        <Text style={styles.temperature}>{temp.value + temp.unit}</Text>
        <DynamicImage
          style={styles.weatherIcon}
          path={
            weatherDataList[selecter.region][0][0].time > "12:00"
              ? `day/${weatherDataList[selecter.region][0][0].weatherCode}.png`
              : `night/${
                  weatherDataList[selecter.region][0][0].weatherCode
                }.png`
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
  cityName: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "left",
  },
  cityNameDisplay: {
    alignItems: "center",
    minWidth: "100%",
    flexDirection: "row",
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
