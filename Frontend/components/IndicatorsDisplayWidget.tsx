import React from "react";
import { StyleSheet, View, Text } from "react-native";

import { Widget } from "@/components/Widget";

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
      title={indicator.title}
      svgName={indicator.svgName}
      style={styles.customWidgetStyle}
      isVisible={true}
      isPressable={true}
      onPress={onPress}
    >
      <View style={styles.contentLayout}>
        <Text style={styles.valueText}>{indicator.value + indicator.unit}</Text>
      </View>
    </Widget>
  );
}

// Default Style
const styles = StyleSheet.create({
  customWidgetStyle: {},
  contentLayout: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  valueText: {
    color: "white",
    fontSize: 30,
    textAlign: "left",
  },
});
