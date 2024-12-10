// React Component and Package
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
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
import { Picker } from "@react-native-picker/picker";
// Interfaces and Enums
import {
  WeatherDataList,
  RegionList,
  Region,
  userAddRegion,
  getAllRegionList,
  userRemoveRegion,
} from "./_layout";
// Components
import { Background } from "@/components/Background";
import { SvgImage } from "@/components/Svg";
import { PopupModal } from "@/components/PopupModal";
// Redux
import store from "@/redux/store";
import { setSelectedTargetRegionIndex } from "@/redux/selecterSlice";

export default function MenuScreen() {
  const navigation = useNavigation();

  // Popup menu control
  const [selectedMenu, setSelectedMenu] = useState("-1");

  // Modal control
  const [isModalVisible, setModalVisible] = useState(false);

  // Temp data
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [allRegionList, setAllRegionList] = useState<RegionList>({ city: {} });

  // Data from Redux
  const regions = useSelector((state: { regions: Region[] }) => state.regions);
  const weatherDataList = useSelector(
    (state: { weatherData: WeatherDataList }) => state.weatherData
  );

  useEffect(() => {
    getAllRegionList().then((data) => {
      setAllRegionList(data);
    });
  }, []);

  const handleCitySelect = (value: string) => {
    setSelectedCity(value);
    setSelectedDistrict("");
  };

  const handleDistrictSelect = (value: string) => {
    setSelectedDistrict(value);
  };

  // Modal Control
  enum ModalType {
    SELECT = "選擇城市",
  }

  const openModal = (modalType: ModalType) => {
    setModalVisible(true);
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

          <Pressable
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
          </Pressable>
        </View>
      </View>

      {/* Body */}
      {weatherDataList && (
        <ScrollView style={styles.bodySection}>
          <FlatList
            data={regions}
            renderItem={({ item, index }) => {
              const weatherData = weatherDataList[item.id]?.[0]?.[0] ?? null;

              return (
                <Pressable
                  onPress={() => {
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
                          {`${item.city}, ${item.district}`}
                        </Text>
                        <Text style={styles.regionCardSubText}>
                          {index === 0 ? "當前地區" : ""}
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
                </Pressable>
              );
            }}
            keyExtractor={(item) => item.id}
          />
        </ScrollView>
      )}

      <PopupModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        header={ModalType.SELECT}
      >
        <Text style={styles.modalInputLabel}>縣市名稱: </Text>
        <Picker
          selectedValue={selectedCity}
          onValueChange={handleCitySelect}
          style={StyleSheet.flatten([styles.modalInput, { width: "100%" }])}
        >
          <Picker.Item label="" value="" />
          {Object.keys(allRegionList.city).map((city, index) => (
            <Picker.Item key={index} label={city} value={city} />
          ))}
        </Picker>

        <Text style={styles.modalInputLabel}>市區名稱: </Text>
        <Picker
          selectedValue={selectedDistrict}
          onValueChange={handleDistrictSelect}
          style={StyleSheet.flatten([styles.modalInput, { width: "100%" }])}
        >
          <Picker.Item label="" value="" />
          {allRegionList.city[selectedCity]?.map((district, index) => (
            <Picker.Item key={index} label={district} value={district} />
          ))}
        </Picker>

        <Pressable
          style={styles.modalButton}
          onPress={() => {
            userAddRegion(selectedCity, selectedDistrict);
            setModalVisible(false);
          }}
        >
          <Text style={styles.modalButtonText}>確認</Text>
        </Pressable>

        <Pressable
          style={styles.modalButton}
          onPress={() => setModalVisible(false)}
        >
          <Text style={styles.modalButtonText}>關閉</Text>
        </Pressable>
      </PopupModal>
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
