import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Animated,
  Dimensions,
  Text,
} from "react-native";
import { useSelector } from "react-redux";
import Swiper from "react-native-swiper";

import { Region, Selecter, WeatherDataList } from "./_layout";

import { WeatherDisplay } from "@/components/WeatherDisplay";
import { ForecastDisplayWidget } from "@/components/ForecastDisplayWidget";
import { IndicatorsDisplayWidget_single } from "@/components/IndicatorsDisplayWidget_single";
import { IndicatorsDisplayWidget_double } from "@/components/IndicatorsDisplayWidget_double";
import { SuggestionDisplayWidget } from "@/components/SuggestionDisplayWidget";
import { Background } from "@/components/Background";
import { EarthQuakeDisplayWidget } from "@/components/EarthQuakeDisplayWidget";
import store from "@/redux/store";
import { setSelectedRegionIndex } from "@/redux/selecterSlice";

const { height: screenHeight } = Dimensions.get("window");

export default function HomeScreen() {
  const selecter = useSelector(
    (state: { selecter: Selecter }) => state.selecter
  );
  const regions = useSelector((state: { region: Region[] }) => state.region);
  const weatherDataList = useSelector(
    (state: { weatherData: WeatherDataList }) => state.weatherData
  );
  const weatherData =
    weatherDataList?.[regions[selecter.regionIndex]?.name]?.[0]?.[0] ?? null;

  // Header Control
  const [isSecendLayout, setIsSecendLayout] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const swiperRef = useRef<Swiper>(null);

  scrollY.addListener(({ value }) => {
    setIsSecendLayout(value > screenHeight / 5);
  });

  const headerHeight = scrollY.interpolate({
    inputRange: [0, screenHeight / 5],
    outputRange: [150, 80],
    extrapolate: "clamp",
  });
  const opacity = scrollY.interpolate({
    inputRange: [0, screenHeight / 5, screenHeight / 4],
    outputRange: [1, 0, 1],
    extrapolate: "clamp",
  });

  // useEffect(() => {}, [selecter.regionIndex]);

  return (
    <View style={styles.container}>
      {/* Gradiant */}
      <Background weatherData={weatherData} />

      {/* Top Section */}
      <View style={[styles.topSection]}>
        <View style={styles.regionNameDisplay}>
          <Text style={styles.regionName}>
            {regions[selecter.regionIndex]?.name ?? null}
          </Text>
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
          <WeatherDisplay
            region={regions[selecter.regionIndex]?.name ?? null}
            isSecendLayout={isSecendLayout}
          />
        </Animated.View>
      </View>

      {!weatherDataList && (
        <View style={styles.topSection}>
          <Text style={styles.loadingText}>{"載入資料中..."}</Text>
          <Text style={styles.hintText}>
            {"(若長時間無法載入，請檢查網路連線或聯絡開發者)"}
          </Text>
        </View>
      )}

      {/* Body Section */}
      <Swiper
        ref={swiperRef}
        style={styles.wrapper}
        showsButtons
        loop={false}
        nestedScrollEnabled={true}
        index={selecter.regionIndex}
        onIndexChanged={(index) => {
          console.log("當前頁面索引:", index);
          store.dispatch(setSelectedRegionIndex(index));
          console.log("當前頁面索引:", index);
          swiperRef.current?.scrollTo(index, true);
          console.log("當前頁面索引:", index);
        }}
        buttonWrapperStyle={styles.buttonWrapper}
        nextButton={<Text style={styles.buttonText}>›</Text>}
        prevButton={<Text style={styles.buttonText}>‹</Text>}
        paginationStyle={styles.pagination}
        dot={<View style={styles.dot} />}
        activeDot={<View style={styles.activeDot} />}
      >
        {regions.map((region) => {
          return (
            <ScrollView
              nestedScrollEnabled={true}
              key={region.id}
              style={styles.bodySection}
              contentContainerStyle={{ paddingBottom: 20 }}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false }
              )}
              scrollEventThrottle={16}
            >
              <ForecastDisplayWidget region={region.name} />
              <View style={styles.row}>
                <IndicatorsDisplayWidget_single
                  type="wet"
                  region={region.name}
                />
                <IndicatorsDisplayWidget_single
                  type="rainRate"
                  region={region.name}
                />
              </View>
              <View style={styles.row}>
                <IndicatorsDisplayWidget_single
                  type="windSpeed"
                  region={region.name}
                />
                <IndicatorsDisplayWidget_single
                  type="windDirection"
                  region={region.name}
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
          );
        })}
      </Swiper>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {},
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
    marginTop: 40,
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
    padding: "3%",
    paddingBottom: 80,
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

  buttonWrapper: {
    position: "absolute", // 讓按鈕固定在畫面上
    height: "100%", // 確保按鈕高度適配
    flexDirection: "row",
    justifyContent: "space-between", // 讓按鈕分佈在左右兩邊
  },
  buttonText: {
    color: "#fff",
    fontSize: 50,
    fontWeight: "bold",
  },
  pagination: {
    position: "absolute",
    bottom: 65, // 調整此處可設置距離底部的距離
    left: 0,
    right: 0,
    justifyContent: "center", // 將圓點居中
  },
  dot: {
    backgroundColor: "rgba(255,255,255,0.3)",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  activeDot: {
    backgroundColor: "#fff",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
});
