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
  selectedDatesIndex: number;
  onSelectDataChange: (selectData: {
    time: string;
    value: number;
    maxValue: number;
    minValue: number;
    unit: string;
  }) => void;
  onSegmentDatesChange: (segmentDates: string[]) => void;
}

export function Chart({
  indicatorType,
  weatherDatas,
  selectedDatesIndex,
  onSelectDataChange,
  onSegmentDatesChange,
}: ChartProps) {
  const [selectedValue, setselectedValue] = useState<number>(0);
  const [selectedTime, setselectedTime] = useState<string>("");
  const [segmentIndex, setSegmentIndex] = useState<number>(0);

  const segments: WeatherData[][] = [];
  let currentSegment: WeatherData[] = [];

  let now = new Date();

  let currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  for (let i = 0; i < weatherDatas.length; i++) {
    const data = weatherDatas[i];
    const dataTime = new Date(data.time);

    const nextDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 1
    );

    // 如果 dataTime 在 currentDate 和 nextDay 之間（包括 nextDay 的 00:00）
    if (dataTime >= currentDate && dataTime <= nextDay) {
      currentSegment.push(data);

      if (dataTime.getTime() === nextDay.getTime()) {
        // 碰到 00:00，將 currentSegment 儲存，同時在下一段開始時包括該數據點
        if (currentSegment.length > 0) {
          segments.push([...currentSegment]); // 儲存當前段
        }
        // 開始新段，包含同一個數據點
        currentSegment = [data];
        currentDate = nextDay;
        // nextDay 將在下一次循環中重新計算
      }
    } else {
      // dataTime 超過 nextDay，處理新的一天
      if (currentSegment.length > 0) {
        segments.push([...currentSegment]); // 儲存當前段
      }
      // 開始新段，包含該數據點
      currentSegment = [data];
      currentDate = new Date(
        dataTime.getFullYear(),
        dataTime.getMonth(),
        dataTime.getDate()
      );
      // nextDay 將在下一次循環中重新計算
    }
  }

  // 添加最後一天的資料(不到24:00)
  if (currentSegment.length > 0) {
    segments.push(currentSegment);
  }

  //console.log("Segments:", segments);

  // 選擇要畫的segment
  const segment = segments[segmentIndex] || [];

  // 如果segment沒有資料，顯示提示
  if (segment.length === 0) {
    return (
      <View>
        <Text style={{ color: "#fff", textAlign: "center", marginTop: 20 }}>
          目前無可用資料，請聯絡開發者
        </Text>
      </View>
    );
  }

  // chart data
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
    onSelectDataChange({
      time: selectedTime,
      value: parseInt(weatherDatas?.[0]?.[indicatorType]),
      maxValue: Math.max(...valueData),
      minValue: Math.min(...valueData),
      unit: indicatorsDictionary[indicatorType].unit,
    });
  }, [indicatorType]);

  useEffect(() => {
    const segmentDates = segments
      .map((segment, index) => {
        if (segment.length > 0) {
          const firstData = segment[0];
          const date = new Date(firstData.time);
          date.setHours(date.getHours() + 8); //GMT+8(台灣時間)
          const dateString = date.toISOString().split("T")[0];
          return dateString;
        }
        return null;
      })
      .filter((date) => date !== null);

    onSegmentDatesChange(segmentDates as string[]);
  }, [segments.length]);

  useEffect(() => {
    setSegmentIndex(selectedDatesIndex);
  }, [selectedDatesIndex]);

  useEffect(() => {
    onSelectDataChange({
      time: selectedTime,
      value: parseInt(weatherDatas?.[0]?.[indicatorType]),
      maxValue: Math.max(...valueData),
      minValue: Math.min(...valueData),
      unit: indicatorsDictionary[indicatorType].unit,
    });
  }, [segmentIndex]);

  return (
    <View>
      <LineChart
        data={chartData}
        width={Dimensions.get("window").width - 40}
        height={220}
        chartConfig={chartConfig}
        style={styles.chart}
        fromZero={true}
        onDataPointClick={({ value, index }) => {
          setselectedTime(segment[index].time);
          setselectedValue(value);
        }}
        bezier
      />
      {/* 分頁指示icon */}
      <View style={styles.pagination}>
        {segments.map((_, idx) => (
          <Text
            key={idx}
            style={[
              styles.pageDot,
              idx === segmentIndex && styles.activePageDot,
            ]}
          >
            ●
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#9ca8b7",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  pageDot: {
    fontSize: 20,
    color: "gray",
    marginHorizontal: 5,
  },
  activePageDot: {
    color: "#3a95ff",
  },
});
