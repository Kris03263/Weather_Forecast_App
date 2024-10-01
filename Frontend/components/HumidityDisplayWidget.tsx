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

const humidityIcon = "/assets/svgs/humidity-icon.svg";

export function HumidityDisplayWidget() {
  return (
    <Widget style={styles.humidityDisplayWidget}>
      <View style={styles.layout}>
        <View style={styles.titleDisplay}>
          <Svg style={{ width: 30, height: 30 }} src={humidityIcon} />
          <Text style={styles.title}>Humidity</Text>
        </View>
        <Text style={styles.value}>50%</Text>
      </View>
    </Widget>
  );
}

// Default Style
const styles = StyleSheet.create({
  humidityDisplayWidget: {
    alignItems: "center",
    justifyContent: "center",
  },
  layout: {
    minWidth: "100%",
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
    color: "black",
    fontSize: 24,
    textAlign: "left",
  },
  value: {
    color: "black",
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "left",
  },
});
