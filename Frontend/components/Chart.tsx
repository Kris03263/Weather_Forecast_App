import React from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import Svg, {
  Path,
  Circle,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
  Rect,
} from "react-native-svg";
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
  const width = Dimensions.get("window").width - 40; // 圖表寬度
  const height = 200; // 圖表高度
  const maxHumidity = 100; // 濕度最大值
  const minHumidity = 0; // 濕度最小值

  const weatherDataList = useSelector(
    (state: { weatherData: WeatherDataList }) => state.weatherData
  );
  const selecter = useSelector(
    (state: { selecter: Selecter }) => state.selecter
  );

  const indicator =
    indicatorsDictionary[type as keyof typeof indicatorsDictionary];

  switch (type) {
    case "wet":
      const data = weatherDataList?.[selecter.region]?.[0] ?? [];

      // 將data用00:00~00:00分割
      const segments = [];
      for (let i = 0; i < data.length; i += 9) {
        segments.push(data.slice(i, i + 9));
      }

      // 目前只取第一段數據
      const segment = segments[0] || [];

      const wetData = segment.map((item) => parseInt(item.wet));
      const timeData = segment.map((item) => {
        const hour = item.time.split(" ")[1].split(":")[0];
        return hour + "時";
      });

      // 計算每個點的坐標
      const coordinates = wetData.map((wet, index) => {
        const x = (index / (wetData.length - 1)) * width;
        const y =
          height - ((wet - minHumidity) / (maxHumidity - minHumidity)) * height;
        return { x, y };
      });

      // 生成 Path Data
      let pathData = `M ${coordinates[0].x} ${coordinates[0].y}`;
      coordinates.slice(1).forEach((point) => {
        pathData += ` L ${point.x} ${point.y}`;
      });

      return (
        <View style={styles.container}>
          <Svg
            height={height + 40}
            width={width + 60}
            viewBox={`-10 0 ${width + 40} ${height + 40}`}
          >
            {/* 背景漸變 */}
            <Defs>
              <LinearGradient
                id="gradientBackground"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <Stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.9" />
                <Stop offset="100%" stopColor="#1e40af" stopOpacity="0.5" />
              </LinearGradient>
            </Defs>

            {/* 繪製矩形背景 */}
            <Rect
              x="0"
              y="0"
              width={width}
              height={height}
              fill="url(#gradientBackground)"
              rx="8"
              ry="8"
            />

            {/* 濕度折線 */}
            <Path d={pathData} stroke="#8b5cf6" strokeWidth="2" fill="none" />

            {/* 每個點上的標記 */}
            {coordinates.map((point, index) => (
              <Circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="3"
                fill="#8b5cf6"
              />
            ))}

            {/* Y 軸單位 */}
            {[0, 20, 40, 60, 80, 100].map((value, index) => (
              <SvgText
                key={index}
                x={width + 10}
                y={(height - (value / maxHumidity) * height).toString()}
                fontSize="10"
                fill="gray"
              >
                {value}%
              </SvgText>
            ))}

            {/* X 軸單位 */}
            {coordinates.map((point, index) => (
              <SvgText
                key={index}
                x={point.x}
                y={height + 15}
                fontSize="10"
                fill="gray"
                textAnchor="middle"
              >
                {timeData[index]}
              </SvgText>
            ))}
          </Svg>
        </View>
      );
    default:
      return (
        <View style={styles.container}>
          <Text style={styles.title}>{indicator.title}</Text>
          <Text style={styles.value}>
            {indicator.value}
            {indicator.unit}
          </Text>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 16,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
  },
  noDataText: {
    color: "#fff",
    fontSize: 16,
  },
  title: {
    color: "#fff",
    fontSize: 18,
  },
  value: {
    color: "#fff",
    fontSize: 16,
  },
});
