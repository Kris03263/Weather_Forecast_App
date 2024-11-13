import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { useSelector } from "react-redux";

import CustomModal from "@/components/PopupModal";
import store from "@/redux/store";
import { setVisible } from "@/redux/globalMessageSlice";

interface MessageModalProps {}

export function MessageModal({}: MessageModalProps) {
  const message = useSelector(
    (state: { globalMessage: { message: string } }) =>
      state.globalMessage.message
  );
  const isVisible = useSelector(
    (state: { globalMessage: { isVisible: boolean } }) =>
      state.globalMessage.isVisible
  );
  const onClose = () => store.dispatch(setVisible(false));

  return (
    <CustomModal
      isVisible={isVisible}
      onClose={onClose}
      header="通知"
      content={<Text>{message}</Text>}
      footer={
        <TouchableOpacity style={styles.modalButton} onPress={onClose}>
          <Text style={styles.modalButtonText}>確認</Text>
        </TouchableOpacity>
      }
    />
  );
}

const styles = StyleSheet.create({
  modalButton: {
    backgroundColor: "#2196F3",
    borderRadius: 10,
    alignItems: "center",
    padding: 10,
  },
  modalButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
