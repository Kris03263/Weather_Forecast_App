import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
} from "react-native";

import { Widget } from "@/components/Widget";
import { Svg } from "@/components/Svg";

const [windDirectionIcon, windSpeedIcon] = [
  "/assets/svgs/wind-direction-icon.svg",
  "/assets/svgs/wind-speed-icon.svg",
];

export function WindDisplayWidget() {
  return (
    <Widget style={styles.windDisplayWidget}>
      <View style={styles.layout}>
        <View style={[styles.titleDisplay, { minWidth: "60%" }]}>
          <Svg style={{ width: 30, height: 30 }} src={windDirectionIcon}></Svg>
          <Text style={styles.title}>Wind Direction</Text>
        </View>
        <Text style={styles.value}>North</Text>
      </View>

      <View style={styles.layout}>
        <View style={[styles.titleDisplay, { minWidth: "60%" }]}>
          <Svg style={{ width: 30, height: 30 }} src={windSpeedIcon}></Svg>
          <Text style={styles.title}>{"Wind Speed"}</Text>
        </View>
        <Text style={styles.value}>5m/s</Text>
      </View>
    </Widget>
  );
}

// Default Style
const styles = StyleSheet.create({
  windDisplayWidget: {
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
    color: "black",
    fontSize: 24,
    textAlign: "left",
  },
  value: {
    color: "black",
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "left",
  },
});
