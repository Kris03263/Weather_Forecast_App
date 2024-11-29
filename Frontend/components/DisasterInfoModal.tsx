import {
  View,
  Modal,
  Pressable,
  Animated,
  Text,
  StyleSheet,
  ScrollView,
  Share,
  Alert,
  Image,
  FlatList,
} from "react-native";
import { useRef, useEffect, useState } from "react";

import { SvgImage } from "@/components/Svg";
import { EarthquakeData, EarthquakeDataList } from "@/app/(tabs)/_layout";
import { disasterTypes } from "@/app/(tabs)/_layout";
import { SlideModal } from "@/components/SlideModal";
import { setRecentEarthquakeData } from "@/redux/earthquakeDataSlice";
interface DisasterInfoModalProps {
  disasterType: disasterTypes;
  isModalShow: boolean;
  earthquakeDataList: EarthquakeDataList;
  onClose: () => void;
}

export function DisasterInfoModal({
  disasterType,
  isModalShow,
  disasterType,
  earthquakeDataList,
  onClose,
}: DisasterInfoModalProps) {
  const pan = useRef(new Animated.ValueXY()).current; // Initial off-screen position
  const buttonRef = useRef<View>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [title, setTitle] = useState<string>("地震資訊");
  const [svgName, setSvgName] = useState<string>("earthquake");
  const [selectedDisasterIndex, setSelectedDisasterIndex] = useState<number>(0);

  console.log(earthquakeDataList);

  const shareContent = async () => {
    try {
      await Share.share(
        {
          title: "分享地震資訊",
          message: `${earthquakeDataList?.recent?.content}\n`,
          url: earthquakeDataList?.recent?.shakeImg || "",
        },
        {
          dialogTitle: "分享地震資訊",
        }
      );
    } catch (error: any) {
      Alert.alert("分享失敗", error.message || "發生未知错误");
    }
  };

  useEffect(() => {
    if (isModalShow) {
      Animated.timing(pan, {
        toValue: { x: 0, y: 0 },
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [isModalShow]);

  const getDisasterTitle = (disasterType: disasterTypes) => {
    switch (disasterType) {
      case disasterTypes.earthquake:
        setTitle("地震資訊");
        setSvgName("earthquake");
        break;
      case disasterTypes.typhoon:
        setTitle("颱風資訊");
        setSvgName("typhoon");
        break;
      default:
        return "未知災害";
    }
  };
  const getDisasterContent = (disasterType: disasterTypes) => {
    switch (disasterType) {
      case disasterTypes.earthquake:
        return (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>地震示意圖</Text>
              <Text style={styles.cardText}>
                <Image
                  source={{ uri: earthquakeDataList?.recent?.shakeImg ?? "" }}
                  style={{ width: "100%", height: 500 }}
                />
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>芮氏規模</Text>
              <Text style={styles.cardText}>
                {earthquakeDataList?.recent?.magnitude ?? "未知"}
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>震源深度</Text>
              <Text style={styles.cardText}>
                {earthquakeDataList?.recent?.depth ?? "未知"} km
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>發生時間</Text>
              <Text style={styles.cardText}>
                {earthquakeDataList?.recent?.time ?? "未知"}
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>與震源距離</Text>
              <Text style={styles.cardText}>
                {earthquakeDataList?.recent?.distance ?? "未知"} km
              </Text>
            </View>
          </>
        );
      case disasterTypes.typhoon:
        return "data";
      default:
        return "未知災害";
    }
  };
  const getcolor = () => {
    switch (earthquakeDataList?.history?.[selectedDisasterIndex]?.color) {
      case "綠色":
        return "green";
      case "黃色":
        return "yellow";
      case "紅色":
        return "red";
    }
  };
  const getDropDownContent = (disasterType: disasterTypes) => {
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
            <Text style={{ color: getcolor() }}>●</Text>
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
            style={[
              styles.dropdown,
              { top: position.top, left: position.left },
            ]}
          >
            <FlatList
              data={Object.values(disasterTypes)}
              renderItem={({ item, index }) => (
                <>
                  {index !== 0 && <View style={styles.separator} />}
                  <Pressable
                    style={styles.dropdownItem}
                    onPress={() => {
                      setIsDropdownVisible(false);
                    }}
                  >
                    <Text style={{ color: getcolor() }}>●</Text>
                    <Text style={styles.dropdownText}>
                      {earthquakeDataList?.history?.[index]?.content ?? "未知"}
                    </Text>
                  </Pressable>
                </>
              )}
            />
          </View>
        </Modal>
      </>
    );
  };

  return (
    <>
      <View>
        <SlideModal
          title={title}
          svgName={svgName}
          isVisible={isModalShow}
          onClose={() => onClose()}
        >
          <View style={styles.separator} />
          <View style={styles.row}>{getDropDownContent(disasterType)}</View>
          {getDisasterContent(disasterType)}

          {disasterType === disasterTypes.earthquake && (
            <Pressable style={styles.shareButton} onPress={shareContent}>
              <SvgImage name="share" style={styles.svgImage} />
              <Text style={styles.shareButtonText}>分享</Text>
            </Pressable>
          )}
        </SlideModal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalView: {
    width: "100%",
    height: "90%",
    backgroundColor: "#21262c",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  scrollViewContent: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
  },
  // Separator
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: "#9ca8b7",
  },

  // Header
  headerLayout: {
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
  },

  // Title
  titleLayout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
  },
  titleText: {
    color: "white",
    fontSize: 20,
    textAlign: "left",
  },
  // Close Button
  closeButtonText: {
    color: "#9ca8b7",
    fontWeight: "bold",
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#2f363e",
    borderRadius: 30,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },

  // Svg
  svgImage: {
    width: 20,
    height: 20,
  },
  // Card
  card: {
    width: "100%",
    backgroundColor: "#2c3136",
    borderRadius: 10,
    padding: 15,
    gap: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#9ca8b7",
  },
  cardText: {
    fontSize: 14,
    color: "#d1d5da",
  },

  row: {
    minWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#238636",
    padding: 12,
    borderRadius: 10,
    gap: 10,
  },
  shareButtonText: {
    color: "#fff",
    fontSize: 16,
  },
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
});
