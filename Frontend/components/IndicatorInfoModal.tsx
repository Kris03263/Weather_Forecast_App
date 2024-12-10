// React Component and Package
import { View, Pressable, Text, StyleSheet, FlatList } from "react-native";
import { useState, useEffect } from "react";
// Interfaces and Enums
import {
  indicators,
  indicatorsDictionary,
  WeatherData,
} from "@/app/(tabs)/_layout";
// Components
import { Dropdown } from "@/components/DropDown";
import { Chart } from "@/components/Chart";
import { SlideModal } from "@/components/SlideModal";

export interface SelectedData {
  value: number;
  maxValue: number;
  minValue: number;
  unit: string;
}

interface IndicatorInfoModalProps {
  indicatorType: indicators;
  weatherDatas: WeatherData[];
  isVisible: boolean;
  onClose: () => void;
}

export function IndicatorInfoModal({
  indicatorType,
  weatherDatas,
  isVisible,
  onClose,
}: IndicatorInfoModalProps) {
  const [selectedIndicator, setSelectedIndicator] =
    useState<indicators>(indicatorType);
  const [selectedData, setSelectedData] = useState<SelectedData>({
    value: 0,
    maxValue: 0,
    minValue: 0,
    unit: "",
  });
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const indicatorList = Object.keys(indicatorsDictionary)
    .filter(
      (key) =>
        indicatorsDictionary[key as keyof typeof indicatorsDictionary].hasChart
    )
    .map((key) => key as indicators);

  useEffect(() => {
    setSelectedIndicator(indicatorType);
  }, [indicatorType]);

  if (!weatherDatas || weatherDatas.length === 0) {
    return (
      <SlideModal
        title={indicatorsDictionary[selectedIndicator].title}
        svgName={indicatorsDictionary[selectedIndicator].svgName}
        isVisible={isVisible}
        onClose={onClose}
      >
        <View style={styles.separator} />

        <Text style={styles.loadingText}>載入資料中...</Text>
        <Text style={styles.hintText}>
          (若長時間無法載入，請檢查網路連線或聯絡開發者)
        </Text>
      </SlideModal>
    );
  }
  return (
    <SlideModal
      title={indicatorsDictionary[selectedIndicator].title}
      svgName={indicatorsDictionary[selectedIndicator].svgName}
      isVisible={isVisible}
      onClose={onClose}
    >
      {/* Date Selector */}
      <View style={styles.dateSelecterLayout}>
        <FlatList
          horizontal
          style={styles.dateSelectorContainer}
          contentContainerStyle={styles.dateSelectorContentContainer}
          data={Array.from({ length: 4 })}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => {
            const dayNames = ["日", "一", "二", "三", "四", "五", "六"];
            //自動換月份
            const day =
              dayNames[
                new Date(
                  new Date().getFullYear(),
                  new Date().getMonth(),
                  new Date().getDate() + index
                ).getDay()
              ];
            //自動換月份
            const date = new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate() + index
            ).getDate();

            return (
              <Pressable
                key={index}
                style={[
                  styles.dateSelectorItem,
                  selectedDateIndex === index &&
                    styles.dateSelectorItem_Selected,
                ]}
                onPress={() => setSelectedDateIndex(index)}
              >
                <Text style={styles.dayText}>{`${day}`}</Text>
                <Text style={styles.dateText}>{date}</Text>
              </Pressable>
            );
          }}
        />
      </View>

      <View style={styles.separator} />

      <View style={styles.row}>
        {/* Indicator Text */}
        <View style={styles.weatherInfoLayout}>
          <Text style={styles.weatherInfoMainText}>
            {selectedData.value || weatherDatas?.[0]?.[indicatorType]}
            {selectedData.unit}
          </Text>

          <Text style={styles.weatherInfoSubText}>
            最高 {selectedData.maxValue}
            {selectedData.unit} 最低 {selectedData.minValue}
            {selectedData.unit}
          </Text>
        </View>

        {/* Indicator Type Selector */}
        <Dropdown
          itemList={indicatorList.map((key) => ({
            title: indicatorsDictionary[key].title,
            svgName: indicatorsDictionary[key].svgName,
          }))}
          onSelect={(index) => setSelectedIndicator(indicatorList[index])}
        />
      </View>
      <View onStartShouldSetResponder={() => false}>
        {/* Chart */}
        <Chart
          indicatorType={selectedIndicator}
          weatherDatas={weatherDatas}
          selectedDateIndex={selectedDateIndex}
          onSelectDataChange={(newSelectData: SelectedData) =>
            setSelectedData(newSelectData)
          }
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>當日小結</Text>
        <Text style={styles.cardText}></Text>
      </View>
    </SlideModal>
  );
}

const styles = StyleSheet.create({
  // Loading
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
  // Separator
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: "#9ca8b7",
  },
  // Date Selector
  dateSelecterLayout: {
    width: "100%",
    height: "auto",
  },
  dateSelectorContainer: {
    flexDirection: "row",
    paddingLeft: 20,
  },
  dateSelectorContentContainer: {
    alignItems: "center",
  },
  dateSelectorItem: {
    width: 60, // 固定寬度
    alignItems: "center",
    padding: 10,
    marginTop: 15,
    marginHorizontal: 10,
  },
  dateSelectorItem_Selected: {
    backgroundColor: "#3a95ff",
    borderRadius: 15,
  },
  dayText: {
    color: "white",
    fontSize: 12,
  },
  dateText: {
    color: "white",
    fontSize: 16,
    marginTop: 3,
  },
  // Weather Info
  weatherInfoLayout: {
    alignItems: "flex-start",
    justifyContent: "center",
  },
  weatherInfoMainText: {
    fontSize: 48,
    color: "white",
  },
  weatherInfoSubText: {
    fontSize: 16,
    color: "#aaa",
  },
  // Svg
  svgImage: {
    width: 20,
    height: 20,
  },
  // Card
  card: {
    width: "100%",
    backgroundColor: "#2c3136",
    borderRadius: 10,
    padding: 15,
    gap: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#9ca8b7",
  },
  cardText: {
    fontSize: 14,
    color: "#d1d5da",
  },
  // Row
  row: {
    minWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
});
