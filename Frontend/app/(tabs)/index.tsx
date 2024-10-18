import {
  StyleSheet,
  View,
  ScrollView,
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import { useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";

import { BackgroundGradient } from "@/constants/Colors";

import { WeatherDisplay } from "@/components/WeatherDisplay";
import { ForecastDisplayWidget } from "@/components/ForecastDisplayWidget";
import { IndicatorsDisplayWidget_single } from "@/components/IndicatorsDisplayWidget_single";
import { IndicatorsDisplayWidget_double } from "@/components/IndicatorsDisplayWidget_double";
import { SuggestionDisplayWidget } from "@/components/SuggestionDisplayWidget";
import { SvgImage } from "@/components/Svg";

import { Selecter, WeatherDataList } from "./_layout";

const { height: screenHeight } = Dimensions.get("window");

// TODO list:
// - [V] Add weather data API
// - [V] Add weather image
// - [X] Fix muti-day weather forecast view (Cancel)
// - [ ] Switch to use region name to fetch weather data
// - [V] Switch to use Redux for global state management
// - [V] Move weatherDataList, region, currentTime to index.tsx

export default function HomeScreen() {
  const selecter = useSelector(
    (state: { selecter: Selecter }) => state.selecter
  );
  const weatherDataList = useSelector(
    (state: { weatherData: WeatherDataList }) => state.weatherData
  );
  const weatherData = weatherDataList?.[selecter.region]?.[0]?.[0] ?? null;
  const [isSecendLayout, setIsSecendLayout] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = scrollY.interpolate({
    inputRange: [0, screenHeight / 5],
    outputRange: [screenHeight * 0.2, screenHeight * 0.1],
    extrapolate: "clamp",
  });
  const contentHeight = scrollY.interpolate({
    inputRange: [0, screenHeight / 5],
    outputRange: [screenHeight * 0.7, screenHeight * 0.9],
    extrapolate: "clamp",
  });
  const opacity = scrollY.interpolate({
    inputRange: [0, screenHeight / 5, screenHeight / 4],
    outputRange: [1, 0, 1], // 從 1 漸變到 0.5
    extrapolate: "clamp",
  });

  scrollY.addListener(({ value }) => {
    setIsSecendLayout(value > screenHeight / 5);
  });

  return (
    <View style={styles.container}>
      {/* Gradiant */}
      <LinearGradient
        colors={
          !weatherData
            ? ["#333333", "#333333"]
            : weatherData.time.split(" ")[1] < "18:00:00" &&
              weatherData.time.split(" ")[1] >= "06:00:00"
            ? BackgroundGradient.day[
                weatherData.weatherCode as keyof typeof BackgroundGradient.day
              ]
            : BackgroundGradient.night[
                weatherData.weatherCode as keyof typeof BackgroundGradient.night
              ]
        }
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: "100%",
        }}
      ></LinearGradient>

      {/* Top Section */}
      <View style={[styles.topSection]}>
        <View style={styles.cityNameDisplay}>
          <Text style={styles.cityName}>{selecter.region} </Text>
          <TouchableOpacity>
            <SvgImage style={{ width: 25, height: 25 }} name="list" />
          </TouchableOpacity>
        </View>
        <Animated.View
          style={[
            {
              flexDirection: "row",
              width: "100%",
              justifyContent: "flex-start",
            },
            { transform: [], opacity },
            { height: headerHeight },
          ]}
        >
          <WeatherDisplay isSecendLayout={isSecendLayout} />
        </Animated.View>
      </View>

      {/* Body Section */}
      <ScrollView
        style={styles.bodySection}
        contentContainerStyle={{ paddingBottom: 20 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <Animated.View style={{ gap: 20, height: contentHeight }}>
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
        </Animated.View>
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
    marginTop: "10%",
    // height: "30%",
    justifyContent: "center",
    position: "relative",
    padding: "3%",
  },
  cityName: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "left",
  },
  cityNameDisplay: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: "100%",
    flexDirection: "row",
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
