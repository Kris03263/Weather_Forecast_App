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

interface IndicatorsDisplayWidgetProps_single {
  type: string;
}

export function IndicatorsDisplayWidget_single({
  type,
}: IndicatorsDisplayWidgetProps_single) {
  const title = type
    .split("-")
    .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
    .join(" ");
  const value = "50%"; // require API

  return (
    <TouchableOpacity style={{ flex: 1, width: "100%" }}>
      <Widget style={styles.customWidgetStyle}>
        <View style={styles.layout}>
          <View style={styles.titleDisplay}>
            <SvgImage style={{ width: 30, height: 30 }} name={type} />
            <Text style={styles.title}>{title}</Text>
          </View>
          <Text style={styles.value}>{value}</Text>
        </View>
      </Widget>
    </TouchableOpacity>
  );
}

// Default Style
const styles = StyleSheet.create({
  customWidgetStyle: {
    alignItems: "center",
    justifyContent: "center",
  },
  layout: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  titleDisplay: {
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
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "left",
  },
});
