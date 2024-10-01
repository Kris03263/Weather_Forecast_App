import {
  Image,
  StyleSheet,
  Platform,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { ReactSVG } from "react-svg";

import { Widget } from "@/components/Widget";
import { ForecastDisplayWidget } from "@/components/ForecastDisplayWidget";
import { HumidityDisplayWidget } from "@/components/HumidityDisplayWidget";
import { WindDisplayWidget } from "@/components/WindDisplayWidget";
import { WeatherDisplay } from "@/components/WeatherDisplay";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <WeatherDisplay />
      </View>

      {/* Body Section */}
      <ScrollView style={styles.bodySection}>
        <View style={{ gap: 20 }}>
          <ForecastDisplayWidget />

          <View style={styles.horizontalWidget}>
            <HumidityDisplayWidget />
            <Widget />
          </View>

          <WindDisplayWidget />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#10202b",
  },
  topSection: {
    height: "30%",
    justifyContent: "center",
    position: "relative",
  },
  bodySection: {
    backgroundColor: "#FFFFFFAA",
    height: "70%",
    padding: "3%",
  },
  horizontalWidget: {
    minWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
});
