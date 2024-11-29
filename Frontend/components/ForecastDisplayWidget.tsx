// React Component and Package
import { StyleSheet, View, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
// Interfaces and Enums
import { WeatherData } from "@/app/(tabs)/_layout";
// Components
import { Widget } from "@/components/Widget";
import { DynamicImage } from "@/components/DynamicImage";

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
        <ScrollView
          nestedScrollEnabled={true}
          contentContainerStyle={styles.weatherCardGroupLayout}
        >
          {weatherDatas?.map((item) => {
            return (
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
            );
          })}
        </ScrollView>
      </View>
    </Widget>
  );
}

const styles = StyleSheet.create({
  customWidgetStyle: {
    width: 310,
    overflow: "hidden",
  },
  // Content
  contentLayout: {
    height: 100,
    gap: 10,
  },
  // Weather Card
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
