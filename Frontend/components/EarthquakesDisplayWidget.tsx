import { useEffect, useState } from "react";
import { StyleSheet, View, Pressable, Text, Image } from "react-native";

import { EarthquakeData } from "@/app/(tabs)/_layout";

import { Widget } from "@/components/Widget";
import { SvgImage } from "@/components/Svg";

interface EarthquakesDisplayWidgetProps {
  earthquakeData: EarthquakeData;
  onPress: () => void;
}

export function EarthquakesDisplayWidget({
  earthquakeData,
  onPress,
}: EarthquakesDisplayWidgetProps) {
  return (
    <Widget
      style={styles.customWidgetStyle}
      isVisible={true}
      isPressable={true}
      onPress={onPress}
    >
      <View style={styles.layout}>
        <View style={styles.titleLayout}>
          <SvgImage style={styles.svgImage} name="earthquake" />
          <Text style={styles.titleText}>最近地震資訊</Text>
        </View>
        <View style={styles.contentDisplay}>
          <Text style={styles.contentText}>
            {earthquakeData?.content ?? ""}
          </Text>
          <View style={styles.listLayout}>
            <Text style={styles.listTitleText}>時間:</Text>
            <Text style={styles.listContentText}>
              {earthquakeData?.time ?? "--"}
            </Text>
          </View>
          <View style={styles.listLayout}>
            <Text style={styles.listTitleText}>規模:</Text>
            <Text style={styles.listContentText}>
              {earthquakeData?.magnitude ?? "--"}
            </Text>
          </View>
          <View style={styles.listLayout}>
            <Text style={styles.listTitleText}>所在地區震度:</Text>
            <Text style={styles.listContentText}>
              {earthquakeData?.nowLocationIntensity ?? "--"}
            </Text>
          </View>
          <View style={styles.listLayout}>
            <Text style={styles.listTitleText}>深度:</Text>
            <Text style={styles.listContentText}>
              {earthquakeData?.depth ?? "--"}公里
            </Text>
          </View>
          <View style={styles.listLayout}>
            <Text style={styles.listTitleText}>距離:</Text>
            <Text style={styles.listContentText}>
              {earthquakeData?.distance ?? "--"}公里
            </Text>
          </View>
        </View>
      </View>
    </Widget>
  );
}

const styles = StyleSheet.create({
  customWidgetStyle: {
    alignItems: "center",
    justifyContent: "center",
  },
  layout: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  titleLayout: {
    width: "100%",
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
  contentDisplay: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    gap: 10,
  },
  contentText: {
    color: "white",
    fontSize: 18,
    textAlign: "left",
  },
  listLayout: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "100%",
  },
  listTitleText: {
    color: "white",
    fontSize: 16,
    textAlign: "left",
  },
  listContentText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
  },
  svgImage: {
    width: 30,
    height: 30,
  },
});
