import { Image, StyleSheet, Text, View, ScrollView } from "react-native";

interface CityViewProps {
  cityName: string;
  date: string;
  timeInterval_type?: number; // 0 -> 3h | 1 -> 1D
}

export function CityView({
  cityName,
  date,
  timeInterval_type = 0,
}: CityViewProps) {
  const timeInterval_map = [
    [
      "00:00",
      "03:00",
      "06:00",
      "09:00",
      "12:00",
      "15:00",
      "18:00",
      "21:00",
      "24:00",
    ],
    ["Sun.", "Mon.", "Tue.", "Wed.", "Thr.", "Fri.", "Sat."],
  ];

  return (
    <View style={styles.weatherCityView}>
      <Text style={styles.subTitle}>
        {cityName} ({date})
      </Text>
      <ScrollView horizontal style={styles.weatherScroll}>
        {timeInterval_map[timeInterval_type].map((time, index) => (
          <View key={index} style={styles.weatherCard}>
            <Image
              // source={require("./cloud.png")} // require weather image
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
});
