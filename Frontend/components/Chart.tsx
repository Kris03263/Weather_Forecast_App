import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useSelector } from "react-redux";

import {
  WeatherDataList,
  Selecter,
  indicatorsDictionary,
  Region,
  indicators,
  WeatherData,
} from "@/app/(tabs)/_layout";

interface ChartProps {
  indicatorType: indicators;
  weatherDatas: WeatherData[];
  onSelectDataChange: (selectData: {
    time: string;
    value: number;
    maxValue: number;
    minValue: number;
    unit: string;
  }) => void;
}

export default function Chart({
  indicatorType,
  weatherDatas,
  onSelectDataChange,
}: ChartProps) {
  const [selectedValue, setselectedValue] = useState<number>(0);
  const [selectedTime, setselectedTime] = useState<string>("");

  const segmentSize = 9;
  const segments = Array.from(
    { length: Math.ceil(weatherDatas.length / segmentSize) },
    (_, index) =>
      weatherDatas.slice(index * segmentSize, (index + 1) * segmentSize)
  );
  const segment = segments[0] || [];

  const valueData: number[] = segment.map((item) =>
    parseInt(item[indicatorType])
  );
  const labels: string[] = segment.map((item) => {
    const hour = item.time.split(" ")[1].split(":")[0];
    return hour + "時";
  });

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: valueData,
        color: (opacity = 1) => `rgba(255, 200, 0, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };
  const chartConfig = {
    backgroundGradientFrom: "#0f172a",
    backgroundGradientTo: "#1f2937",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "3",
      strokeWidth: "1",
      stroke: "#ffcc00",
    },
    yAxisSuffix: indicatorsDictionary[indicatorType].unit,
    yAxisInterval: 1,
  };

  useEffect(() => {
    onSelectDataChange({
      time: selectedTime,
      value: selectedValue,
      maxValue: Math.max(...valueData),
      minValue: Math.min(...valueData),
      unit: indicatorsDictionary[indicatorType].unit,
    });
  }, [selectedTime, selectedValue, indicatorType]);

  useEffect(() => {
    setselectedValue(parseInt(indicatorsDictionary[indicatorType].value));
  }, [indicatorType]);

  return (
    <LineChart
      data={chartData}
      width={Dimensions.get("window").width - 40}
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
  );
}

const styles = StyleSheet.create({
  chart: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#9ca8b7",
  },
});
