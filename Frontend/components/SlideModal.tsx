import { ReactNode, useEffect, useRef } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
} from "react-native";

import { SvgImage } from "@/components/Svg";
import { ScrollView } from "react-native-gesture-handler";

interface SlideModalProps {
  title?: string;
  svgName?: string;
  children?: ReactNode;
  style?: object;
  isVisible?: boolean;
  onClose?: () => void;
}

export function SlideModal({
  title = "",
  svgName = "",
  children = null,
  style = {},
  isVisible = false,
  onClose = () => {},
}: SlideModalProps) {
  const pan = useRef(new Animated.ValueXY()).current; // Initial off-screen position

  useEffect(() => {
    if (isVisible) {
      Animated.timing(pan, {
        toValue: { x: 0, y: 0 },
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [isVisible]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => onClose()}
    >
      <View style={styles.modalBackground}>
        <Animated.View
          style={[
            styles.modalView,
            style,
            { transform: [{ translateY: pan.y }] },
          ]}
        >
          {/* Header */}
          <View style={styles.headerLayout}>
            <Pressable />

            <View style={styles.titleLayout}>
              <SvgImage style={styles.svgImage} name={svgName} />
              <Text style={styles.titleText}>{title}</Text>
            </View>

            <Pressable style={styles.closeButton} onPress={() => onClose()}>
              <SvgImage style={styles.svgImage} name="close" />
            </Pressable>
          </View>

          <ScrollView
            style={{ width: "100%" }}
            contentContainerStyle={styles.scrollViewContent}
          >
            {children}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

// Default Style
const styles = StyleSheet.create({
  // Modal
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
  // ScrollView
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
});
