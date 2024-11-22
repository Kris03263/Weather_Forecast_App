import {
  View,
  Modal,
  Pressable,
  Animated,
  PanResponder,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Share,
  Alert,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
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
  const pan = useRef(new Animated.ValueXY()).current;

  useEffect(() => {
    if (isModalShow) {
      Animated.timing(pan, {
        toValue: { x: 0, y: 0 },
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [isModalShow]);

  const shareContent = async () => {
    try {
      const result = await Share.share({
        title: "hello", //android
        message: "share",
        url: `${earthquakeData.shakeImg}`, //ios or windows
      });
    } catch (error: any) {
      console.error("分享失敗:", error);
      Alert.alert("分享失敗", error.message || "發生未知錯誤");
    }
  };

  return (
    <View style={styles.modalBackground}>
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
                <Text style={styles.titleText}>地震</Text>
              </View>

              <Pressable style={styles.closeButton} onPress={() => onClose()}>
                <SvgImage style={styles.svgImage} name="close" />
              </Pressable>
            </View>
            <View style={styles.separator} />
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <View style={styles.row}>
                <Pressable
                  onPress={() => {
                    shareContent();
                  }}
                >
                  <View style={styles.modalButton}>
                    <SvgImage style={styles.svgImage} name="share" />
                  </View>
                </Pressable>
              </View>
              <Text>當日小結</Text>
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    height: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  modalHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalContent: {
    padding: 10,
  },
  modalContentText: {
    fontSize: 16,
  },
  svgImage: {
    width: 20,
    height: 20,
  },
  modalButton: {
    backgroundColor: "#2196F3",
    borderRadius: 10,
    justifyContent: "center",
    padding: 10,
  },

  // Header
  headerLayout: {
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
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

  scrollViewContent: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
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

  // Separator
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: "#9ca8b7",
    marginVertical: 10,
  },

  row: {
    minWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
