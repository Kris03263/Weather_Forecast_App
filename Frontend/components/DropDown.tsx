import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { SvgImage } from "@/components/Svg";

interface DropdownProps {
  onIndicatorChange: (indicator: string) => void;
  defaultIndicator?: string;
}

export function Dropdown({ onIndicatorChange }: DropdownProps) {
  // Data for the dropdown
  const [selected, setSelected] = useState<string>("");
  const [indicator, setIndicator] = useState<string>("");

  useEffect(() => {
    switch (selected) {
      case "1":
        setIndicator("temp");
        break;
      case "2":
        setIndicator("windSpeed");
        break;
      case "3":
        setIndicator("rainRate");
        break;
      case "4":
        setIndicator("wet");
        break;
      default:
        setIndicator("");
        break;
    }
  }, [selected]);

  useEffect(() => {
    onIndicatorChange(indicator);
  }, [indicator]);

  // Dropdown data with icons
  const data = [
    { key: "1", value: "天氣狀況", iconName: "weather" },
    { key: "2", value: "風速", iconName: "windSpeed" },
    { key: "3", value: "降水", iconName: "rainRate" },
    { key: "4", value: "濕度", iconName: "wet" },
  ];

  const formattedData = data.map((item) => ({
    key: item.key,
    value: (
      <View style={styles.dropdownItem}>
        <SvgImage
          style={{ width: 30, height: 30 }}
          name={item.iconName}
        ></SvgImage>
        <Text style={styles.dropdownText}>{item.value}</Text>
      </View>
    ),
    indicator: item.iconName,
  }));

  return (
    <View style={styles.container}>
      <SelectList
        setSelected={(val: string) => setSelected(val)}
        data={formattedData}
        placeholder="選擇天氣資訊"
        search={false}
        boxStyles={styles.dropdownBox}
        dropdownStyles={styles.dropdownStyles}
        dropdownTextStyles={styles.dropdownText}
        inputStyles={styles.inputStyles}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  dropdownBox: {
    backgroundColor: "#333",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  dropdownStyles: {
    backgroundColor: "#333",
    borderRadius: 20,
    marginTop: 5,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: "#fff",
  },
  dropdownRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    color: "#fff",
  },
  inputStyles: {
    color: "#fff",
    fontSize: 15,
  },
});
