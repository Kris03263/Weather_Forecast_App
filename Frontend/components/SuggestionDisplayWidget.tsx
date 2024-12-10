// React Component and Package
import { StyleSheet, View, Text } from "react-native";
// Interfaces and Enums
import { DailySug } from "@/app/(tabs)/_layout";
// Components
import { Widget } from "@/components/Widget";

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
    <Widget
      title="建議"
      svgName={type}
      style={styles.customWidgetStyle}
      isVisible={true}
    >
      <View style={styles.contentLayout}>
        <Text style={styles.suggestionText}>
          {suggestion?.[0]?.suggestion ?? "無資料"}
        </Text>
      </View>
    </Widget>
  );
}

const styles = StyleSheet.create({
  customWidgetStyle: {},
  // Content
  contentLayout: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  suggestionText: {
    color: "white",
    fontSize: 16,
    textAlign: "left",
  },
});
