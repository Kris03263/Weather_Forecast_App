import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
} from "react-native";

import { Widget } from "@/components/Widget";
import { SvgImage } from "@/components/Svg";
import { useEffect, useState } from "react";

export function ForecastDisplayWidget() {
  const [region, setRegion] = useState([
    { id: 0, name: "土城區, 新北市" },
    { id: 1, name: "大安區, 台北市" },
  ]);
  const [timeInterval_type, setTimeInterval] = useState(0);
  const [currentTime, setCurrentTime] = useState("");

  const GetCurrentTime = () => {
    const date = new Date().toLocaleDateString();
    setCurrentTime(date);
  };

  // 每次页面加载时更新时间
  useEffect(() => {
    setRegion([
      { id: 0, name: "土城區, 新北市" },
      { id: 1, name: "大安區, 台北市" },
    ]);
    GetCurrentTime();
  }, []);

  const HandleAddRegion = (name: string) => {
    // Check if region is empty
    name = name ? name : "{district}, {region}";

    // Add new region
    setRegion([...region, { id: region.length, name: name }]);
  };

  const HandleSetTimeInterval = (type: number) => {
    // Set time interval type
    setTimeInterval(type);
  };

  return (
    <Widget style={styles.customWidgetStyle}>
      <View style={styles.titleDisplay}>
        <SvgImage style={{ width: 30, height: 30 }} name="weather" />
        <Text style={styles.title}>Forecast</Text>
      </View>
      {region.map((region, index) => (
        <Region
          key={region.id}
          name={region.name}
          date={currentTime}
          timeInterval_type={timeInterval_type}
        ></Region>
      ))}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => HandleAddRegion("")}
      >
        <SvgImage style={{ width: 40, height: 40 }} name="plus" />
      </TouchableOpacity>
    </Widget>
  );
}

interface RegionProps {
  key: number;
  name: string;
  date: string;
  timeInterval_type?: number; // 0 -> 3h | 1 -> 1D
}

export function Region({
  key,
  name,
  date,
  timeInterval_type = 0,
}: RegionProps) {
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
        {name} ({date})
      </Text>
      <ScrollView horizontal style={styles.weatherScroll}>
        {timeInterval_map[timeInterval_type].map((time, index) => (
          <TouchableOpacity key={index} style={styles.weatherCard}>
            <Image
              // source={require("./cloud.png")} // require weather image
              style={styles.weatherIcon}
            />
            <Text style={styles.weatherTime}>{time}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
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
    marginBottom: 10,
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
    width: 40,
    height: 40,
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
});
