import {
  Image,
  StyleSheet,
  Platform,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";

// 定義 props 的類型
interface CityViewProps {
  cityName: string;
  date: string;
}

export function CityView({ cityName, date }: CityViewProps) {
  return (
    <View style={styles.weatherCityView}>
      <Text style={styles.subTitle}>
        {cityName} ({date})
      </Text>
      <ScrollView horizontal style={styles.weatherScroll}>
        {/* 每小時的預報卡片 */}
        {[
          "00:00",
          "03:00",
          "06:00",
          "09:00",
          "12:00",
          "15:00",
          "18:00",
          "21:00",
          "24:00",
        ].map((time, index) => (
          <View key={index} style={styles.weatherCard}>
            <Image
              // source={require("./cloud.png")}
              style={styles.weatherIcon}
            />
            <Text style={styles.weatherTime}>{time}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
