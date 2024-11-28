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
} from "react-native";
import React, { useRef, useEffect, useState } from "react";
import { SvgImage } from "@/components/Svg";
import { EarthquakeData } from "@/app/(tabs)/_layout";

interface DisasterInfoModalProps {
  isModalShow: boolean;
  earthquakeData: EarthquakeData;
  onClose: () => void;
}

export function DisasterInfoModal({
  isModalShow,
  earthquakeData,
  onClose,
}: DisasterInfoModalProps) {
  const pan = useRef(new Animated.ValueXY()).current; // Initial off-screen position

  const shareContent = async () => {
    try {
      await Share.share(
        {
          title: "分享地震資訊",
          message: `${earthquakeData?.content}\n`,
          url: earthquakeData.shakeImg || "",
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

  return (
    <>
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalShow}
          onRequestClose={() => onClose()}
        >
          <View style={styles.modalBackground}>
            <Animated.View
              style={[styles.modalView, { transform: [{ translateY: pan.y }] }]}
            >
              {/* Header */}
              <View style={styles.headerLayout}>
                <Pressable />

                <View style={styles.titleLayout}>
                  <SvgImage style={styles.svgImage} name="earthquake" />
                  <Text style={styles.titleText}>地震資訊</Text>
                </View>

                <Pressable style={styles.closeButton} onPress={() => onClose()}>
                  <SvgImage style={styles.svgImage} name="close" />
                </Pressable>
              </View>

              <ScrollView
                style={{ width: "100%" }}
                contentContainerStyle={styles.scrollViewContent}
              >
                <View style={styles.separator} />

                <View style={styles.card}>
                  <Text style={styles.cardTitle}>地震示意圖</Text>
                  <Text style={styles.cardText}>
                    <Image
                      source={{ uri: earthquakeData?.shakeImg ?? "" }}
                      style={{ width: "100%", height: 500 }}
                    />
                  </Text>
                </View>

                <View style={styles.card}>
                  <Text style={styles.cardTitle}>芮氏規模</Text>
                  <Text style={styles.cardText}>
                    {earthquakeData?.magnitude ?? "未知"}
                  </Text>
                </View>

                <View style={styles.card}>
                  <Text style={styles.cardTitle}>震源深度</Text>
                  <Text style={styles.cardText}>
                    {earthquakeData?.depth ?? "未知"} km
                  </Text>
                </View>

                <View style={styles.card}>
                  <Text style={styles.cardTitle}>發生時間</Text>
                  <Text style={styles.cardText}>
                    {earthquakeData?.time ?? "未知"}
                  </Text>
                </View>

                <View style={styles.card}>
                  <Text style={styles.cardTitle}>與震源距離</Text>
                  <Text style={styles.cardText}>
                    {earthquakeData?.distance ?? "未知"} km
                  </Text>
                </View>

                {/* Share Button */}
                <Pressable style={styles.shareButton} onPress={shareContent}>
                  <SvgImage name="share" style={styles.svgImage} />
                  <Text style={styles.shareButtonText}>分享</Text>
                </Pressable>
              </ScrollView>
            </Animated.View>
          </View>
        </Modal>
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
    marginTop: 20,
  },
  shareButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
});
