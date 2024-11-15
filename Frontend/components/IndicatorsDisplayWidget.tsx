import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { useState } from "react";

import { Widget } from "@/components/Widget";
import { SvgImage } from "@/components/Svg";
import { SlideModal } from "@/components/SlideModal";

import { WeatherData, indicatorsDictionary } from "@/app/(tabs)/_layout";

interface IndicatorsDisplayWidgetProps {
  type: string;
  weatherData: WeatherData;
}

export function IndicatorsDisplayWidget({
  type,
  weatherData
}: IndicatorsDisplayWidgetProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const indicator =
    indicatorsDictionary[type as keyof typeof indicatorsDictionary];

  indicator.value = weatherData?.[type] ?? "--"; 
  return (
    <>
      <TouchableOpacity
        style={{ flex: 1, width: "100%" }}
        onPress={() => setModalVisible(true)}
      >
        <Widget style={styles.customWidgetStyle} isShow={true}>
          <View style={styles.layout}>
            <View style={styles.titleDisplay}>
              <SvgImage style={styles.svgImage} name={type} />
              <Text style={styles.title}>{indicator.title}</Text>
            </View>
            <Text style={styles.value}>{indicator.value + indicator.unit}</Text>
          </View>
        </Widget>
      </TouchableOpacity>
      <SlideModal
        isModalShow={modalVisible}
        onClose={() => {
          setModalVisible(false);
        }}
        type={type}
      />
    </>
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
