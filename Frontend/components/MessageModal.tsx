import React from "react";
import { StyleSheet, Pressable, Text } from "react-native";
import { useSelector } from "react-redux";

import { PopupModal } from "@/components/PopupModal";
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
  const onClose = () => store.dispatch(setVisible(false));

  return (
    <PopupModal
      isVisible={isVisible}
      onClose={onClose}
      header="通知"
      content={<Text>{message}</Text>}
      footer={
        <Pressable style={styles.modalButton} onPress={onClose}>
          <Text style={styles.modalButtonText}>確認</Text>
        </Pressable>
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
