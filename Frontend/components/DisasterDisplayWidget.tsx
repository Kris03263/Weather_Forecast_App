// React Component and Package
import { StyleSheet, View, Text } from "react-native";
// Interfaces and Enums
import { disasterTypes, EarthquakeData } from "@/app/(tabs)/_layout";
// Components
import { Widget } from "@/components/Widget";

interface EarthquakesDisplayWidgetProps {
  type: disasterTypes;
  earthquakeData: EarthquakeData;
  onPress: () => void;
}

export function EarthquakesDisplayWidget({
  type,
  earthquakeData,
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
              {earthquakeData?.content ?? ""}
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
  // Content
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
});
