import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import ModalDropdown from "react-native-modal-dropdown";

const WeatherDropdown = () => {
  // Data for the dropdown
  const options = [
    "天氣狀況",
    "紫外線指數",
    "風",
    "降水",
    "體感溫度",
    "濕度",
    "能見度",
    "氣壓",
  ];
  return (
    <View style={styles.container}>
      <ModalDropdown
        options={options}
        renderRow={(option, index) => (
          <View style={styles.dropdownRow}>
            <Text style={styles.label}>{label}</Text>
          </View>
        )}
        dropdownStyle={styles.dropdownStyle}
        renderButtonText={() => "選擇天氣資訊"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  },
  dropdownText: {
    fontSize: 16,
    padding: 10,
    color: "#fff",
  },
  dropdownStyle: {
    width: 150,
    backgroundColor: "#333", // Set background color
  },
  dropdownRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    color: "#fff",
  },
});

export default WeatherDropdown;
