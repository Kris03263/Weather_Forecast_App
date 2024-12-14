// React Component and Package
import {
  StyleSheet,
  Pressable,
  Text,
  Share,
  Alert,
  Image,
  View,
} from "react-native";
import { useSelector } from "react-redux";
// Components
import { PopupModal } from "@/components/PopupModal";
import { SvgImage } from "@/components/Svg";
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

  const shareContent = async (messageString: string, urlString?: string) => {
    console.log(urlString);
    try {
      await Share.share(
        {
          title: `分享地震資訊$`,
          message: `${messageString || ""}\n${urlString || ""}`,
          url: urlString || "",
        },
        {
          dialogTitle: "分享地震資訊",
        }
      );
    } catch (error: any) {
      Alert.alert("分享失敗", error.message || "發生未知错误");
    }
  };

  try {
    const messageObj = JSON.parse(message);
    console.log(messageObj);
    const time = new Date(messageObj.時間);
    const urlTime = encodeURIComponent(
      `${time.getFullYear()}-${(time.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${time.getDate().toString().padStart(2, "0")}_${time
        .getHours()
        .toString()
        .padStart(2, "0")}:${time
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${time.getSeconds().toString().padStart(2, "0")}`
    );
    const url = `https://420269.xyz/Disaster/getImage?time=${urlTime}`;
    return (
      <PopupModal
        isVisible={isVisible}
        onClose={() => store.dispatch(setVisible(false))}
        header="通知"
      >
        <Text>{messageObj.地震資訊}</Text>
        <View style={{ width: "100%", aspectRatio: 0.75 }}>
          <Image
            source={{ uri: url }}
            style={{
              width: "100%",
              height: "100%",
              resizeMode: "contain",
              borderRadius: 20,
            }}
          />
        </View>
        <Pressable
          style={styles.shareButton}
          onPress={() => shareContent(messageObj.地震資訊, url)}
        >
          <SvgImage name="share" style={styles.svgImage} />
          <Text style={styles.shareButtonText}>分享</Text>
        </Pressable>
        <Pressable
          style={styles.modalButton}
          onPress={() => store.dispatch(setVisible(false))}
        >
          <Text style={styles.modalButtonText}>確認</Text>
        </Pressable>
      </PopupModal>
    );
  } catch (error: any) {
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
  // Share Button
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#238636",
    borderRadius: 10,
    padding: 10,
    gap: 10,
  },
  shareButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  // Svg
  svgImage: {
    width: 20,
    height: 20,
  },
});