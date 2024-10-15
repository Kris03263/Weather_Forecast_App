import { StyleSheet, View, Text } from "react-native";
import { useSelector } from "react-redux";

import { Widget } from "@/components/Widget";
import { SvgImage } from "@/components/Svg";

import { Selecter } from "@/app/(tabs)/_layout";

interface SuggestionDisplayWidgetProps {
  type: string;
}

export function SuggestionDisplayWidget({
  type,
}: SuggestionDisplayWidgetProps) {
  const testData = {
    dressing: [
      {
        name: "衣著",
        suggestion: "(根據當天天氣推薦適合的衣著)",
      },
    ],
    health: [
      {
        name: "健康",
        suggestion: "(根據當天天氣提出健康建議)",
      },
    ],
    transportation: [
      {
        name: "出行",
        suggestion: "(根據當天天氣推薦適合的交通方案)",
      },
    ],
    sport: [
      {
        name: "籃球",
        suggestion: "(根據當天天氣判定是否適合該運動)",
      },
      {
        name: "羽球",
        suggestion: "(根據當天天氣判定是否適合該運動)",
      },
    ],
    activity: [
      {
        name: "出遊",
        suggestion: "(根據當天天氣判定是否適合該活動)",
      },
    ],
  };
  const selecter = useSelector(
    (state: { selecter: Selecter }) => state.selecter
  );

  if (Object.keys(testData).length === 0) {
    return (
      <Widget style={styles.customWidgetStyle}>
        <View style={styles.layout}>
          <SvgImage style={styles.svgImage} name={type} />
          <Text style={styles.text}>暫無資料</Text>
        </View>
      </Widget>
    );
  }

  const suggestion = testData[type as keyof typeof testData];

  return (
    <Widget style={styles.customWidgetStyle}>
      <View style={styles.layout}>
        <SvgImage style={styles.svgImage} name={type} />
        <Text style={styles.text}>{suggestion[0].suggestion}</Text>
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
