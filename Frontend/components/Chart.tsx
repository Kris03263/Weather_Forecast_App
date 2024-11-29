// React Component and Package
import { useEffect } from "react";
import { StyleSheet, Dimensions, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
// Interfaces and Enums
import {
  indicatorsDictionary,
  indicators,
  WeatherData,
} from "@/app/(tabs)/_layout";
// Components
import { SelectedData } from "@/components/IndicatorInfoModal";

interface ChartProps {
  indicatorType: indicators;
  weatherDatas: WeatherData[];
  selectedDateIndex: number;
  onSelectDataChange: (selectedData: SelectedData) => void;
}

export function Chart({
  indicatorType,
  weatherDatas,
  selectedDateIndex,
  onSelectDataChange,
}: ChartProps) {
  const segments: WeatherData[][] = weatherDatas.reduce(
    (acc: WeatherData[][], current, index) => {
      if (index % 8 === 0) {
        const date = current.time.split(" ")[0];
        acc.push(
          weatherDatas.filter((item) => item.time.split(" ")[0] === date)
        );
      }
      return acc;
    },
    []
  );
  const segment: WeatherData[] = segments[selectedDateIndex];
  const values = segment.map((item) => parseInt(item[indicatorType]));
  const labels = segment.map((item) => item.time.split(" ")[1].split(":")[0]);

  useEffect(() => {
    onSelectDataChange({
      value: parseInt(weatherDatas?.[0]?.[indicatorType] ?? "0"),
      maxValue: Math.max(...values),
      minValue: Math.min(...values),
      unit: indicatorsDictionary[indicatorType].unit,
    });
  }, [indicatorType, selectedDateIndex]);

  if (!segment || segment.length === 0) {
    return (
      <Text style={{ color: "#fff", textAlign: "center", marginTop: 20 }}>
        目前無可用資料
      </Text>
    );
  }

  return (
    <LineChart
      data={{
        labels: labels,
        datasets: [
          {
            data: values,
            color: () => "#59c3ff",
            strokeWidth: 4,
          },
        ],
      }}
      width={Dimensions.get("window").width - 40}
      height={220}
      yAxisSuffix={indicatorsDictionary[indicatorType].unit}
      yLabelsOffset={20}
      xAxisLabel="時"
      fromZero
      yAxisInterval={20}
      chartConfig={{
        backgroundGradientFrom: "#2c3136",
        backgroundGradientTo: "#2c3136",
        fillShadowGradient: "#3a95ff",
        fillShadowGradientTo: "#423aff",
        fillShadowGradientFromOpacity: 0.5,
        fillShadowGradientToOpacity: 0.5,
        decimalPlaces: 0,
        color: (opacity = 0) => `rgba(255, 255, 255, 0)`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
          backgroundColor: "#3a95ff",
          borderRadius: 10,
        },
        propsForDots: {
          r: "4",
          strokeWidth: "3",
          stroke: "#2c3136",
          fill: "white",
        },
      }}
      style={styles.chart}
      onDataPointClick={({ value }) => {
        onSelectDataChange({
          value: value,
          maxValue: Math.max(...values),
          minValue: Math.min(...values),
          unit: indicatorsDictionary[indicatorType].unit,
        });
      }}
      bezier
    />
  );
}

const styles = StyleSheet.create({
  // Chart
  chart: {
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
