import {
  View,
  Modal,
  Pressable,
  Animated,
  PanResponder,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { SvgImage } from "@/components/Svg";
import { Dropdown } from "@/components/DropDown";
import Chart from "@/components/Chart";
import {
  indicators,
  indicatorsDictionary,
  WeatherData,
} from "@/app/(tabs)/_layout";

interface selectedData {
  time: string;
  value: number;
  maxValue: number;
  minValue: number;
  unit: string;
}

interface modalVisibleCrontrollProps {
  indicatorType: indicators;
  weatherDatas: WeatherData[];
  isModalShow: boolean;
  onClose: () => void;
}

export function SlideModal({
  indicatorType,
  weatherDatas,
  isModalShow,
  onClose,
}: modalVisibleCrontrollProps) {
  const [selectedIndicator, setSelectedIndicator] =
    useState<indicators>(indicatorType);
  const [selectedData, setSelectedData] = useState<selectedData>({
    time: "",
    value: 0,
    maxValue: 0,
    minValue: 0,
    unit: "",
  });
  const [selectedDateIndex, setSelectedDateIndex] = useState(3);
  const pan = useRef(new Animated.ValueXY()).current;
  const [segmentDates, setSegmentDates] = useState<string[]>([]);

  useEffect(() => {
    if (isModalShow) {
      Animated.timing(pan, {
        toValue: { x: 0, y: 0 },
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [isModalShow]);

  useEffect(() => {
    setSelectedIndicator(indicatorType);
  }, [indicatorType]);

  return (
    <View style={styles.modalBackground}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalShow}
        onRequestClose={() => onClose()}
      >
        <View style={styles.modalBackground}>
          <Animated.View
            style={[styles.modalView, { transform: [{ translateY: pan.y }] }]}
          >
            {/* Header */}
            <View style={styles.headerLayout}>
              <Pressable />

              <View style={styles.titleLayout}>
                <SvgImage
                  style={styles.svgImage}
                  name={indicatorsDictionary[selectedIndicator].svgName}
                />
                <Text style={styles.titleText}>
                  {indicatorsDictionary[selectedIndicator].title}
                </Text>
              </View>

              <Pressable style={styles.closeButton} onPress={() => onClose()}>
                <SvgImage style={styles.svgImage} name="close" />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              {/* Date Selector */}
              <View style={styles.dateSelecterLayout}>
                <FlatList
                  horizontal
                  style={styles.dateSelectorContainer}
                  contentContainerStyle={styles.dateSelectorContentContainer}
                  data={segmentDates}
                  keyExtractor={(_, index) => index.toString()}
                  renderItem={({ item: dateStr, index }) => {
                    const dateObj = new Date(dateStr);
                    const dayNames = ["日", "一", "二", "三", "四", "五", "六"];
                    const day = dayNames[dateObj.getDay()];
                    const date = dateObj.getDate();

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
                {/* Weather Info Section */}
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

                {/* Dropdown */}
                <Dropdown
                  indicatorType={selectedIndicator}
                  onIndicatorChange={(indicator: indicators) =>
                    setSelectedIndicator(indicator)
                  }
                />
              </View>

              <View style={styles.contentLayout}>
                {/* Chart */}
                <Chart
                  indicatorType={selectedIndicator}
                  weatherDatas={weatherDatas}
                  selectedDatesIndex={selectedDateIndex}
                  onSelectDataChange={(newSelectData: selectedData) =>
                    setSelectedData(newSelectData)
                  }
                  onSegmentDatesChange={(newSegmentDates: string[]) =>
                    setSegmentDates(newSegmentDates)
                  }
                />
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalView: {
    width: "100%",
    height: "90%",
    backgroundColor: "#21262c",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  scrollViewContent: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  // Separator
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: "#9ca8b7",
    marginVertical: 10,
  },

  // Header
  headerLayout: {
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // Title
  titleLayout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
  },
  titleText: {
    color: "white",
    fontSize: 20,
    textAlign: "left",
  },

  // Date Selector
  dateSelecterLayout: {
    width: "100%",
    height: "auto",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  dateSelectorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateSelectorContentContainer: {},
  dateSelectorItem: {
    padding: 10,
    alignItems: "center",
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

  // Close Button
  closeButtonText: {
    color: "#9ca8b7",
    fontWeight: "bold",
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#2f363e",
    borderRadius: 30,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },

  // Svg
  svgImage: {
    width: 20,
    height: 20,
  },

  // Content
  contentLayout: {
    width: "100%",
  },

  row: {
    minWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
