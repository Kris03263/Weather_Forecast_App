import { StyleSheet, View, Text } from "react-native";

import { Widget } from "@/components/Widget";
import { SvgImage } from "@/components/Svg";

import { DailySug } from "@/app/(tabs)/_layout";

interface SuggestionDisplayWidgetProps {
  dailySug: DailySug;
  type: string;
}

export function SuggestionDisplayWidget({
  dailySug,
  type,
}: SuggestionDisplayWidgetProps) {
  const suggestion = dailySug?.[type as keyof typeof dailySug] ?? null;

  return (
    <Widget style={styles.customWidgetStyle} isVisible={true}>
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
    fontSize: 16,
    textAlign: "left",
  },
  svgImage: {
    width: 30,
    height: 30,
  },
});
