import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  FlatList,
} from "react-native";
import { useSelector } from "react-redux";

import { Widget } from "@/components/Widget";
import { SvgImage } from "@/components/Svg";
import { DynamicImage } from "@/components/DynamicImage";

import { WeatherDataList, Selecter } from "@/app/(tabs)/_layout";

export function ForecastDisplayWidget() {
  const weatherDataList = useSelector(
    (state: { weatherData: WeatherDataList }) => state.weatherData
  );
  const selecter = useSelector(
    (state: { selecter: Selecter }) => state.selecter
  );

  if (Object.keys(weatherDataList).length === 0) {
    return (
      <Widget style={styles.customWidgetStyle}>
        <View style={styles.titleDisplay}>
          <SvgImage style={{ width: 30, height: 30 }} name="weather" />
          <Text style={styles.title}>天氣預報</Text>
        </View>
        <Text style={styles.subTitle}>暫無資料</Text>
      </Widget>
    );
  }

  return (
    <TouchableOpacity>
      <Widget style={styles.customWidgetStyle}>
        <View style={styles.titleDisplay}>
          <SvgImage style={{ width: 30, height: 30 }} name="weather" />
          <Text style={styles.title}>天氣預報</Text>
        </View>

        <View style={styles.cityView}>
          <FlatList
            horizontal
            style={{ width: "100%" }}
            data={weatherDataList[selecter.region][0]}
            renderItem={({ item }) => (
              <View style={styles.weatherCard}>
                <Text style={styles.weatherTime}>
                  {item.time.split(" ")[1].split(":")[0] + "時"}
                </Text>
                <DynamicImage
                  style={styles.weatherIcon}
                  path={
                    selecter.timeInterval === 1
                      ? `day/${item.weatherCode}.png`
                      : item.time > "12:00"
                      ? `day/${item.weatherCode}.png`
                      : `night/${item.weatherCode}.png`
                  }
                />
                <Text style={styles.weatherTemperature}>
                  {item.temp + "°C"}
                </Text>
              </View>
            )}
            keyExtractor={(item) => item.time}
          />
        </View>
      </Widget>
    </TouchableOpacity>
  );
}

// Default Style
const styles = StyleSheet.create({
  customWidgetStyle: {
    justifyContent: "center",
    alignItems: "center",
  },
  cityView: {
    width: "100%",
    overflow: "hidden",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  titleDisplay: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
  },
  title: {
    color: "white",
    fontSize: 20,
    textAlign: "left",
  },
  subTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  weatherScroll: {
    flexDirection: "row",
  },
  weatherCard: {
    width: 60,
    backgroundColor: "none",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
  },
  weatherIcon: {
    width: "80%",
    marginBottom: 5,
  },
  weatherTime: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  weatherTemperature: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  row: {
    minWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
});
