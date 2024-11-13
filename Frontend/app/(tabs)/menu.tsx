import React, { ReactNode, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

import {
  WeatherDataList,
  RegionList,
  Region,
  userAddRegion,
  getAllRegionList,
  userRemoveRegion,
} from "./_layout";

import { Background } from "@/components/Background";
import { SvgImage } from "@/components/Svg";
import CustomModal from "@/components/PopupModal";
import store from "@/redux/store";
import { setSelectedTargetRegionIndex } from "@/redux/selecterSlice";

export default function MenuScreen() {
  const navigation = useNavigation();

  // Popup menu control
  const [selectedMenu, setSelectedMenu] = useState("-1");

  // Modal control
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalHeader, setModalHeader] = useState("");
  const [modalContent, setModalContent] = useState<ReactNode>();
  const [modalFooter, setModalFooter] = useState<ReactNode>();

  // Temp data
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [allRegionList, setAllRegionList] = useState<RegionList>({ city: {} });

  useEffect(() => {
    getAllRegionList().then((data) => {
      setAllRegionList(data);
    });
  }, []);

  const regions = useSelector((state: { regions: Region[] }) => state.regions);
  const weatherDataList = useSelector(
    (state: { weatherData: WeatherDataList }) => state.weatherData
  );

  const handleCitySelect = (e: any) => {
    setSelectedCity(e.target.value);
    setSelectedDistrict("");
  };

  const handleDistrictSelect = (e: any) => {
    setSelectedDistrict(e.target.value);
  };

  enum ModalType {
    SELECT = "選擇城市",
  }

  const openModal = (modalType: ModalType) => {
    setModalHeader(modalType);
    setModalContent(getModalContent(modalType));
    setModalFooter(getModalFooter(modalType));
    setModalVisible(true);
  };

  useEffect(() => {
    if (isModalVisible) {
      openModal(ModalType.SELECT);
    }
  }, [selectedCity, selectedDistrict]);

  const getModalContent = (modalType: ModalType) => {
    switch (modalType) {
      case ModalType.SELECT:
        return (
          <>
            <Text style={styles.modalInputLabel}>縣市名稱: </Text>
            <select
              required
              value={selectedCity}
              onChange={handleCitySelect}
              style={StyleSheet.flatten([styles.modalInput, { width: "100%" }])}
            >
              <option key={null} value={""} />
              {Object.keys(allRegionList.city).map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <Text style={styles.modalInputLabel}>市區名稱: </Text>
            <select
              required
              value={selectedDistrict}
              onChange={handleDistrictSelect}
              style={StyleSheet.flatten([styles.modalInput, { width: "100%" }])}
            >
              <option key={null} value={""} />
              {selectedCity &&
                allRegionList.city[selectedCity].map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
            </select>
          </>
        );
    }
  };
  const getModalFooter = (modalType: ModalType) => {
    switch (modalType) {
      case ModalType.SELECT:
        return (
          <>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                userAddRegion(selectedCity, selectedDistrict);
                setModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>確認</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>關閉</Text>
            </TouchableOpacity>
          </>
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* Background */}
      <View
        style={{
          backgroundColor: "#191919",
          height: "100%",
          width: "100%",
          position: "absolute",
          zIndex: -1,
        }}
      />

      {/* Header */}
      <View style={styles.topSection}>
        <View style={styles.headerLayout}>
          <Text style={styles.headerText}>地區</Text>

          <TouchableOpacity
            onPress={async () => {
              openModal(ModalType.SELECT);
            }}
          >
            <SvgImage
              style={{
                width: 30,
                height: 30,
              }}
              name="plus"
            ></SvgImage>
          </TouchableOpacity>
        </View>
      </View>

      {/* Body */}
      {weatherDataList && (
        <ScrollView style={styles.bodySection}>
          <FlatList
            data={regions}
            renderItem={({ item, index }) => {
              const weatherData = weatherDataList[item.name]?.[0]?.[0] ?? null;

              return (
                <TouchableOpacity
                  onPress={() => {
                    console.log(
                      "Selected region: ",
                      index,
                      "Target region: ",
                      store.getState().selecter.targetRegionIndex
                    );

                    navigation.navigate("index" as never);
                    store.dispatch(setSelectedTargetRegionIndex(index));
                  }}
                  onLongPress={() =>
                    setSelectedMenu(item.id !== "0" ? item.id : "-1")
                  }
                >
                  <View style={styles.regionCard}>
                    <Background
                      weatherData={weatherData}
                      style={{ borderRadius: 12 }}
                    />

                    <View style={styles.regionCardDisplay}>
                      <View style={{ flexDirection: "column" }}>
                        <Text style={styles.regionCardTitleText}>
                          {item.name}
                        </Text>
                        <Text style={styles.regionCardSubText}>
                          {item.id === "0" ? "當前地區" : ""}
                        </Text>
                      </View>
                      <Text style={styles.regionCardTemperatureText}>
                        {(weatherData?.temp ?? "--") + "°C"}
                      </Text>
                    </View>

                    <View style={styles.regionCardDisplay}>
                      <Text style={styles.regionCardText}>
                        {weatherData?.weatherText ?? "--"}
                      </Text>
                      <Text style={styles.regionCardText}>{`體感溫度: ${
                        weatherData?.bodyTemp ?? "--"
                      }`}</Text>
                    </View>
                  </View>

                  <Menu
                    opened={selectedMenu === item.id}
                    onBackdropPress={() => setSelectedMenu("-1")}
                  >
                    <MenuTrigger />
                    <MenuOptions>
                      <MenuOption onSelect={() => userRemoveRegion(index)}>
                        <Text style={{ fontSize: 16, color: "red" }}>刪除</Text>
                      </MenuOption>
                    </MenuOptions>
                  </Menu>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item.name}
          />
        </ScrollView>
      )}

      <CustomModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        header={modalHeader}
        content={modalContent}
        footer={modalFooter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: "3%",
    marginTop: "10%",
  },
  headerText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  headerLayout: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    width: "100%",
  },
  bodySection: {
    backgroundColor: "#FFFFFF01",
    padding: "3%",
    paddingBottom: 80,
  },

  // Region Card
  regionCard: {
    margin: 5,
    padding: 10,
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 10,
  },
  regionCardDisplay: { flexDirection: "row", justifyContent: "space-between" },
  regionCardTitleText: { color: "white", fontSize: 20, fontWeight: "bold" },
  regionCardSubText: { color: "#D3D3D3", fontSize: 12 },
  regionCardTemperatureText: { color: "white", fontSize: 36 },
  regionCardText: { color: "white", fontSize: 12 },

  // Modal
  modalButton: {
    backgroundColor: "#2196F3",
    borderRadius: 10,
    alignItems: "center",
    padding: 10,
  },
  modalInputLayout: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalInputLabel: {
    fontSize: 16,
    color: "black",
  },
  modalInputSvg: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  modalInput: {
    padding: 5,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
  },
  modalButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
