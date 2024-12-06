import React from "react";
import { StyleSheet, View, Text } from "react-native";

import {
  disasterTypes,
  EarthquakeData,
  TyphoonData,
} from "@/app/(tabs)/_layout";

import { Widget } from "@/components/Widget";

interface EarthquakesDisplayWidgetProps {
  type: disasterTypes;
  earthquakeData?: EarthquakeData;
  typhoonData?: TyphoonData[];
  onPress: () => void;
}

export function EarthquakesDisplayWidget({
  type,
  earthquakeData,
  typhoonData,
  onPress,
}: EarthquakesDisplayWidgetProps) {
  switch (type) {
    case disasterTypes.earthquake:
      return (
        <Widget
          title={"最近地震資訊"}
          svgName={`${type}`}
          style={styles.customWidgetStyle}
          isVisible={true}
          isPressable={true}
          onPress={onPress}
        >
          <View style={styles.contentLayout}>
            <Text style={styles.contentText}>
              {earthquakeData?.content ?? ""}
            </Text>
            {/* <View style={styles.listLayout}>
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
        </View> */}
          </View>
        </Widget>
      );
    case disasterTypes.typhoon:
      return (
        <Widget
          title={"最近颱風資訊"}
          svgName={`${type}`}
          style={styles.customWidgetStyle}
          isVisible={true}
          isPressable={true}
          onPress={onPress}
        >
          <View style={styles.contentLayout}>
            <Text style={styles.contentText}>
              {typhoonData !== undefined
                ? `${typhoonData?.[0]?.cname ?? ""}在${
                    typhoonData?.[0]?.futurePosition?.[0]?.futureTime ?? ""
                  }有\n最大陣風速度${
                    typhoonData?.[0]?.futurePosition?.[0]?.maxGustSpeed ?? ""
                  }m/s\n最大持續風速${
                    typhoonData?.[0]?.futurePosition?.[0]?.maxWindSpeed ?? ""
                  }m/s\n中心氣壓${
                    typhoonData?.[0]?.futurePosition?.[0]?.pressure ?? ""
                  }百帕\n`
                : "目前無颱風資訊"}
            </Text>
          </View>
        </Widget>
      );
  }
}
const styles = StyleSheet.create({
  customWidgetStyle: {
    width: 310,
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
  contentLayout: {
    height: 260,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  contentText: {
    color: "white",
    fontSize: 16,
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
