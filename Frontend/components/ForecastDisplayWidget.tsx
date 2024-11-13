import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  FlatList,
} from "react-native";

import { Widget } from "@/components/Widget";
import { SvgImage } from "@/components/Svg";
import { DynamicImage } from "@/components/DynamicImage";

import { WeatherData } from "@/app/(tabs)/_layout";
import { SlideModal } from "@/components/SlideModal";
import { useState } from "react";

interface ForecastDisplayWidgetProps {
  weatherDatas: WeatherData[];
}

export function ForecastDisplayWidget({ weatherDatas }: ForecastDisplayWidgetProps) {
  const [ModalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Widget style={styles.customWidgetStyle} isShow={true}>
          <View style={styles.titleLayout}>
            <SvgImage style={{ width: 30, height: 30 }} name="weather" />
            <Text style={styles.title}>天氣預報</Text>
          </View>

          <View style={styles.contentLayout}>
            <FlatList
              nestedScrollEnabled
              horizontal
              style={styles.weatherCardGroundLayout}
              data={weatherDatas ?? []}
              renderItem={({ item }) => (
                <View style={styles.weatherCardLayout}>
                  <Text style={styles.weatherTimeText}>
                    {item.time.split(" ")[1].split(":")[0] + "時"}
                  </Text>
                  <DynamicImage
                    style={styles.weatherIcon}
                    path={
                      item.time.split(" ")[1] < "18:00:00" &&
                      item.time.split(" ")[1] >= "06:00:00"
                        ? `day/${item.weatherCode}.png`
                        : `night/${item.weatherCode}.png`
                    }
                  />
                  <Text style={styles.weatherTemperatureText}>
                    {item.temp + "°C"}
                  </Text>
                </View>
              )}
              keyExtractor={(item) => item.time}
            />
          </View>
        </Widget>
      </TouchableOpacity>
      <SlideModal
        isModalShow={ModalVisible}
        onClose={() => setModalVisible(false)}
        type="temp"
      />
    </>
  );
}

// Default Style
const styles = StyleSheet.create({
  customWidgetStyle: {
    justifyContent: "center",
    alignItems: "center",
  },
  titleLayout: {
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
  contentLayout: {
    width: "100%",
    overflow: "hidden",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  weatherScroll: {
    flexDirection: "row",
  },
  weatherCardGroundLayout: {
    flexDirection: "row",
    width: "100%",
    height: 150,
  },
  weatherCardLayout: {
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
  weatherTimeText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  weatherTemperatureText: {
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
