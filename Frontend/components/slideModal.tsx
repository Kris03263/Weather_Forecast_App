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
import { Dropdown } from "@/components/DropDown";
import { Chart } from "@/components/Chart";

interface modalVisibleCrontrollProps {
  type: string;
  isModalShow: boolean;
  onClose: () => void;
}

export function SlideModal({
  type,
  isModalShow,
  onClose,
}: modalVisibleCrontrollProps) {
  const [ModalVisible, setModalVisible] = useState(isModalShow);
  const [indicator, setIndicator] = useState<string>(type);
  const [title, setTitle] = useState<React.ReactNode>();
  const [content, setContent] = useState<React.ReactNode>();
  const pan = useRef(new Animated.ValueXY()).current;

  const renderPage = () => {
    switch (indicator) {
      case "temp":
        setTitle(
          <View style={styles.titleDisplay}>
            <SvgImage style={styles.svgImage} name="weather" />
            <Text style={styles.title}>天氣預報</Text>
          </View>
        );
        setContent(<Chart type="temp" />);
        break;
      case "rainRate":
        setTitle(
          <View style={styles.titleDisplay}>
            <SvgImage style={styles.svgImage} name="rainRate" />
            <Text style={styles.title}>降雨機率</Text>
          </View>
        );
        setContent(<Chart type="rainRate" />);
        break;
      case "windSpeed":
        setTitle(
          <View style={styles.titleDisplay}>
            <SvgImage style={styles.svgImage} name="windSpeed" />
            <Text style={styles.title}>風速</Text>
          </View>
        );
        setContent(<Chart type="windSpeed" />);
        break;
      case "wet":
        setTitle(
          <View style={styles.titleDisplay}>
            <SvgImage style={styles.svgImage} name="wet" />
            <Text style={styles.title}>濕度</Text>
          </View>
        );
        setContent(<Chart type="wet" />);
        break;
      default:
        return null;
    }
  };

  useEffect(() => {
    setModalVisible(isModalShow);
    if (isModalShow) {
      Animated.timing(pan, {
        toValue: { x: 0, y: 0 },
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
    renderPage();
  }, [isModalShow]);

  useEffect(() => {
    renderPage();
  }, [indicator]);

  const panResponder = useRef(
    PanResponder.create({
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
        onRequestClose={() => {
          setModalVisible(!ModalVisible);
          onClose();
        }}
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
              <View style={styles.container}>
                <Dropdown
                  onIndicatorChange={(newIndicator: string) => {
                    setIndicator(newIndicator);
                  }}
                />
              </View>
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
  titleDisplay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
  },
  title: {
    color: "white",
    fontSize: 20,
    textAlign: "left",
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
  container: {
    paddingTop: 50,
  },
  dropdownText: {
    fontSize: 16,
    padding: 10,
    color: "#fff",
  },
  dropdownStyle: {
    width: 150,
    backgroundColor: "#333", // Set background color
  },
  dropdownRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  label: {
    fontSize: 16,
    color: "#fff",
  },
});
