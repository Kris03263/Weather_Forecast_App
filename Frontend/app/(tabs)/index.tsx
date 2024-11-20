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
  EarthquakeDataList,
} from "./_layout";

import { WeatherDisplay } from "@/components/WeatherDisplay";
import { ForecastDisplayWidget } from "@/components/ForecastDisplayWidget";
import { IndicatorsDisplayWidget } from "@/components/IndicatorsDisplayWidget";
import { SuggestionDisplayWidget } from "@/components/SuggestionDisplayWidget";
import { Background } from "@/components/Background";
import { EarthquakesDisplayWidget } from "@/components/EarthquakesDisplayWidget";
import { IndicatorInfoModal } from "@/components/IndicatorInfoModal";
import store from "@/redux/store";
import {
  setSelectedRegionIndex,
  setSelectedTargetRegionIndex,
} from "@/redux/selecterSlice";

export default function HomeScreen() {
  const selecter = useSelector(
    (state: { selecter: Selecter }) => state.selecter
  );
  const regions = useSelector((state: { regions: Region[] }) => state.regions);
  const weatherDataList = useSelector(
    (state: { weatherData: WeatherDataList }) => state.weatherData
  );
  const earthquakeDataList = useSelector(
    (state: { earthquakeData: EarthquakeDataList }) => state.earthquakeData
  );
  const dailySug = useSelector(
    (state: { dailySug: DailySug }) => state.dailySug
  );
  const weatherDatas =
    weatherDataList?.[regions[selecter.regionIndex]?.id]?.[0] ?? null;
  const weatherData = weatherDatas?.[0] ?? null;
  const region = regions[selecter.regionIndex];

  // Screen Size Control
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get("window").height
  );
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );

  useEffect(() => {
    const updateScreen = () => {
      setScreenWidth(Dimensions.get("window").width);
      setScreenHeight(Dimensions.get("window").height);
    };
    Dimensions.addEventListener("change", updateScreen);
    updateScreen();
  }, []);

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
  const [activeModalId, setActiveModalId] = useState<string>("-1");
  const [modalIndicatorType, setModalIndicatorType] = useState<indicators>(
    indicators.temp
  );

  const openSlideModal = (id: string, indicatorType: indicators) => {
    setModalIndicatorType(indicatorType);
    setActiveModalId(id);
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
          <Text style={styles.regionNameText}>
            {`${region?.city}, ${region?.district}` ?? null}
          </Text>
        </View>

        <Animated.View
          style={[
            styles.weatherDisplayLayout,
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
                  onPress={() => openSlideModal(item.id, indicators.temp)}
                  weatherDatas={weatherDataList?.[item.id]?.[0] ?? null}
                />
                <IndicatorsDisplayWidget
                  indicatorType={indicators.wet}
                  onPress={() => openSlideModal(item.id, indicators.wet)}
                  weatherData={weatherDataList?.[item.id]?.[0]?.[0] ?? null}
                />
                <IndicatorsDisplayWidget
                  indicatorType={indicators.rainRate}
                  onPress={() => openSlideModal(item.id, indicators.rainRate)}
                  weatherData={weatherDataList?.[item.id]?.[0]?.[0] ?? null}
                />
                <IndicatorsDisplayWidget
                  indicatorType={indicators.windSpeed}
                  onPress={() => openSlideModal(item.id, indicators.windSpeed)}
                  weatherData={weatherDataList?.[item.id]?.[0]?.[0] ?? null}
                />
                <IndicatorsDisplayWidget
                  indicatorType={indicators.windDirection}
                  onPress={() => {}}
                  weatherData={weatherDataList?.[item.id]?.[0]?.[0] ?? null}
                />
                <IndicatorsDisplayWidget
                  indicatorType={indicators.pm2_5}
                  onPress={() => {}}
                  weatherData={weatherDataList?.[item.id]?.[0]?.[0] ?? null}
                />
                <IndicatorsDisplayWidget
                  indicatorType={indicators.aqi}
                  onPress={() => {}}
                  weatherData={weatherDataList?.[item.id]?.[0]?.[0] ?? null}
                />
                <IndicatorsDisplayWidget
                  indicatorType={indicators.bodyTemp}
                  onPress={() => openSlideModal(item.id, indicators.bodyTemp)}
                  weatherData={weatherDataList?.[item.id]?.[0]?.[0] ?? null}
                />
                <SuggestionDisplayWidget type="activity" dailySug={dailySug} />
                <SuggestionDisplayWidget type="dressing" dailySug={dailySug} />
                <SuggestionDisplayWidget type="health" dailySug={dailySug} />
                <SuggestionDisplayWidget type="sport" dailySug={dailySug} />
                <SuggestionDisplayWidget
                  type="transportation"
                  dailySug={dailySug}
                />
                <EarthquakesDisplayWidget
                  onPress={() => openSlideModal(item.id, indicators.aqi)}
                  earthquakeData={earthquakeDataList.recent ?? null}
                />
              </View>
              <IndicatorInfoModal
                indicatorType={modalIndicatorType}
                weatherDatas={weatherDataList?.[item.id]?.[0] ?? null}
                isModalShow={activeModalId === item.id}
                onClose={() => setActiveModalId("-1")}
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
  regionNameDisplay: {
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    minWidth: "100%",
    flexDirection: "row",
  },
  regionNameText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "left",
  },
  weatherDisplayLayout: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-start",
  },
  bodySection: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    backgroundColor: "#FFFFFF01",
    padding: "3%",
    paddingBottom: 80,
  },
  rowLayout: {
    minWidth: "100%",
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "center",
  },
});
