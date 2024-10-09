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

import store from "@/redux/store";
import { useSelector } from "react-redux";

import {
  selecter,
  WeatherDataList,
  Region,
  indicatorsDictionary,
} from "@/app/(tabs)";

interface IndicatorsDisplayWidgetProps_double {
  type1: string;
  type2: string;
}

export function IndicatorsDisplayWidget_double({
  type1,
  type2,
}: IndicatorsDisplayWidgetProps_double) {
  const region = useSelector((state: { region: Region[] }) => state.region);
  const weatherDataList = useSelector(
    (state: { weatherData: WeatherDataList }) => state.weatherData
  );
  const selecter = useSelector(
    (state: { selecter: selecter }) => state.selecter
  );
  const indicator1 =
    indicatorsDictionary[type1 as keyof typeof indicatorsDictionary];
  const indicator2 =
    indicatorsDictionary[type2 as keyof typeof indicatorsDictionary];

  if (Object.keys(weatherDataList).length === 0) {
    return (
      <TouchableOpacity style={{ flex: 1, width: "100%" }}>
        <Widget style={styles.customWidgetStyle}>
          <View style={styles.layout}>
            <View style={styles.titleDisplay}>
              <SvgImage style={styles.svgImage} name={type1} />
              <Text style={styles.title}>{indicator1.title}</Text>
            </View>
            <Text style={styles.value}>--</Text>
          </View>

          <View style={styles.layout}>
            <View style={styles.titleDisplay}>
              <SvgImage style={styles.svgImage} name={type2} />
              <Text style={styles.title}>{indicator2.title}</Text>
            </View>
            <Text style={styles.value}>--</Text>
          </View>
        </Widget>
      </TouchableOpacity>
    );
  }

  indicator1.value =
    weatherDataList?.[selecter.region]?.[0]?.[0]?.[type1] ?? ""; // region - timeInterval - index
  indicator2.value =
    weatherDataList?.[selecter.region]?.[0]?.[0]?.[type2] ?? "";

  return (
    <TouchableOpacity style={{ flex: 1, width: "100%" }}>
      <Widget style={styles.customWidgetStyle}>
        <View style={styles.layout}>
          <View style={styles.titleDisplay}>
            <SvgImage style={styles.svgImage} name={type1} />
            <Text style={styles.title}>{indicator1.title}</Text>
          </View>
          <Text style={styles.value}>{indicator1.value + indicator1.unit}</Text>
        </View>

        <View style={styles.layout}>
          <View style={styles.titleDisplay}>
            <SvgImage style={styles.svgImage} name={type2} />
            <Text style={styles.title}>{indicator2.title}</Text>
          </View>
          <Text style={styles.value}>{indicator2.value + indicator2.unit}</Text>
        </View>
      </Widget>
    </TouchableOpacity>
  );
}

// Default Style
const styles = StyleSheet.create({
  customWidgetStyle: {
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  layout: {
    minWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  titleDisplay: {
    minWidth: "60%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
  },
  title: {
    color: "white",
    fontSize: 18,
    textAlign: "left",
  },
  value: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
  },
  svgImage: {
    width: 30,
    height: 30,
  },
});
