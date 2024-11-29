// React Component and Package
import { StyleSheet, Pressable, Text } from "react-native";
import { useSelector } from "react-redux";
// Components
import { PopupModal } from "@/components/PopupModal";
// Redux
import store from "@/redux/store";
import { setVisible } from "@/redux/globalMessageSlice";

export function MessageModal() {
  const message = useSelector(
    (state: { globalMessage: { message: string } }) =>
      state.globalMessage.message
  );
  const isVisible = useSelector(
    (state: { globalMessage: { isVisible: boolean } }) =>
      state.globalMessage.isVisible
  );

  return (
    <PopupModal
      isVisible={isVisible}
      onClose={() => store.dispatch(setVisible(false))}
      header="通知"
    >
      <Text>{message}</Text>
      <Pressable
        style={styles.modalButton}
        onPress={() => store.dispatch(setVisible(false))}
      >
        <Text style={styles.modalButtonText}>確認</Text>
      </Pressable>
    </PopupModal>
  );
}

const styles = StyleSheet.create({
  // Modal
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
