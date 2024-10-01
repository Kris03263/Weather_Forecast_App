import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

interface SvgProps {
  style?: object;
  src?: string;
}

export function Svg({ style = {}, src = "" }: SvgProps) {
  return (
    <View style={[style]}>
      <img src={src} />
    </View>
  );
}
