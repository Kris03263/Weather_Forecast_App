import {
  View,
  Modal,
  TouchableOpacity,
  Animated,
  PanResponder,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { SvgImage } from "@/components/Svg";

interface modalVisibleCrontrollProps {
  isModalShow: boolean;
  title: React.ReactNode;
  content: React.ReactNode;
  onClose: () => void;
}

export function SlideModal({
  isModalShow,
  content,
  title,
  onClose,
}: modalVisibleCrontrollProps) {
  const [ModalVisible, setModalVisible] = useState(isModalShow);
  const pan = useRef(new Animated.ValueXY()).current;
  useEffect(() => {
    setModalVisible(isModalShow);
    if (isModalShow) {
      Animated.timing(pan, {
        toValue: { x: 0, y: 0 },
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [isModalShow]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return gestureState.dy > 10;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 10) {
          Animated.event([null, { dy: pan.y }], { useNativeDriver: false })(
            evt,
            gestureState
          );
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 100) {
          setModalVisible(false);
          onClose();
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={ModalVisible}
        onRequestClose={() => {}}
      >
        <View style={styles.centeredView}>
          <Animated.View
            style={[styles.modalView, { transform: [{ translateY: pan.y }] }]}
          >
            <View style={styles.header} {...panResponder.panHandlers}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setModalVisible(!ModalVisible);
                  onClose();
                }}
              >
                <SvgImage style={styles.svgImage} name="close" />
              </TouchableOpacity>
              {title}
            </View>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              {content}
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  header: {
    width: "100%",
    height: "10%",
    backgroundColor: "#21262c",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  modalView: {
    width: "100%",
    height: "90%",
    backgroundColor: "#21262c",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 2.5,
    alignSelf: "center",
    marginVertical: 10,
    marginBottom: 20,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#2196F3",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#9ca8b7",
    fontWeight: "bold",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 30,
    backgroundColor: "#2f363e",
    borderRadius: 30,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  svgImage: {
    width: 20,
    height: 20,
  },
});
