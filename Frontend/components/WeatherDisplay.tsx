import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
} from "react-native";

import store from "@/redux/store";
import { useSelector } from "react-redux";

import { Region } from "@/app/(tabs)/index";
import { WeatherDataList } from "@/app/(tabs)/index";
import { indicatorsDictionary } from "@/app/(tabs)/index";

export function WeatherDisplay() {
  const region = useSelector((state: { region: Region[] }) => state.region);
  const weatherDataList = useSelector(
    (state: { weatherData: WeatherDataList }) => state.weatherData
  );
  const timeInterval = useSelector(
    (state: { timeInterval: number }) => state.timeInterval
  );
  const temp =
    indicatorsDictionary["temp" as keyof typeof indicatorsDictionary];
  const bodyTemp =
    indicatorsDictionary["bodyTemp" as keyof typeof indicatorsDictionary];

  if (Object.keys(weatherDataList).length === 0) {
    return (
      <View style={styles.layout}>
        <Text style={styles.cityName}>--, --</Text>
        <View style={styles.temperatureDisplay}>
          <Text style={styles.temperature}>--°C</Text>
          <Text style={styles.body_temperature}>| --°C </Text>
        </View>
        <View style={styles.weatherIcon} />
      </View>
    );
  }

  temp.value = weatherDataList?.[region[0].id]?.[timeInterval]?.[0]?.temp ?? "";
  bodyTemp.value =
    weatherDataList?.[region[0].id]?.[timeInterval]?.[0]?.bodyTemp ?? "";

  return (
    <View style={styles.layout}>
      <Text style={styles.cityName}>{region[0].id}</Text>
      <View style={styles.temperatureDisplay}>
        <Text style={styles.temperature}>{temp.value + temp.unit}</Text>
        <Text style={styles.body_temperature}>
          {"| " + bodyTemp.value + bodyTemp.unit}
        </Text>
      </View>
      <View style={styles.weatherIcon} />
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
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
  },
  temperatureDisplay: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "baseline",
  },
  temperature: {
    color: "white",
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "left",
  },
  body_temperature: {
    color: "white",
    marginLeft: 10,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
  },
  weatherIcon: {
    position: "absolute",
    right: -50,
    top: "50%",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#FFE27D",
  },
});
