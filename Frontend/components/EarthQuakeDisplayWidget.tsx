import { useEffect } from "react";
import { StyleSheet, View, Pressable, Text } from "react-native";

import { getEarthquake } from "@/app/(tabs)/_layout";

import { Widget } from "@/components/Widget";
import { SvgImage } from "@/components/Svg";

interface EarthQuakeDisplayWidgetProps {
  onPress: () => void;
}

export function EarthQuakeDisplayWidget({
  onPress,
}: EarthQuakeDisplayWidgetProps) {
  useEffect(() => {
    getEarthquake();
  }, []);

  return (
    <Pressable style={{ flex: 1, width: "100%" }} onPress={() => onPress()}>
      <Widget style={styles.customWidgetStyle} isShow={true}>
        <View style={styles.layout}>
          <View style={styles.titleDisplay}>
            <SvgImage style={{ width: 30, height: 30 }} name="earthquake" />
            <Text style={styles.title}>地震資訊</Text>
          </View>
          <Text style={styles.value}>--</Text>
        </View>
      </Widget>
    </Pressable>
  );
}

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
  },
});
