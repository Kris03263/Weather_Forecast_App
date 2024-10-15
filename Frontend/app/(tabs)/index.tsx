import { StyleSheet, View, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { WeatherDisplay } from "@/components/WeatherDisplay";
import { ForecastDisplayWidget } from "@/components/ForecastDisplayWidget";
import { IndicatorsDisplayWidget_single } from "@/components/IndicatorsDisplayWidget_single";
import { IndicatorsDisplayWidget_double } from "@/components/IndicatorsDisplayWidget_double";
import { SuggestionDisplayWidget } from "@/components/SuggestionDisplayWidget";

// TODO list:
// - [V] Add weather data API
// - [V] Add weather image
// - [X] Fix muti-day weather forecast view (Cancel)
// - [ ] Switch to use region name to fetch weather data
// - [V] Switch to use Redux for global state management
// - [V] Move weatherDataList, region, currentTime to index.tsx

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Gradiant */}
      <LinearGradient
        colors={["#90E6FD", "#0384e2"]}
        // locations={[0, 0.3, 1]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: "100%",
        }}
      ></LinearGradient>

      {/* Top Section */}
      <View style={styles.topSection}>
        <WeatherDisplay />
      </View>

      {/* Body Section */}
      <ScrollView style={styles.bodySection}>
        <View style={{ gap: 20 }}>
          <ForecastDisplayWidget />

          <View style={styles.row}>
            <IndicatorsDisplayWidget_single type="wet" />
            <IndicatorsDisplayWidget_single type="rainRate" />
          </View>

          <View style={styles.row}>
            <IndicatorsDisplayWidget_double
              type1="windSpeed"
              type2="windDirection"
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
    marginTop: 30,
    height: "30%",
    justifyContent: "center",
    position: "relative",
    padding: "3%",
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
  dropdown: {
    marginLeft: 20,
    width: 150,
    height: 32,
    fontSize: 16,
    padding: 4,
    color: "white",
    backgroundColor: "none",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "white",
  },
  dropdownBox: {
    marginTop: 10,
    marginLeft: 20,
    width: 150,
    height: "auto",
    color: "none",
    backgroundColor: "none",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "white",
  },
  dropdownText: {
    padding: 4,
    fontSize: 16,
    color: "white",
    backgroundColor: "none",
  },
  dropdownHightlight: {
    backgroundColor: "pink",
    fontWeight: "bold",
  },
});
