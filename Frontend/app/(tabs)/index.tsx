import {
  Image,
  StyleSheet,
  Platform,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { CityView } from "@/components/CItyView";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* 頂部的背景和圓形 */}
      <View style={styles.topSection}>
        <Text style={styles.cityName}>TAIPEI, TAIWAN</Text>
        <Text style={styles.temperature}>20°C</Text>
        <View style={styles.sunCircle} />
      </View>

      {/* 中間部分，滾動列表展示每小時預報 */}
      <View style={styles.bodySection}>
        <View style={styles.weatherOverallView}>
          <CityView cityName="Taipei, Taiwan" date="09/27"></CityView>
          <CityView cityName="New York, USA" date="09/27"></CityView>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2D2D2D",
  },
  topSection: {
    height: "30%",
    backgroundColor: "#1C1C1C",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  cityName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  temperature: {
    color: "white",
    fontSize: 48,
    fontWeight: "bold",
    marginTop: 10,
  },
  sunCircle: {
    position: "absolute",
    right: -50,
    top: "20%",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "yellow",
  },
  bodySection: {
    backgroundColor: "#FFFFFF",
    height: "70%",
    padding: "3%",
  },
  weatherOverallView: {
    // flex: 0.3,
    gap: 20,
    backgroundColor: "#D9D9D9",
    padding: 20,
    alignItems: "center",
    borderRadius: 15,
  },
  weatherCityView: {
    width: "100%",
    overflow: "hidden",
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
    backgroundColor: "#C4C4C4",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 24,
    color: "white",
  },
  bottomSection: {
    flex: 0.4,
    backgroundColor: "#7A7A7A",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
  },
  placeholderCard: {
    width: 120,
    height: 120,
    backgroundColor: "#EAEAEA",
    borderRadius: 8,
  },
});
