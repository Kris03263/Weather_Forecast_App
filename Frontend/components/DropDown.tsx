import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, Modal } from "react-native";
import { FlatList } from "react-native-gesture-handler";

import { indicators, indicatorsDictionary } from "@/app/(tabs)/_layout";

import { SvgImage } from "@/components/Svg";

interface DropdownProps {
  indicatorType: indicators;
  onIndicatorChange: (indicator: indicators) => void;
}

export function Dropdown({ indicatorType, onIndicatorChange }: DropdownProps) {
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<View>(null);
  const ignoreList = [indicators.windDirection];

  return (
    <>
      <View style={styles.dropdownLayout}>
        <Pressable
          ref={buttonRef}
          style={styles.dropdownBox}
          onPress={() => {
            buttonRef.current?.measure((fx, fy, width, height, px, py) => {
              const popupWidth = styles.dropdown.width;
              setPosition({
                top: py + height + styles.dropdown.padding + 10,
                left: px - popupWidth + width + styles.dropdown.padding,
              });
              setIsDropdownVisible(true);
            });
          }}
        >
          <SvgImage
            style={styles.svgImage}
            name={indicatorsDictionary[indicatorType].svgName}
          />
          <SvgImage style={styles.svgImage} name="down" />
        </Pressable>
      </View>

      <Modal
        transparent={true}
        visible={isDropdownVisible}
        animationType="fade"
      >
        <View style={styles.modalBackground}></View>
        <View
          style={[styles.dropdown, { top: position.top, left: position.left }]}
        >
          <FlatList
            data={Object.values(indicators)}
            renderItem={({ item, index }) => (
              <>
                {!ignoreList.includes(item) && index !== 0 && (
                  <View style={styles.separator} />
                )}
                {!ignoreList.includes(item) && (
                  <Pressable
                    style={styles.dropdownItem}
                    onPress={() => {
                      onIndicatorChange(item);
                      setIsDropdownVisible(false);
                    }}
                  >
                    <SvgImage
                      style={styles.svgImage}
                      name={indicatorsDictionary[item].svgName}
                    ></SvgImage>
                    <Text style={styles.dropdownText}>
                      {indicatorsDictionary[item].title}
                    </Text>
                  </Pressable>
                )}
              </>
            )}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  // Dropdown
  dropdownLayout: {
    height: 40,
    backgroundColor: "#333",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
  },
  dropdownBox: {
    gap: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  dropdownItem: {
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: {
    fontSize: 16,
    color: "#fff",
  },
  dropdown: {
    width: 200,
    position: "absolute",
    padding: 10,
    backgroundColor: "#333",
    borderWidth: 1,
    borderColor: "#9ca8b7",
    borderRadius: 15,
  },

  // Separator
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: "#9ca8b7",
    marginVertical: 10,
  },

  // Svg
  svgImage: {
    width: 20,
    height: 20,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
