import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  FlatList,
  PermissionsAndroid,
  Platform,
  FlatList,
  PermissionsAndroid,
  Platform,
} from "react-native";

import { Widget } from "@/components/Widget";
import { SvgImage } from "@/components/Svg";
import { DynamicImage } from "@/components/DynamicImage";

import store from "@/redux/store";
import { updateTimeInterval } from "@/redux/timeIntervalSlice";
import { addRegion, removeRegion } from "@/redux/regionListSlice";
import { useSelector } from "react-redux";

import { Region } from "@/app/(tabs)/index";
import { WeatherData } from "@/app/(tabs)/index";
import { WeatherDataList } from "@/app/(tabs)/index";

export function ForecastDisplayWidget() {
  const regionList = useSelector((state: { region: Region[] }) => state.region);
  const weatherDataList = useSelector(
    (state: { weatherData: WeatherDataList }) => state.weatherData
  );
  const timeInterval = useSelector(
    (state: { timeInterval: number }) => state.timeInterval
  );

  const FormatTime = (time: string) => {
    switch (timeInterval) {
      case 0:
        return time.split(" ")[1].split(":")[0] + ":00";
      case 1:
        return (
          time.split(" ")[0].split("-")[1] +
          "/" +
          time.split(" ")[0].split("-")[2]
        );
      default:
        return time;
    }
  };

  if (Object.keys(weatherDataList).length === 0) {
    return (
      <Widget style={styles.customWidgetStyle}>
        <View style={styles.titleDisplay}>
          <SvgImage style={{ width: 30, height: 30 }} name="weather" />
          <Text style={styles.title}>Forecast</Text>
        </View>
        <Text style={styles.subTitle}>No Data</Text>
      </Widget>
    );
  }

  return (
    <Widget style={styles.customWidgetStyle}>
      <View style={styles.titleDisplay}>
        <SvgImage style={{ width: 30, height: 30 }} name="weather" />
        <Text style={styles.title}>Forecast</Text>
      </View>

      <FlatList
        style={{ width: "100%", gap: 10 }}
        data={regionList}
        renderItem={({ item }) => (
          <View style={styles.cityView}>
            <Text style={styles.subTitle}>{item.id}</Text>

            <FlatList
              horizontal
              style={{ width: "100%" }}
              data={weatherDataList[`${item.id}`][timeInterval]}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.weatherCard}>
                  <DynamicImage
                    style={styles.weatherIcon}
                    path={
                      timeInterval === 1
                        ? `day/${item.weatherCode}.png`
                        : item.time > "12:00"
                        ? `day/${item.weatherCode}.png`
                        : `night/${item.weatherCode}.png`
                    }
                  />
                  <Text style={styles.weatherTime}>
                    {FormatTime(item.time)}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.time}
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={async () => {
            console.log(store.getState().region);
            /* Need to add a city selector */
          }}
        >
          <SvgImage style={{ width: 40, height: 40 }} name="plus" />
        </TouchableOpacity>
      </View>
    </Widget>
  );
}

// Default Style
const styles = StyleSheet.create({
  customWidgetStyle: {
    minHeight: "auto",
    justifyContent: "center",
    alignItems: "center",
  },
  cityView: {
    width: "100%",
    overflow: "hidden",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
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
    fontSize: 24,
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
    height: 80,
    backgroundColor: "#EAEAEA30",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 5,
  },
  weatherIcon: {
    width: 30,
    height: 30,
    marginBottom: 5,
  },
  weatherTime: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF00",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 24,
    color: "#000000",
  },
  row: {
    minWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
});
