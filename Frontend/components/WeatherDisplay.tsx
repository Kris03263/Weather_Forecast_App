import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
} from "react-native";

export function WeatherDisplay() {
  return (
    <View style={styles.layout}>
      <Text style={styles.cityName}>TAIPEI, TAIWAN</Text>
      <View style={styles.temperatureDisplay}>
        <Text style={styles.temperature}>20°C</Text>
        <Text style={styles.body_temperature}>| 20°C </Text>
      </View>
      <View style={styles.weatherIcon} />
    </View>
  );
}

// Default Style
const styles = StyleSheet.create({
  layout: {
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: 20,
    gap: 10,
  },
  cityName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
  },
  temperatureDisplay: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "baseline",
  },
  temperature: {
    color: "white",
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "left",
  },
  body_temperature: {
    color: "white",
    marginLeft: 10,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
  },
  weatherIcon: {
    position: "absolute",
    right: -50,
    top: "50%",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#FFE27D",
  },
});
