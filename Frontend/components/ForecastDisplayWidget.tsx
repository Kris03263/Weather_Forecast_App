import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
} from "react-native";

import { Widget } from "@/components/Widget";
import { Svg } from "./Svg";

const [weatherIcon, plusIcon] = [
  "/assets/svgs/weather-icon.svg",
  "/assets/svgs/plus-icon.svg",
];

export function ForecastDisplayWidget() {
  return (
    <Widget style={styles.forecastDisplayWidget}>
      <View style={styles.titleDisplay}>
        <Svg style={{ width: 30, height: 30 }} src={weatherIcon}></Svg>
        <Text style={styles.title}>Forecast</Text>
      </View>
      <CityView cityName="Taipei, Taiwan" date="09/27"></CityView>
      <CityView
        cityName="New York, USA"
        date="10/01"
        timeInterval_type={0}
      ></CityView>
      <CityView
        cityName="Taipei, Taiwan"
        date="09/27"
        timeInterval_type={0}
      ></CityView>
      <TouchableOpacity style={styles.addButton}>
        <Svg style={{ width: 40, height: 40 }} src={plusIcon}></Svg>
      </TouchableOpacity>
    </Widget>
  );
}

interface CityViewProps {
  cityName: string;
  date: string;
  timeInterval_type?: number; // 0 -> 3h | 1 -> 1D
}

export function CityView({
  cityName,
  date,
  timeInterval_type = 0,
}: CityViewProps) {
  const timeInterval_map = [
    [
      "00:00",
      "03:00",
      "06:00",
      "09:00",
      "12:00",
      "15:00",
      "18:00",
      "21:00",
      "24:00",
    ],
    ["Sun.", "Mon.", "Tue.", "Wed.", "Thr.", "Fri.", "Sat."],
  ];

  return (
    <View style={styles.cityView}>
      <Text style={styles.subTitle}>
        {cityName} ({date})
      </Text>
      <ScrollView horizontal style={styles.weatherScroll}>
        {timeInterval_map[timeInterval_type].map((time, index) => (
          <View key={index} style={styles.weatherCard}>
            <Image
              // source={require("./cloud.png")} // require weather image
              style={styles.weatherIcon}
            />
            <Text style={styles.weatherTime}>{time}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// Default Style
const styles = StyleSheet.create({
  forecastDisplayWidget: {
    minHeight: "auto",
    justifyContent: "center",
    alignItems: "center",
  },
  cityView: {
    width: "100%",
    overflow: "hidden",
  },
  titleDisplay: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
  },
  title: {
    color: "black",
    fontSize: 24,
    textAlign: "left",
  },
  subTitle: {
    color: "black",
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
  },
  weatherScroll: {
    flexDirection: "row",
  },
  weatherCard: {
    width: 60,
    height: 80,
    backgroundColor: "#EAEAEA",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 5,
  },
  weatherIcon: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  weatherTime: {
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
});
