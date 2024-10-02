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

interface IndicatorsDisplayWidgetProps_double {
  type1: string;
  type2: string;
}

export function IndicatorsDisplayWidget_double({
  type1,
  type2,
}: IndicatorsDisplayWidgetProps_double) {
  const [title1, title2] = [
    type1
      .split("-")
      .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
      .join(" "),
    type2
      .split("-")
      .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
      .join(" "),
  ];
  const [value1, value2] = ["North", "5km/h"]; // require API

  return (
    <TouchableOpacity style={{ flex: 1, width: "100%" }}>
      <Widget style={styles.customWidgetStyle}>
        <View style={styles.layout}>
          <View style={styles.titleDisplay}>
            <SvgImage style={{ width: 30, height: 30 }} name={type1} />
            <Text style={styles.title}>{title1}</Text>
          </View>
          <Text style={styles.value}>{value1}</Text>
        </View>

        <View style={styles.layout}>
          <View style={styles.titleDisplay}>
            <SvgImage style={{ width: 30, height: 30 }} name={type2} />
            <Text style={styles.title}>{title2}</Text>
          </View>
          <Text style={styles.value}>{value2}</Text>
        </View>
      </Widget>
    </TouchableOpacity>
  );
}

// Default Style
const styles = StyleSheet.create({
  customWidgetStyle: {
    paddingHorizontal: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  layout: {
    minWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  titleDisplay: {
    minWidth: "60%",
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
  value: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "left",
  },
});
