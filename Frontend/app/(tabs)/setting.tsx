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
import { Provider, useSelector } from "react-redux";

import { SvgImage } from "@/components/Svg";

import { User, Sport, Habit, userSetSports, userSetHabits, userLogin, userLogout, userDelete, userRegister } from "@/app/(tabs)";

import store from "@/redux/store";
import { setUser } from "@/redux/userSlice";


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

  // Modal's visiblility control
  const [modalVisible, setModalVisible] = useState(false);
  const [secondModalVisible, setSecondModalVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [userSettingsVisible, setUserSettingsVisible] = useState(false);
  const [userLoggingVisible, setUserLoggingVisible] = useState(false);

  const user = useSelector( (state: { user: User }) => state.user);
  const userSettings = useSelector( (state: { userSettings: { sport: Sport[], habit: Habit[] } }) => state.userSettings);

  // Temp data
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [sport, setSport] = useState<number[]>([]); // Start from 1
  const [habit, setHabit] = useState<number[]>([]); // Start from 1

  useEffect(() => {
    setSport(store.getState().userSettings.sport.map((sport) => sport.id)); 
    setHabit(store.getState().userSettings.habit.map((habit) => habit.id));
  }, [userSettings])

  // Define ref (element ID)
  const usernameLoginInputRef = useRef<TextInput>(null);
  const passwordLoginInputRef = useRef<TextInput>(null);
  const usernameRegisterInputRef = useRef<TextInput>(null);
  const passwordRegisterInputRef = useRef<TextInput>(null);

  const usernameInput = usernameLoginInputRef.current;
  const passwordInput = passwordLoginInputRef.current;
  const usernameRegisterInput = usernameRegisterInputRef.current;
  const passwordRegisterInput = passwordRegisterInputRef.current;

const ShowUserModal = () =>{
  if(user.id && user.id !== -1){
    setUserModalVisible(true);
  }
  else{
    setUserLoggingVisible(true);
  }
}

  const toggleOption = (
    option: number,
    setSelected: React.Dispatch<React.SetStateAction<number[]>>
  ) => {
    setSelected((prevSelectedOptions) =>
      prevSelectedOptions.includes(option)
        ? prevSelectedOptions.filter((item) => item !== option) // Remove from list
        : [...prevSelectedOptions, option] // Add to list
    );
  };

  const habitList = {
    "做甜點" : 1 ,
    "健行" : 2 ,
    "登山": 3 ,
    "玩遊戲" : 4 ,
    "出遊" : 5 ,
    "閱讀" : 6
  } 

  const sportList = {
    "籃球" : 1 ,
    "羽球" : 2 ,
    "排球": 3 ,
    "游泳" : 4 ,
    "桌球" : 5 ,
    "慢跑" : 6 ,
    "公路車" : 7
  }

  return (
    <Provider store={store}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>設定</Text>
          <View>
            <TouchableOpacity
              style={styles.avatar}
              onPress={() => ShowUserModal()}
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
                {["籃球", "羽球", "排球", "游泳", "公路車", "慢跑", "桌球"].map(
                  (option, index) => (
                    <RadioButton
                      key={index}
                      label={option}
                      selected={sport.includes(index + 1)}
                      onPress={() =>
                        toggleOption(index + 1, setSport)
                      }
                    />
                  )
                )}
              </View>
              <TouchableOpacity
                style={[styles.modalbutton, styles.modalbuttonClose]}
                onPress={async () => {
                  await userSetSports(sport);
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>儲存&關閉</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

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
                      selected={habit.includes(index + 1)}
                      onPress={() =>
                        toggleOption(index + 1, setHabit)
                      }
                    />
                  )
                )}
              </View>
              <TouchableOpacity
                style={[styles.modalbutton, styles.modalbuttonClose]}
                onPress={async () => {
                  await userSetHabits(habit);
                  setSecondModalVisible(!secondModalVisible);
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
                  onChangeText={setAccount}
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
                onPress={async () => {
                  await userLogin(account, password);
                  usernameInput?.clear();
                  passwordInput?.clear();
                  setUserLoggingVisible(!userLoggingVisible);
                }}
              >
                <Text style={styles.textStyle}>登入</Text>
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
                  <Text style={styles.label}>{user.account}</Text>
                </View>
                <View style={styles.inputRow}>
                  <Text style={styles.label}>使用者密碼:</Text>
                  <Text style={styles.label}>{user.password}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={async () => {
                  await userDelete();
                  setUserModalVisible(!userModalVisible);
                }}
                style={[styles.modalbutton, styles.modalbuttonClose]}
              >
                <Text style={styles.textStyle}>刪除使用者</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async() => {
                  await userLogout();
                  setUserModalVisible(!userModalVisible);
                }}
                style={[styles.modalbutton, styles.modalbuttonClose]}
              >
                <Text style={styles.textStyle}>登出</Text>
              </TouchableOpacity>
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
                  ref={usernameRegisterInputRef}
                  onChangeText={setAccount}
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
                  ref={passwordRegisterInputRef}
                  onChangeText={setPassword}
                  secureTextEntry={true}
                />
              </View>
              <TouchableOpacity
                style={[styles.modalbutton, styles.modalbuttonClose]}
                onPress={async () => {
                  await userRegister(account, password);
                  usernameRegisterInput?.clear();
                  passwordRegisterInput?.clear();
                  setUserSettingsVisible(!userSettingsVisible)
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
    </Provider>
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
