import { StyleSheet, View, Text } from "react-native";

import { WeatherData, indicatorsDictionary } from "@/app/(tabs)/_layout";

interface WeatherDisplayProps {
  isSecendLayout: boolean;
  weatherData: WeatherData;
}

export function WeatherDisplay({
  isSecendLayout,
  weatherData,
}: WeatherDisplayProps) {
  const temp =
    indicatorsDictionary["temp" as keyof typeof indicatorsDictionary];
  temp.value = weatherData?.temp ?? "--";
  const bodyTemp =
    indicatorsDictionary["bodyTemp" as keyof typeof indicatorsDictionary];
  bodyTemp.value = weatherData?.bodyTemp ?? "";

  if (isSecendLayout) {
    return (
      <View style={styles2.layout}>
        <View style={styles2.temperatureDisplay}>
          <Text style={styles2.temperature}>{`${temp.value}${temp.unit}`}</Text>
          <Text style={styles2.body_temperature}>
            {`| ${bodyTemp.value}${bodyTemp.unit}`}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.layout}>
      <View style={styles.temperatureDisplay}>
        <Text style={styles.temperature}>{`${temp.value}${temp.unit}`}</Text>
        <Text style={styles.body_temperature}>
          {`| ${bodyTemp.value}${bodyTemp.unit}`}
        </Text>
      </View>
    </View>
  );
}

// Default Style
const styles = StyleSheet.create({
  layout: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
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
    marginBottom: 10,
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
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
