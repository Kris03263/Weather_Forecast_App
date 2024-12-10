// React Component and Package
import { Modal, StyleSheet, Text, View } from "react-native";
import { ReactNode } from "react";

export interface PopupModalProps {
  isVisible: boolean;
  onClose: () => void;
  header: string;
  children: ReactNode;
}

export function PopupModal({
  isVisible,
  onClose,
  header,
  children,
}: PopupModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>{header}</Text>
          </View>
          <View style={styles.modalBody}>{children}</View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // Modal
  modalBackground: {
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
  modalHeader: {
    marginBottom: 15,
  },
  modalHeaderText: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  modalBody: {
    width: "100%",
    gap: 10,
  },
});
