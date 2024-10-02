import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
} from "react-native";

import { Widget } from "@/components/Widget";
import { SvgImage } from "@/components/Svg";

interface SuggestionDisplayWidgetProps {
  type: string;
}

export function SuggestionDisplayWidget({
  type,
}: SuggestionDisplayWidgetProps) {
  return (
    <Widget style={styles.customWidgetStyle}>
      <View style={styles.layout}>
        <SvgImage style={{ width: 30, height: 30 }} name={type} />
        <Text style={styles.text}>
          Today is hot, in order not to fainted out, we suggest you to dress
          less.
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
});
