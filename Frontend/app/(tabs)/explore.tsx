import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
} from "react-native";
import { SvgImage } from "@/components/Svg";

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

//Modal's visiblility control
//Modal's visiblility control
export default function SettingsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [secondModalVisible, setSecondModalVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [selectedHabitsOptions, setSelectedHabitsOptions] = useState<string[]>(
    []
  );
  const [selectedSportOptions, setSelectedSportOptions] = useState<string[]>(
    []
  );
  const [userSettingsVisible, setUserSettingsVisible] = useState(false);
  const [userLoggingVisible, setUserLoggingVisible] = useState(false);

  //userData
  const [username, setUsername] = useState("");
  const [userPassword, setPassword] = useState("");
  const [response, setResponse] = useState(null);
  const [accountStatus, setAccountStatus] = useState("");
  const [userID, setUserID] = useState(1);

  //define ref(element ID)
  const usernameLoginInputRef = useRef<TextInput>(null);
  const passwordLoginInputRef = useRef<TextInput>(null);
  const usernameRegisterInputRef = useRef<TextInput>(null);
  const passwordRegisterInputRef = useRef<TextInput>(null);

  const usernameInput = usernameLoginInputRef.current;
  const passwordInput = passwordLoginInputRef.current;
  const usernameRegisterInput = usernameRegisterInputRef.current;
  const passwordRegisterInput = passwordRegisterInputRef.current;

  //POST userRegister
  const handleRegister = async () => {
    await fetch("https://weather-2-9.onrender.com/Users", {
      method: "POST",
      body: JSON.stringify({
        userAccount: username,
        password: userPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setUserID(data.id);
        if (userID !== -1) {
          Alert.alert("註冊成功");
        } else {
          Alert.alert("註冊失敗，註冊失敗");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  //POST userLogin
  const handleLogin = () => {
    fetch("https://weather-2-9.onrender.com/Login", {
      method: "POST",
      body: JSON.stringify({
        userAccount: username,
        password: userPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setAccountStatus(data.status);
        if (accountStatus === "Successful") {
          setUserID(data.id);
          Alert.alert("登入成功");
          handleGetUserHabits();
        } else {
          Alert.alert("登入失敗，請檢查帳號密碼是否有誤");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  //POST userHabit API
  const handlePostUserHabits = () => {
    fetch("https://weather-2-9.onrender.com/Users/UserHabits", {
      method: "POST",
      body: JSON.stringify({
        userID: userID,
        habitsID: habitIndexes,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.Status === "Update Successful !") {
          Alert.alert("嗜好更新成功");
        } else {
          Alert.alert("嗜好更新失敗");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  //POST userSport API
  const handlePostUserSports = () => {
    fetch("https://weather-2-9.onrender.com/Users/UserSports", {
      method: "POST",
      body: JSON.stringify({
        userID: userID,
        sportsID: sportIndexes,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.Status === "Update Successful !") {
          Alert.alert("運動更新成功");
        } else {
          Alert.alert("運動更新失敗");
        }
      });
  };

  //DELETE user API
  const handleDeleteUser = () => {
    fetch("https://weather-2-9.onrender.com/Users", {
      method: "DELETE",
      body: JSON.stringify({
        userID: userID,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.Status === "Delete Successful !") {
          Alert.alert("使用者刪除成功");
        } else {
          Alert.alert("使用者刪除失敗");
        }
      })
      .catch((error) => console.error("Error:", error));
  }

  //GET UserData API
  const handleGetUserData = () => {
    fetch(`https://weather-2-9.onrender.com/Users?id=${userID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => setResponse(data))
      .catch((error) => console.error("Error:", error));
  };

  // GET userHabit API
  const handleGetUserHabits = () => {
    fetch("https://weather-2-9.onrender.com/Users/UserHabits?=" + userID, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setSelectedHabitsOptions(data.habitName);
      })
      .catch((error) => console.error("Error:", error));
  };

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

  //find the index of selectedHabitsOptions
  const findHabitsOptionIndexes = (
    selectedOptions: string[],
    allHabitsOptions: string[]
  ): number[] => {
    return selectedOptions.map((option) => allHabitsOptions.indexOf(option));
  };
  const allHabitsOptions = ["做甜點", "健行", "登山", "玩遊戲", "出遊", "閱讀"];
  const habitIndexes = findHabitsOptionIndexes(
    selectedHabitsOptions,
    allHabitsOptions
  );

  //find the index of selectedSportOptions
  const findSportOptionIndexes = (
    selectedOptions: string[],
    allSportOptions: string[]
  ): number[] => {
    return selectedOptions.map((option) => allSportOptions.indexOf(option));
  };
  const allSportOptions = [
    "籃球",
    "羽球",
    "排球",
    "游泳",
    "桌球",
    "慢跑",
    "公路車",
  ];
  const sportIndexes = findSportOptionIndexes(
    selectedSportOptions,
    allSportOptions
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>設定</Text>
        <View>
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => setUserLoggingVisible(true)}
          ></TouchableOpacity>
        </View>
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
              {["籃球", "羽球", "排球", "游泳", "桌球", "慢跑", "公路車"].map(
                (option, index) => (
                  <RadioButton
                    key={index}
                    label={option}
                    selected={selectedSportOptions.includes(option)}
                    onPress={() =>
                      toggleOption(option, setSelectedSportOptions)
                    }
                  />
                )
              )}
            </View>
            <TouchableOpacity
              style={[styles.modalbutton, styles.modalbuttonClose]}
              onPress={() => {
                setModalVisible(!modalVisible);
                handlePostUserSports();
              }}
            >
              <Text style={styles.textStyle}>儲存&關閉</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/*選擇嗜好Modal*/}
      {/*選擇嗜好Modal*/}
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
              {["做甜點", "健行", "登山", "玩遊戲", "出遊", "閱讀"].map(
                (option, index) => (
                  <RadioButton
                    key={index}
                    label={option}
                    selected={selectedHabitsOptions.includes(option)}
                    onPress={() =>
                      toggleOption(option, setSelectedHabitsOptions)
                    }
                  />
                )
              )}
            </View>
            <TouchableOpacity
              style={[styles.modalbutton, styles.modalbuttonClose]}
              onPress={() => {
                setSecondModalVisible(!secondModalVisible);
                handlePostUserHabits();
              }}
            >
              <Text style={styles.textStyle}>儲存&關閉</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/*登入UI*/}
      <Modal
        animationType="fade"
        transparent={true}
        visible={userLoggingVisible}
        onRequestClose={() => {
          setUserLoggingVisible(!userLoggingVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>登入</Text>
            <View style={{ gap: 10 }}>
              <View style={styles.inputRow}>
                <Text style={styles.label}>
                  <SvgImage
                    style={{ width: 30, height: 30 }}
                    name="userAccount"
                  />
                  使用者名稱:
                </Text>
              </View>
              <TextInput
                style={styles.input}
                ref={usernameLoginInputRef}
                placeholder="輸入名稱"
                onChangeText={setUsername}
              />
              <View style={styles.inputRow}>
                <Text style={styles.label}>
                  <SvgImage
                    style={{ width: 30, height: 30 }}
                    name="userPassword"
                  />
                  使用者密碼:
                </Text>
              </View>
              <TextInput
                style={styles.input}
                ref={passwordLoginInputRef}
                placeholder="輸入密碼"
                secureTextEntry={true}
                onChangeText={setPassword}
              />
            </View>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => {
                setUserSettingsVisible(true);
                setUserLoggingVisible(!userLoggingVisible);
              }}
            >
              <Text style={styles.linkText}>沒有帳號嗎，點擊此以註冊</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalbutton, styles.modalbuttonClose]}
              onPress={() => {
                handleLogin();
                usernameInput?.clear();
                passwordInput?.clear();
              }}
            >
              <Text style={styles.textStyle}>登入</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeleteUser} style = {[styles.modalbutton, styles.modalbuttonClose]}>
              <Text style={styles.textStyle}>刪除使用者</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalbutton, styles.modalbuttonClose]}
              onPress={() => setUserLoggingVisible(!userLoggingVisible)}
            >
              <Text style={styles.textStyle}>關閉</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/*使用者顯示modal*/}
      <Modal
        animationType="fade"
        transparent={true}
        visible={userModalVisible}
        onRequestClose={() => {
          setUserModalVisible(!userModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>使用者</Text>
            <View style={{ gap: 10 }}>
              <View style={styles.inputRow}>
                <Text style={styles.label}>使用者名稱:</Text>
                <Text style={styles.label}>{username}</Text>
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.label}>使用者密碼:</Text>
                <Text style={styles.label}>{userPassword}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.modalbutton, styles.modalbuttonClose]}
              onPress={() => setUserModalVisible(!userModalVisible)}
            >
              <Text style={styles.textStyle}>關閉</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/*使用者註冊modal*/}
      <Modal
        animationType="fade"
        transparent={true}
        visible={userSettingsVisible}
        onRequestClose={() => {
          setUserSettingsVisible(!userSettingsVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>註冊</Text>
            <View style={{ gap: 10 }}>
              <View style={styles.inputRow}>
                <Text style={styles.label}>
                  <SvgImage
                    style={{ width: 30, height: 30 }}
                    name="userAccount"
                  />
                  使用者名稱:
                </Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="輸入名稱"
                onChangeText={setUsername}
                ref = {usernameRegisterInputRef}
              />
              <View style={styles.inputRow}>
                <Text style={styles.label}>
                  <SvgImage
                    style={{ width: 30, height: 30 }}
                    name="userPassword"
                  />
                  使用者密碼:
                </Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="輸入密碼"
                ref = {passwordRegisterInputRef}
                onChangeText={setPassword}
                secureTextEntry={true}
              />
            </View>
            <TouchableOpacity
              style={[styles.modalbutton, styles.modalbuttonClose]}
              onPress={() => {
                handleRegister();
                usernameRegisterInput?.clear();
                passwordRegisterInput?.clear();
              }}
            >
              <Text style={styles.textStyle}>提交</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalbutton, styles.modalbuttonClose]}
              onPress={() => setUserSettingsVisible(!userSettingsVisible)}
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
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
  },
  preferenceBox: {
    backgroundColor: "#d3d3d3",
    borderRadius: 10,
    gap: 10,
    gap: 10,
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
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    width: "auto",
    marginRight: 10,
    width: "auto",
    marginRight: 10,
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
    marginTop: 10,
    width: "100%",
    alignItems: "center",
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
    fontWeight: "bold",
    fontSize: 20,
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
  linkButton: {
    marginVertical: 10,
  },
  linkText: {
    color: "gray",
    textDecorationLine: "underline",
  },
});
