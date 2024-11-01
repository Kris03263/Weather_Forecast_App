import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { Widget } from "@/components/Widget";
import { useState } from "react";
import { SlideModal } from "@/components/SlideModal";
import { WeatherDataList } from "@/app/(tabs)/_layout";
import { useSelector } from "react-redux";
import { SvgImage } from "./Svg";

export function EarthQuakeDisplayWidget() {
  const [modalVisible, setModalVisible] = useState(false);

  const weatherDataList = useSelector(
    (state: { weatherData: WeatherDataList }) => state.weatherData
  );

  return (
    <TouchableOpacity
      style={{ flex: 1, width: "100%" }}
      onPress={() => setModalVisible(!modalVisible)}
    >
      <Widget style={styles.customWidgetStyle} isShow={!!weatherDataList}>
        <View style={styles.layout}>
          <View style={styles.titleDisplay}>
            <SvgImage style={{ width: 30, height: 30 }} name="weather" />
            <Text style={styles.title}>地震資訊</Text>
          </View>
          <Text style={styles.value}>--</Text>
        </View>
      </Widget>
      <SlideModal
        isModalShow={modalVisible}
        title={<Text>title</Text>}
        onClose={() => {
          setModalVisible(false);
        }}
        content={<Text style={styles.modalText}>地震資訊</Text>}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalView: {
    width: "100%",
    height: "90%", // 占满屏幕的 90%
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 2.5,
    alignSelf: "center",
    marginVertical: 10,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
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
