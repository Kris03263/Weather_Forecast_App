import { useEffect, useState } from "react";
import { StyleSheet, View, Pressable, Text, Image } from "react-native";

import { EarthquakeData, getEarthquakeData } from "@/app/(tabs)/_layout";

import { Widget } from "@/components/Widget";
import { SvgImage } from "@/components/Svg";

interface EarthquakeDisplayWidgetProps {
  onPress: () => void;
}

export const EarthquakeDisplayWidget = ({
  onPress,
}: EarthquakeDisplayWidgetProps) => {
  const [earthquakeData, setEarthquakeData] = useState<EarthquakeData[]>();

  useEffect(() => {
    getEarthquakeData().then((data) => {
      setEarthquakeData(data);
      console.log(data[0].reportImg);
    });
  }, []);

  return (
    <Pressable style={{ flex: 1, width: "100%" }} onPress={() => onPress()}>
      <Widget style={styles.customWidgetStyle} isShow={true}>
        <View style={styles.layout}>
          <View style={styles.titleDisplay}>
            <SvgImage style={styles.svgImage} name="earthquake" />
            <Text style={styles.title}>地震資訊</Text>
          </View>
        </View>
      </Widget>
    </Pressable>
  );
};

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
