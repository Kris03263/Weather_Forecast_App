import {
  Image,
  StyleSheet,
  Platform,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { WeatherDisplay } from "@/components/WeatherDisplay";
import { ForecastDisplayWidget } from "@/components/ForecastDisplayWidget";
import { IndicatorsDisplayWidget_single } from "@/components/IndicatorsDisplayWidget_single";
import { IndicatorsDisplayWidget_double } from "@/components/IndicatorsDisplayWidget_double";
import { SuggestionDisplayWidget } from "@/components/SuggestionDisplayWidget";

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

          <View style={styles.row}>
            <IndicatorsDisplayWidget_single type="humidity" />
            <IndicatorsDisplayWidget_single type="rain-rate" />
          </View>

          <View style={styles.row}>
            <IndicatorsDisplayWidget_double
              type1="wind-speed"
              type2="wind-direction"
            />
          </View>

          <View style={styles.row}>
            <SuggestionDisplayWidget type="dressing" />
            <SuggestionDisplayWidget type="health" />
          </View>

          <View style={styles.row}>
            <SuggestionDisplayWidget type="sport" />
            <SuggestionDisplayWidget type="transportation" />
          </View>

          <View style={styles.row}>
            <SuggestionDisplayWidget type="activity" />
          </View>
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
    backgroundColor: "#FFFFFF01",
    height: "70%",
    padding: "3%",
  },
  row: {
    minWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
});
