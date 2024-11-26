import {
  View,
  Modal,
  Pressable,
  Animated,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { SvgImage } from "@/components/Svg";
import { Dropdown } from "@/components/DropDown";
import { Chart } from "@/components/Chart";
import {
  indicators,
  indicatorsDictionary,
  WeatherData,
} from "@/app/(tabs)/_layout";

export interface SelectedData {
  value: number;
  maxValue: number;
  minValue: number;
  unit: string;
}

interface IndicatorInfoModalProps {
  indicatorType: indicators;
  weatherDatas: WeatherData[];
  isModalShow: boolean;
  onClose: () => void;
}

export function IndicatorInfoModal({
  indicatorType,
  weatherDatas,
  isModalShow,
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
  const pan = useRef(new Animated.ValueXY()).current;

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
    <View>
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

            <ScrollView
              style={{ width: "100%" }}
              contentContainerStyle={styles.scrollViewContent}
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
                    const day = dayNames[new Date().getDay() + index];
                    const date = new Date().getDate();

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
                  indicatorType={selectedIndicator}
                  onIndicatorChange={(indicator: indicators) =>
                    setSelectedIndicator(indicator)
                  }
                />
              </View>

              {/* Chart */}
              <Chart
                indicatorType={selectedIndicator}
                weatherDatas={weatherDatas}
                selectedDateIndex={selectedDateIndex}
                onSelectDataChange={(newSelectData: SelectedData) =>
                  setSelectedData(newSelectData)
                }
              />

              <View style={styles.card}>
                <Text style={styles.cardTitle}>當日小結</Text>
                <Text style={styles.cardText}></Text>
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
    gap: 10,
  },

  // Separator
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: "#9ca8b7",
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
  },
  dateSelectorContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
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

  row: {
    minWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
});
