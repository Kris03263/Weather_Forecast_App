import { StyleSheet, View, Text, FlatList } from "react-native";

import { Widget } from "@/components/Widget";
import { DynamicImage } from "@/components/DynamicImage";

import { WeatherData } from "@/app/(tabs)/_layout";

interface ForecastDisplayWidgetProps {
  weatherDatas: WeatherData[];
  onPress: () => void;
}

export function ForecastDisplayWidget({
  weatherDatas,
  onPress,
}: ForecastDisplayWidgetProps) {
  return (
    <Widget
      title="天氣預報"
      svgName="weather"
      style={styles.customWidgetStyle}
      isVisible={true}
      isPressable={true}
      onPress={onPress}
      widthMutiplier={2}
      heightMultiplier={2}
    >
      <View style={styles.contentLayout}>
        <FlatList
          nestedScrollEnabled
          contentContainerStyle={styles.weatherCardGroupLayout}
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
  );
}

// Default Style
const styles = StyleSheet.create({
  customWidgetStyle: {
    width: 310,
    overflow: "hidden",
  },
  contentLayout: {
    height: 100,
    gap: 10,
  },
  weatherCardGroupLayout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  weatherCardLayout: {
    width: 60,
    height: 100,
    backgroundColor: "none",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  weatherIcon: {
    height: "40%",
    width: "40%",
    marginBottom: 5,
  },
  weatherTimeText: {
    color: "white",
    fontSize: 14,
  },
  weatherTemperatureText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
