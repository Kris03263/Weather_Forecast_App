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
import { TyphoonData } from "@/app/(tabs)/_layout";
import { disasterTypes } from "@/app/(tabs)/_layout";
import { SlideModal } from "@/components/SlideModal";
import { Dropdown } from "@/components/DropDown";
interface DisasterInfoModalProps {
  disasterType: disasterTypes;
  isModalShow: boolean;
  earthquakeDataList?: EarthquakeDataList;
  typhoonData?: TyphoonData[];
  onClose: () => void;
}

export function DisasterInfoModal({
  disasterType,
  isModalShow,
  earthquakeDataList,
  typhoonData,
  onClose,
}: DisasterInfoModalProps) {
  const [title, setTitle] = useState<string>("地震資訊");
  const [svgName, setSvgName] = useState<string>("earthquake");
  const [selectedDisasterIndex, setSelectedDisasterIndex] = useState<number>(0);

  const shareContent = async () => {
    try {
      await Share.share(
        {
          title: "分享地震資訊",
          message: `${
            earthquakeDataList?.history?.[selectedDisasterIndex]?.content || ""
          }\n`,
          url:
            earthquakeDataList?.history?.[selectedDisasterIndex]?.shakeImg ||
            "",
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
    getDisasterTitle(disasterType);
  }, [disasterType]);

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
                  source={{
                    uri:
                      earthquakeDataList?.history?.[selectedDisasterIndex]
                        ?.shakeImg ?? "",
                  }}
                  style={{ width: "100%", height: 500 }}
                />
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>芮氏規模</Text>
              <Text style={styles.cardText}>
                {earthquakeDataList?.history?.[selectedDisasterIndex]
                  ?.magnitude ?? "未知"}
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>震源深度</Text>
              <Text style={styles.cardText}>
                {earthquakeDataList?.history?.[selectedDisasterIndex]?.depth ??
                  "未知"}{" "}
                km
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>發生時間</Text>
              <Text style={styles.cardText}>
                {earthquakeDataList?.history?.[selectedDisasterIndex]?.time ??
                  "未知"}
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>與震央距離</Text>
              <Text style={styles.cardText}>
                {earthquakeDataList?.history?.[selectedDisasterIndex]
                  ?.distance ?? "未知"}{" "}
                km
              </Text>
            </View>
          </>
        );
      case disasterTypes.typhoon:
        return (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>颱風名稱</Text>
              <Text style={styles.cardText}>
                {typhoonData?.[0]?.cname ?? "未知"}
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>國際名稱</Text>
              <Text style={styles.cardText}>
                {typhoonData?.[0]?.name ?? "未知"}
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>未來時間</Text>
              <Text style={styles.cardText}>
                {typhoonData?.[0]?.futurePosition?.[selectedDisasterIndex]
                  ?.futureTime ?? "未知"}
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>移動方向</Text>
              <Text style={styles.cardText}>
                {typhoonData?.[0]?.futurePosition?.[selectedDisasterIndex]
                  ?.movingDirection ?? "未知"}
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>最大陣風速</Text>
              <Text style={styles.cardText}>
                {typhoonData?.[0]?.futurePosition?.[selectedDisasterIndex]
                  ?.maxGustSpeed ?? "未知"}{" "}
                m/s
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>最大風速</Text>
              <Text style={styles.cardText}>
                {typhoonData?.[0]?.futurePosition?.[selectedDisasterIndex]
                  ?.maxWindSpeed ?? "未知"}{" "}
                m/s
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>颱風移動速度</Text>
              <Text style={styles.cardText}>
                {typhoonData?.[0]?.futurePosition?.[selectedDisasterIndex]
                  ?.movingSpeed ?? "未知"}{" "}
                m/s
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>氣壓</Text>
              <Text style={styles.cardText}>
                {typhoonData?.[0]?.futurePosition?.[selectedDisasterIndex]
                  ?.pressure ?? "未知"}{" "}
                hPa
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>颱風狀態</Text>
              <Text style={styles.cardText}>
                {typhoonData?.[0]?.futurePosition?.[selectedDisasterIndex]
                  ?.stateTransfers?.[0]?.value ?? "颱風沒有任何轉變"}
              </Text>
            </View>
          </>
        );
      default:
        return "未知災害";
    }
  };

  const earthquakeDataArray =
    earthquakeDataList?.history?.map((data) => {
      let svgName = "greenDot";
      switch (data.color) {
        case "yellow":
          svgName = "yellowDot";
          break;
        case "red":
          svgName = "redDot";
          break;
        case "green":
          svgName = "greenDot";
          break;
        default:
          svgName = "greenDot";
          break;
      }
      const timeString = `${new Date(data.time).getFullYear()}年${
        new Date(data.time).getMonth() + 1
      }月${new Date(data.time).getDate()}日 ${new Date(
        data.time
      ).getHours()}:${new Date(data.time).getMinutes()}:${new Date(
        data.time
      ).getSeconds()}`;
      //getmonth() is 0-11
      return {
        title: timeString,
        svgName: svgName,
      };
    }) || [];

  const typhoonDataArray =
    typhoonData?.[0]?.futurePosition?.map((data, index) => {
      const timeString = `${new Date(data?.futureTime).getFullYear()}年${
        new Date(data?.futureTime).getMonth() + 1
      }月${new Date(data?.futureTime).getDate()}日 ${new Date(
        data?.futureTime
      ).getHours()}:${new Date(data?.futureTime).getMinutes()}:${new Date(
        data?.futureTime
      ).getSeconds()}`;
      return {
        title: timeString,
        svgName: "typhoon",
      };
    }) || [];
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
          <Dropdown
            itemList={
              disasterType === disasterTypes.earthquake
                ? earthquakeDataArray
                : typhoonDataArray
            }
            onSelect={(index) => setSelectedDisasterIndex(index)}
            style={{ width: 220 }}
          ></Dropdown>
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
    flexGrow: 1,
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
