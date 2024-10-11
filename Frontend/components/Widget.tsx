import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

interface WidgetProps {
  children?: ReactNode;
  style?: object;
}

export function Widget({ children = null, style = {} }: WidgetProps) {
  return <View style={[styles.emptyWidget, style]}>{children}</View>;
}

// Default Style
const styles = StyleSheet.create({
  emptyWidget: {
    flex: 1,
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: "5%",
    backgroundColor: "#FFFFFF0A",
    borderRadius: 15,
    padding: 10,
    gap: 10,
  },
});
