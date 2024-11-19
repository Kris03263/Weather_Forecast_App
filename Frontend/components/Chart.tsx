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

  let isFirstDay = true;

  // 取得當前時間
  let now = new Date();

  // 將currentDate設為當天的 00:00
  let currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let endOfDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
    23,
    59,
    59,
    999
  );

  for (let i = 0; i < weatherDatas.length; i++) {
    const data = weatherDatas[i];
    const dataTime = new Date(data.time);

    if (isFirstDay) {
      // 如果資料的日期是今天，且時間在現在之後，且在今天的23:59:59之前
      if (
        dataTime.getDate() === now.getDate() &&
        dataTime.getMonth() === now.getMonth() &&
        dataTime.getFullYear() === now.getFullYear() &&
        dataTime.getTime() >= now.getTime() &&
        dataTime.getTime() <= endOfDay.getTime()
      ) {
        currentSegment.push(data);
      }
      //開始下一天
      else if (dataTime.getTime() > endOfDay.getTime()) {
        if (currentSegment.length > 0) {
          segments.push(currentSegment);
        }
        currentSegment = [data];
        currentDate = new Date(
          dataTime.getFullYear(),
          dataTime.getMonth(),
          dataTime.getDate()
        );
        endOfDay = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          23,
          59,
          59,
          999
        );
        isFirstDay = false;
      }
    }
    // 其他天(除了第一天)
    else {
      if (dataTime.getTime() <= endOfDay.getTime()) {
        currentSegment.push(data);
      } else {
        if (currentSegment.length > 0) {
          segments.push(currentSegment);
        }
        currentSegment = [data];
        currentDate = new Date(
          dataTime.getFullYear(),
          dataTime.getMonth(),
          dataTime.getDate()
        );
        endOfDay = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          23,
          59,
          59,
          999
        );
      }
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
    const segmentDates = segments
      .map((segment, index) => {
        if (segment.length > 0) {
          const firstData = segment[0];
          const date = new Date(firstData.time);
          date.setDate(date.getDate() + 1);
          const dateString = date.toISOString().split("T")[0];

          console.log(`Segment ${index} first date: ${dateString}`);
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
