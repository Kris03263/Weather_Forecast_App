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
  const pan = useRef(new Animated.Value(300)).current; // Initial off-screen position
  const backgroundOpacity = useRef(new Animated.Value(0)).current; // Background opacity

  useEffect(() => {
    if (isModalShow) {
      // Open animation
      Animated.parallel([
        Animated.timing(pan, {
          toValue: 0, // Slide to screen
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(backgroundOpacity, {
          toValue: 1, // Full opacity
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      // Close animation
      Animated.parallel([
        Animated.timing(pan, {
          toValue: 300, // Slide off screen
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(backgroundOpacity, {
          toValue: 0, // Transparent background
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start(() => {
        pan.setValue(300); // Reset position for next use
      });
    }
  }, [isModalShow]);

  const shareContent = async () => {
    try {
      await Share.share({
        title: "地震資訊",
        message: `查看地震信息：${earthquakeData.shakeImg || "暫無圖片"}`,
        url: earthquakeData.shakeImg || "",
      });
    } catch (error: any) {
      Alert.alert("分享失敗", error.message || "發生未知错误");
    }
  };

  const handleClose = () => {
    isModalShow = false;
    onClose();
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isModalShow}
      onRequestClose={() => handleClose()}
    >
      {/* Background overlay */}
      <Animated.View
        style={[
          styles.modalOverlay,
          {
            opacity: backgroundOpacity, // Opacity tied to background animation
          },
        ]}
      />

      {/* Modal container */}
      <Animated.View
        style={[
          styles.modalContainer,
          {
            transform: [{ translateY: pan }], // Slide animation
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>地震資訊</Text>
          <Pressable
            style={styles.closeButton}
            onPress={() => {
              handleClose();
            }}
          >
            <SvgImage name="close" style={styles.icon} />
          </Pressable>
        </View>

        {/* Separator */}
        <View style={styles.separator} />

        {/* Body */}
        <ScrollView
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
        >
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
            <Text style={styles.cardTitle}>震级</Text>
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

          {/* Share Button */}
          <Pressable style={styles.shareButton} onPress={shareContent}>
            <SvgImage name="share" style={styles.icon} />
            <Text style={styles.shareButtonText}>分享</Text>
          </Pressable>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#21262c",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 5,
    maxHeight: "90%",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "#2c2f33",
    borderRadius: 20,
    padding: 10,
  },
  icon: {
    width: 20,
    height: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  separator: {
    height: 1,
    backgroundColor: "#444",
    marginVertical: 10,
  },
  body: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#2c3136",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#9ca8b7",
  },
  cardText: {
    fontSize: 14,
    color: "#d1d5da",
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
