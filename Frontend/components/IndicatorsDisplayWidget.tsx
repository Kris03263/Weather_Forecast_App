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
  weatherData: WeatherData;
  indicatorType: indicators;
  onPress: () => void;
}

export function IndicatorsDisplayWidget({
  weatherData,
  indicatorType,
  onPress,
}: IndicatorsDisplayWidgetProps) {
  const indicator = indicatorsDictionary[indicatorType];

  indicator.value = weatherData?.[indicatorType] ?? "--";

  return (
    <Widget
      style={styles.customWidgetStyle}
      isVisible={true}
      isPressable={true}
      onPress={onPress}
    >
      <View style={styles.layout}>
        <View style={styles.titleDisplay}>
          <SvgImage
            style={styles.svgImage}
            name={indicatorsDictionary[indicatorType].svgName}
          />
          <Text style={styles.titleText}>{indicator.title}</Text>
        </View>
        <Text style={styles.valueText}>{indicator.value + indicator.unit}</Text>
      </View>
    </Widget>
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
  titleText: {
    color: "white",
    fontSize: 20,
    textAlign: "left",
  },
  valueText: {
    color: "white",
    fontSize: 30,
    // fontWeight: "bold",
    textAlign: "left",
  },
  svgImage: {
    width: 30,
    height: 30,
    color: "#9ca8b7",
  },
});
