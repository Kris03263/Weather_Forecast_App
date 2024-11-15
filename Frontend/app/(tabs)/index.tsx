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
import { FlatList } from "react-native-gesture-handler";

import {
  Region,
  Selecter,
  WeatherDataList,
  DailySug,
  indicators,
} from "./_layout";

import { WeatherDisplay } from "@/components/WeatherDisplay";
import { ForecastDisplayWidget } from "@/components/ForecastDisplayWidget";
import { IndicatorsDisplayWidget } from "@/components/IndicatorsDisplayWidget";
import { SuggestionDisplayWidget } from "@/components/SuggestionDisplayWidget";
import { Background } from "@/components/Background";
import { EarthQuakeDisplayWidget } from "@/components/EarthQuakeDisplayWidget";
import { SlideModal } from "@/components/SlideModal";
import store from "@/redux/store";
import {
  setSelectedRegionIndex,
  setSelectedTargetRegionIndex,
} from "@/redux/selecterSlice";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

export default function HomeScreen() {
  const selecter = useSelector(
    (state: { selecter: Selecter }) => state.selecter
  );
  const regions = useSelector((state: { regions: Region[] }) => state.regions);
  const weatherDataList = useSelector(
    (state: { weatherData: WeatherDataList }) => state.weatherData
  );
  const dailySug = useSelector(
    (state: { dailySug: DailySug }) => state.dailySug
  );
  const weatherDatas =
    weatherDataList?.[regions[selecter.regionIndex]?.id]?.[0] ?? null;
  const weatherData = weatherDatas?.[0] ?? null;
  const region = regions[selecter.regionIndex];

  // Header Control
  const [isSecendLayout, setIsSecendLayout] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

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

  // FlatList Control
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (selecter.targetRegionIndex === -1) return;
    flatListRef.current?.scrollToOffset({
      animated: true,
      offset: selecter.targetRegionIndex * screenWidth,
    });
    store.dispatch(setSelectedTargetRegionIndex(-1));
  }, [selecter.targetRegionIndex]);

  // SlideModal Control
  const [modalVisible, setModalVisible] = useState(false);
  const [modalIndicatorType, setModalIndicatorType] = useState<indicators>(
    indicators.temp
  );

  const openSlideModal = (indicatorType: indicators) => {
    setModalIndicatorType(indicatorType);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Gradiant */}
      <Background weatherData={weatherData} />

      {/* Loading */}
      {!weatherDataList && (
        <View style={styles.topSection}>
          <Text style={styles.loadingText}>{"載入資料中..."}</Text>
          <Text style={styles.hintText}>
            {"(若長時間無法載入，請檢查網路連線或聯絡開發者)"}
          </Text>
        </View>
      )}

      {/* Top Section */}
      <View style={[styles.topSection]}>
        <View style={styles.regionNameDisplay}>
          <Text style={styles.regionName}>
            {`${region?.city}, ${region?.district}` ?? null}
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
            weatherData={weatherData}
            isSecendLayout={isSecendLayout}
          />
        </Animated.View>
      </View>

      <ScrollView
        nestedScrollEnabled={true}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <FlatList
          ref={flatListRef}
          initialScrollIndex={selecter.regionIndex}
          horizontal
          data={regions}
          onScroll={async (event) => {
            const offsetX = event.nativeEvent.contentOffset.x;
            const currentIndex = Math.round(offsetX / screenWidth);
            store.dispatch(setSelectedRegionIndex(currentIndex));
          }}
          pagingEnabled={true}
          nestedScrollEnabled={true}
          renderItem={({ item, index }) => (
            <View style={{ width: screenWidth }}>
              {/* Body Section */}
              <View style={styles.bodySection}>
                <ForecastDisplayWidget
                  onPress={() => openSlideModal(indicators.temp)}
                  weatherDatas={weatherDataList?.[item.id]?.[0] ?? null}
                />
                <View style={styles.row}>
                  <IndicatorsDisplayWidget
                    indicatorType={indicators.wet}
                    onPress={() => openSlideModal(indicators.wet)}
                    weatherData={weatherDataList?.[item.id]?.[0]?.[0] ?? null}
                  />
                  <IndicatorsDisplayWidget
                    indicatorType={indicators.rainRate}
                    onPress={() => openSlideModal(indicators.rainRate)}
                    weatherData={weatherDataList?.[item.id]?.[0]?.[0] ?? null}
                  />
                </View>
                <View style={styles.row}>
                  <IndicatorsDisplayWidget
                    indicatorType={indicators.windSpeed}
                    onPress={() => openSlideModal(indicators.windSpeed)}
                    weatherData={weatherDataList?.[item.id]?.[0]?.[0] ?? null}
                  />
                  <IndicatorsDisplayWidget
                    indicatorType={indicators.windDirection}
                    onPress={() => openSlideModal(indicators.windDirection)}
                    weatherData={weatherDataList?.[item.id]?.[0]?.[0] ?? null}
                  />
                </View>
                <View style={styles.row}>
                  <SuggestionDisplayWidget
                    type="dressing"
                    dailySug={dailySug}
                  />
                  <SuggestionDisplayWidget type="health" dailySug={dailySug} />
                </View>
                <View style={styles.row}>
                  <SuggestionDisplayWidget type="sport" dailySug={dailySug} />
                  <SuggestionDisplayWidget
                    type="transportation"
                    dailySug={dailySug}
                  />
                </View>
                <View style={styles.row}>
                  <SuggestionDisplayWidget
                    type="activity"
                    dailySug={dailySug}
                  />
                </View>
                <View style={styles.row}>
                  <EarthQuakeDisplayWidget
                    onPress={() => openSlideModal(indicators.aqi)}
                  />
                </View>
              </View>
              <SlideModal
                indicatorType={modalIndicatorType}
                weatherDatas={weatherDataList?.[item.id]?.[0] ?? null}
                isModalShow={modalVisible}
                onClose={() => setModalVisible(false)}
              />
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth,
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
