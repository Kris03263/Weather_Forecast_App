import React, { useState } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useSelector } from "react-redux";
import {
  WeatherDataList,
  Selecter,
  indicatorsDictionary,
} from "@/app/(tabs)/_layout";
interface ChartProps {
  type: string;
}

export function Chart({ type }: ChartProps) {
  const screenWidth = Dimensions.get("window").width - 40;

  const [selectedValue, setselectedValue] = useState<number>(0);
  const [selectedTime, setselectedTime] = useState<string>("");

  const weatherDataList = useSelector(
    (state: { weatherData: WeatherDataList }) => state.weatherData
  );
  const selecter = useSelector(
    (state: { selecter: Selecter }) => state.selecter
  );

  const data = weatherDataList?.[selecter.region]?.[0] ?? [];
  console.log(data);

  const segments = [];
  for (let i = 0; i < data.length; i += 9) {
    segments.push(data.slice(i, i + 9));
  }

  const segment = segments[0] || [];

  const indicator =
    indicatorsDictionary[type as keyof typeof indicatorsDictionary];

  let valueData: number[] = [];
  let labels: string[] = [];

  switch (type) {
    case "wet":
      valueData = segment.map((item) => parseInt(item.wet));
      break;
    case "rainRate":
      valueData = segment.map((item) => parseInt(item.rainRate));
      break;
    case "windSpeed":
      valueData = segment.map((item) => parseInt(item.windSpeed));
      break;
    case "temp":
      valueData = segment.map((item) => parseInt(item.temp));
    default:
      break;
  }
  labels = segment.map((item) => {
    const hour = item.time.split(" ")[1].split(":")[0];
    return hour + "時";
  });

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: valueData,
        color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: "#1e3a8a",
    backgroundGradientTo: "#1e40af",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "3",
      strokeWidth: "1",
      stroke: "#8b5cf6",
    },
    yAxisSuffix: indicator.unit,
    yAxisInterval: 1,
  };

  return (
    <>
      <View>
        <Text style={styles.modalText}>
          {selectedTime} - {selectedValue}
          {indicator.unit}
        </Text>
      </View>
      <LineChart
        data={chartData}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        style={styles.chart}
        fromZero={true}
        onDataPointClick={({ value, index }) => {
          setselectedTime(labels[index]);
          setselectedValue(value);
        }}
        bezier
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    paddingVertical: 8,
  },
  chart: {
    borderRadius: 16,
  },
  modalText: {
    marginBottom: 15,
    color: "white",
    textAlign: "center",
  },
});

export default Chart;
