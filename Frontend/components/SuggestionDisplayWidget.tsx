import { StyleSheet, View, Text } from "react-native";
import { useSelector } from "react-redux";

import { Widget } from "@/components/Widget";
import { SvgImage } from "@/components/Svg";

import { DailySug, WeatherDataList } from "@/app/(tabs)/_layout";

interface SuggestionDisplayWidgetProps {
  type: string;
}

export function SuggestionDisplayWidget({
  type,
}: SuggestionDisplayWidgetProps) {
  const weatherDataList = useSelector(
    (state: { weatherData: WeatherDataList }) => state.weatherData
  );
  const dailySuggestions = useSelector(
    (state: { dailySug: DailySug }) => state.dailySug
  );

  const suggestion = dailySuggestions[type as keyof typeof dailySuggestions];

  return (
    <Widget style={styles.customWidgetStyle} isShow={!!weatherDataList}>
      <View style={styles.layout}>
        <SvgImage style={styles.svgImage} name={type} />
        <Text style={styles.text}>
          {suggestion?.[0]?.suggestion ?? "無資料"}
        </Text>
      </View>
    </Widget>
  );
}

// Default Style
const styles = StyleSheet.create({
  customWidgetStyle: {
    alignItems: "center",
  },
  layout: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  text: {
    color: "white",
    fontSize: 20,
    textAlign: "left",
  },
  svgImage: {
    width: 30,
    height: 30,
  },
});
