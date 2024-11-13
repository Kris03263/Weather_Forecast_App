import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { Widget } from "@/components/Widget";
import { useState } from "react";
import { SlideModal } from "@/components/SlideModal";
import { WeatherDataList } from "@/app/(tabs)/_layout";
import { useSelector } from "react-redux";
import { SvgImage } from "@/components/Svg";

export function EarthQuakeDisplayWidget() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={{ flex: 1, width: "100%" }}
        onPress={() => setModalVisible(true)}
      >
        <Widget style={styles.customWidgetStyle} isShow={true}>
          <View style={styles.layout}>
            <View style={styles.titleDisplay}>
              <SvgImage style={{ width: 30, height: 30 }} name="weather" />
              <Text style={styles.title}>地震資訊</Text>
            </View>
            <Text style={styles.value}>--</Text>
          </View>
        </Widget>
      </TouchableOpacity>
      
      <SlideModal
        type="earthQuake"
        isModalShow={modalVisible}
        onClose={() => {
          setModalVisible(false);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  customWidgetStyle: {
    alignItems: "center",
    justifyContent: "center",
  },
  layout: {
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
