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
import { Widget } from "@/components/Widget";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* 頂部的背景和圓形 */}
      <View style={styles.topSection}>
        <Text style={styles.cityName}>TAIPEI, TAIWAN</Text>
        <Text style={styles.temperature}>20°C</Text>
        <View style={styles.weatherIcon} />
      </View>

      {/* 中間部分，滾動列表展示每小時預報 */}
      <ScrollView style={styles.bodySection}>
        <View style={{ gap: 20 }}>
          <Widget style={styles.weatherOverallView}>
            <CityView cityName="Taipei, Taiwan" date="09/27"></CityView>
            <CityView
              cityName="New York, USA"
              date="09/27"
              timeInterval_type={1}
            ></CityView>
            <CityView
              cityName="Taipei, Taiwan"
              date="09/27"
              timeInterval_type={0}
            ></CityView>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </Widget>

          <View style={styles.horizontalDisplay}>
            <Widget></Widget>
            <Widget></Widget>
          </View>

          <Widget></Widget>
          <Widget></Widget>
          <Widget></Widget>
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
  weatherIcon: {
    position: "absolute",
    right: -50,
    top: "50%",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#FFE27D",
  },
  bodySection: {
    backgroundColor: "#FFFFFFAA",
    height: "70%",
    padding: "3%",
  },
  horizontalDisplay: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },
  weatherOverallView: {
    flex: 10,
    minHeight: "auto",
    gap: 20,
    backgroundColor: "#FFFFFF20",
    padding: 20,
    alignItems: "center",
    borderRadius: 15,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EAEAEA",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 24,
    color: "#000000",
  },
});
