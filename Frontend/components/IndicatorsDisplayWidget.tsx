import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";

import { Widget } from "@/components/Widget";
import { SvgImage } from "@/components/Svg";

import {
  WeatherData,
  indicators,
  indicatorsDictionary,
} from "@/app/(tabs)/_layout";

interface IndicatorsDisplayWidgetProps {
  indicatorType: indicators;
  onPress: () => void;
  weatherData: WeatherData;
}

export function IndicatorsDisplayWidget({
  indicatorType,
  onPress,
  weatherData,
}: IndicatorsDisplayWidgetProps) {
  const indicator = indicatorsDictionary[indicatorType];

  indicator.value = weatherData?.[indicatorType] ?? "--";

  return (
    <Pressable style={{ flex: 1, width: "100%" }} onPress={() => onPress()}>
      <Widget style={styles.customWidgetStyle} isShow={true}>
        <View style={styles.layout}>
          <View style={styles.titleDisplay}>
            <SvgImage
              style={styles.svgImage}
              name={indicatorsDictionary[indicatorType].svgName}
            />
            <Text style={styles.title}>{indicator.title}</Text>
          </View>
          <Text style={styles.value}>{indicator.value + indicator.unit}</Text>
        </View>
      </Widget>
    </Pressable>
  );
}

// Default Style
const styles = StyleSheet.create({
  customWidgetStyle: {
    alignItems: "center",
    justifyContent: "center",
  },
  layout: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  titleDisplay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
  },
  title: {
    color: "white",
    fontSize: 20,
    textAlign: "left",
  },
  value: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "left",
  },
  svgImage: {
    width: 30,
    height: 30,
    color: "#9ca8b7",
  },
});
