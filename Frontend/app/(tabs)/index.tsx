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
import { useSelector } from "react-redux";

import { WeatherDisplay } from "@/components/WeatherDisplay";
import { ForecastDisplayWidget } from "@/components/ForecastDisplayWidget";
import { IndicatorsDisplayWidget_single } from "@/components/IndicatorsDisplayWidget_single";
import { IndicatorsDisplayWidget_double } from "@/components/IndicatorsDisplayWidget_double";
import { SuggestionDisplayWidget } from "@/components/SuggestionDisplayWidget";
import { SvgImage } from "@/components/Svg";

import { Selecter, WeatherDataList } from "./_layout";
import { Background } from "@/components/Background";
import { EarthQuakeDisplayWidget } from "@/components/EarthQuakeDisplayWidget";

const { height: screenHeight } = Dimensions.get("window");

// TODO list:
// - [V] Add weather data API
// - [V] Add weather image
// - [X] Fix muti-day weather forecast view (Cancel)
// - [ ] Switch to use region name to fetch weather data
// - [V] Switch to use Redux for global state management
// - [V] Move weatherDataList, region, currentTime to index.tsx
// - [ ] Use a global variable to save wrong msg
// - [X] Move background color control to _layout.tsx (Instead moving to Background.tsx)

export default function HomeScreen() {
  const selecter = useSelector(
    (state: { selecter: Selecter }) => state.selecter
  );
  const weatherDataList = useSelector(
    (state: { weatherData: WeatherDataList }) => state.weatherData
  );
  const weatherData = weatherDataList?.[selecter.region]?.[0]?.[0] ?? null;

  // Header Control
  const [isSecendLayout, setIsSecendLayout] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  scrollY.addListener(({ value }) => {
    setIsSecendLayout(value > screenHeight / 5);
  });

  const headerHeight = scrollY.interpolate({
    inputRange: [0, screenHeight / 5],
    outputRange: [screenHeight * 0.2, screenHeight * 0.1],
    extrapolate: "clamp",
  });
  const contentHeight = scrollY.interpolate({
    inputRange: [0, screenHeight / 5],
    outputRange: [screenHeight * 0.5, screenHeight * 0.6],
    extrapolate: "clamp",
  });
  const opacity = scrollY.interpolate({
    inputRange: [0, screenHeight / 5, screenHeight / 4],
    outputRange: [1, 0, 1],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      {/* Gradiant */}
      <Background weatherData={weatherData} />

      {/* Top Section */}
      <View style={[styles.topSection]}>
        {weatherData && (
          <>
            <View style={styles.regionNameDisplay}>
              <Text style={styles.regionName}>{selecter.region} </Text>
            </View>
            <Animated.View
              style={[
                styles.temperatureDisplay,
                {
                  opacity: opacity,
                  height: headerHeight,
                },
              ]}
            >
              <WeatherDisplay isSecendLayout={isSecendLayout} />
            </Animated.View>
          </>
        )}
      </View>

      {!weatherData && (
        <View style={styles.topSection}>
          <Text style={styles.loadingText}>{"載入資料中..."}</Text>
          <Text style={styles.hintText}>
            {"(若長時間無法載入，請檢查網路連線或聯絡開發者)"}
          </Text>
        </View>
      )}

      {/* Body Section */}
      {weatherData && (
        <ScrollView
          style={styles.bodySection}
          contentContainerStyle={{ paddingBottom: 20 }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
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

          <View style={styles.row}>
            <EarthQuakeDisplayWidget />
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  hintText: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
  },
  topSection: {
    marginTop: "10%",
    justifyContent: "center",
    position: "relative",
    padding: "3%",
  },
  regionName: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "left",
  },
  regionNameDisplay: {
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    minWidth: "100%",
    flexDirection: "row",
  },
  temperatureDisplay: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-start",
  },
  bodySection: {
    backgroundColor: "#FFFFFF01",
    height: "70%",
    padding: "3%",
    paddingBottom: "20%",
  },
  row: {
    minWidth: "100%",
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "center",
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
