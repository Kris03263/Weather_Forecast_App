import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";

interface RadioButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}
const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  selected,
  onPress,
}) => (
  <TouchableOpacity style={styles.radioButton} onPress={onPress}>
    <View
      style={[styles.radioCircle, selected && styles.selectedRadioCircle]}
    />
    <Text style={styles.radioLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [secondModalVisible, setSecondModalVisible] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedTransportOptions, setSelectedTransportOptions] = useState<
    string[]
  >([]);

  const toggleOption = (
    option: string,
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setSelected((prevSelectedOptions) =>
      prevSelectedOptions.includes(option)
        ? prevSelectedOptions.filter((item) => item !== option)
        : [...prevSelectedOptions, option]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>設定</Text>
        <View style={styles.avatar}></View>
      </View>

      {/* 天氣偏好區塊 */}
      <View style={styles.preferenceBox}>
        <Text style={styles.boxTitle}>天氣偏好</Text>
        <View style={styles.inputRow}>
          <Text style={styles.label}>溫度偏好:</Text>
          <TextInput style={styles.input} placeholder="輸入溫度(°C)" />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>濕度偏好:</Text>
          <TextInput style={styles.input} placeholder="輸入濕度" />
        </View>
      </View>

      {/* 活動偏好區塊 */}
      <View style={styles.preferenceBox}>
        <Text style={styles.boxTitle}>活動偏好</Text>
        <View style={styles.inputRow}>
          <Text style={styles.label}>運動偏好:</Text>
          <TouchableOpacity
            style={styles.interactButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.interactText}>選擇運動</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>興趣偏好:</Text>
          <TouchableOpacity
            style={styles.interactButton}
            onPress={() => setSecondModalVisible(true)}
          >
            <Text style={styles.interactText}>選擇嗜好</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/*選擇運動Modal*/}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>選擇運動</Text>
            <View style={styles.radioGroup}>
              {["運動1", "運動2", "運動3", "運動4", "運動5", "運動6"].map(
                (option, index) => (
                  <RadioButton
                    key={index}
                    label={option}
                    selected={selectedOptions.includes(option)}
                    onPress={() => toggleOption(option, setSelectedOptions)}
                  />
                )
              )}
            </View>
            <TouchableOpacity
              style={[styles.modalbutton, styles.modalbuttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>關閉</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/*交通方式Modal*/}
      <Modal
        animationType="fade"
        transparent={true}
        visible={secondModalVisible}
        onRequestClose={() => {
          setSecondModalVisible(!secondModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>選擇嗜好</Text>
            <View style={styles.radioGroup}>
              {["嗜好1", "嗜好2", "嗜好3", "嗜好4", "嗜好5", "嗜好6"].map(
                (option, index) => (
                  <RadioButton
                    key={index}
                    label={option}
                    selected={selectedTransportOptions.includes(option)}
                    onPress={() =>
                      toggleOption(option, setSelectedTransportOptions)
                    }
                  />
                )
              )}
            </View>
            <TouchableOpacity
              style={[styles.modalbutton, styles.modalbuttonClose]}
              onPress={() => setSecondModalVisible(!secondModalVisible)}
            >
              <Text style={styles.textStyle}>關閉</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a2738",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
  },
  preferenceBox: {
    backgroundColor: "#d3d3d3",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  boxTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    width: 100,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  iconButton: {
    width: 30,
    height: 30,
    marginLeft: 10,
    backgroundColor: "#f0c14b",
    borderRadius: 15,
  },
  saveButton: {
    backgroundColor: "#4f8ef7",
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  interactButton: {
    backgroundColor: "#4f8ef7",
    flex: 1,
    borderRadius: 5,
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  interactText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    alignContent: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
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
  modalbutton: {
    borderRadius: 10,
    padding: 10,
  },
  modalbuttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "gray",
    marginRight: 10,
  },
  selectedRadioCircle: {
    backgroundColor: "blue",
  },
  radioLabel: {
    fontSize: 16,
  },
  radioGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
});
