import { Modal, StyleSheet, Text, View } from "react-native";
import { ReactNode } from "react";

interface CustomModalProps {
  isVisible: boolean;
  onClose: () => void;
  modal: {
    header: string;
    content: ReactNode;
    footer: ReactNode;
  };
}

export default function CustomModal({
  isVisible,
  onClose,
  modal: { header, content, footer },
}: CustomModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>{header}</Text>
          </View>
          <View style={styles.modalBody}>{content}</View>
          <View style={styles.modalFooter}>{footer}</View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: 250,
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
  modalHeader: {},
  modalHeaderText: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  modalBody: {
    width: "100%",
    marginVertical: 15,
    gap: 10,
  },
  modalFooter: {
    width: "100%",
    gap: 10,
  },
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
});
