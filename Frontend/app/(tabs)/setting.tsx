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
import { useSelector } from "react-redux";

import { SvgImage } from "../../components/Svg";

import {
  User,
  Sport,
  Habit,
  Selecter,
  WeatherDataList,
  userSetSports,
  userSetHabits,
  userLogin,
  userLogout,
  userDelete,
  userRegister,
} from "./_layout";

import store from "../../redux/store";
import { Widget } from "@/components/Widget";
import { Background } from "@/components/Background";

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
  const [sportModalVisible, setSportModalVisible] = useState(false);
  const [habitModalVisible, setHabitModalVisible] = useState(false);
  const [userInfoModalVisible, setUserInfoModalVisible] = useState(false);
  const [userRegisVisible, setUserRegisVisible] = useState(false);
  const [userLoginVisible, setUserLoginVisible] = useState(false);

  const user = useSelector((state: { user: User }) => state.user);
  const userSettings = useSelector(
    (state: { userSettings: { sport: Sport[]; habit: Habit[] } }) =>
      state.userSettings
  );
  const selecter = useSelector(
    (state: { selecter: Selecter }) => state.selecter
  );
  const weatherDataList = useSelector(
    (state: { weatherData: WeatherDataList }) => state.weatherData
  );
  const weatherData = weatherDataList?.[selecter.region]?.[0]?.[0] ?? null;

  // Temp data
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [sport, setSport] = useState<number[]>([]); // Start from 1
  const [habit, setHabit] = useState<number[]>([]); // Start from 1

  useEffect(() => {
    setSport(
      store.getState().userSettings?.sport?.map((sport) => sport.id) ?? []
    );
    setHabit(
      store.getState().userSettings?.habit?.map((habit) => habit.id) ?? []
    );
  }, [userSettings]);

  // Define ref (element ID)
  const usernameLoginInputRef = useRef<TextInput>(null);
  const passwordLoginInputRef = useRef<TextInput>(null);
  const usernameRegisterInputRef = useRef<TextInput>(null);
  const passwordRegisterInputRef = useRef<TextInput>(null);

  const usernameInput = usernameLoginInputRef.current;
  const passwordInput = passwordLoginInputRef.current;
  const usernameRegisterInput = usernameRegisterInputRef.current;
  const passwordRegisterInput = passwordRegisterInputRef.current;

  const toggleOption = (
    option: number,
    setSelected: React.Dispatch<React.SetStateAction<number[]>>
  ) => {
    setSelected(
      (prevSelectedOptions) =>
        prevSelectedOptions.includes(option)
          ? prevSelectedOptions.filter((item) => item !== option) // Remove from list
          : [...prevSelectedOptions, option] // Add to list
    );
  };

  return (
    <View style={styles.container}>
      {/* Gradiant */}
      <Background weatherData={weatherData} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>設定</Text>
        <View>
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => setUserInfoModalVisible(true)}
          ></TouchableOpacity>
        </View>
      </View>

      {user.id &&
        user.id !== "-1" && [
          /* 天氣偏好區塊 */
          <View style={styles.body}>
            <Widget>
              <Text style={styles.boxTitle}>天氣偏好</Text>
              <View style={styles.boxInputLayout}>
                <Text style={styles.inputLabel}>溫度偏好:</Text>
                <TextInput style={styles.boxInput} placeholder="輸入溫度(°C)" />
              </View>
              <View style={styles.boxInputLayout}>
                <Text style={styles.inputLabel}>濕度偏好:</Text>
                <TextInput style={styles.boxInput} placeholder="輸入濕度" />
              </View>
            </Widget>
          </View>,
          /* 活動偏好區塊 */
          <Widget>
            <Text style={styles.boxTitle}>活動偏好</Text>
            <View style={styles.boxInputLayout}>
              <Text style={styles.inputLabel}>運動偏好:</Text>
              <TouchableOpacity
                style={styles.boxButton}
                onPress={() => setSportModalVisible(true)}
              >
                <Text style={styles.buttonText}>選擇運動</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.boxInputLayout}>
              <Text style={styles.inputLabel}>興趣偏好:</Text>
              <TouchableOpacity
                style={styles.boxButton}
                onPress={() => setHabitModalVisible(true)}
              >
                <Text style={styles.buttonText}>選擇嗜好</Text>
              </TouchableOpacity>
            </View>
          </Widget>,
          /*選擇運動 Modal*/
          <Modal
            animationType="fade"
            transparent={true}
            visible={sportModalVisible}
            onRequestClose={() => {
              setSportModalVisible(!sportModalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalHeaderText}>選擇運動</Text>
                </View>
                <View style={styles.modalBody}>
                  <View style={styles.radioGroup}>
                    {[
                      "籃球",
                      "羽球",
                      "排球",
                      "游泳",
                      "公路車",
                      "慢跑",
                      "桌球",
                    ].map((option, index) => (
                      <RadioButton
                        key={index}
                        label={option}
                        selected={sport.includes(index + 1)}
                        onPress={() => toggleOption(index + 1, setSport)}
                      />
                    ))}
                  </View>
                </View>
                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={async () => {
                      await userSetSports(sport);
                      setSportModalVisible(!sportModalVisible);
                    }}
                  >
                    <Text style={styles.buttonText}>儲存&關閉</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>,
          /*選擇嗜好 Modal*/
          <Modal
            animationType="fade"
            transparent={true}
            visible={habitModalVisible}
            onRequestClose={() => {
              setHabitModalVisible(!habitModalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalHeaderText}>選擇嗜好</Text>
                </View>
                <View style={styles.modalBody}>
                  <View style={styles.radioGroup}>
                    {["做甜點", "健行", "登山", "玩遊戲", "出遊", "閱讀"].map(
                      (option, index) => (
                        <RadioButton
                          key={index}
                          label={option}
                          selected={habit.includes(index + 1)}
                          onPress={() => toggleOption(index + 1, setHabit)}
                        />
                      )
                    )}
                  </View>
                </View>
                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={async () => {
                      await userSetHabits(habit);
                      setHabitModalVisible(!habitModalVisible);
                    }}
                  >
                    <Text style={styles.buttonText}>儲存&關閉</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>,
          /*使用者顯示 Modal*/
          <Modal
            animationType="fade"
            transparent={true}
            visible={userInfoModalVisible}
            onRequestClose={() => {
              setUserInfoModalVisible(!userInfoModalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalHeaderText}>使用者</Text>
                </View>
                <View style={styles.modalBody}>
                  <View style={styles.modalInputLayout}>
                    <Text style={styles.inputLabel}>使用者名稱:</Text>
                    <Text style={styles.inputLabel}>{user.account}</Text>
                  </View>
                  <View style={styles.modalInputLayout}>
                    <Text style={styles.inputLabel}>使用者密碼:</Text>
                    <Text style={styles.inputLabel}>{user.password}</Text>
                  </View>
                </View>
                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    onPress={async () => {
                      await userDelete();
                      setUserInfoModalVisible(!userInfoModalVisible);
                    }}
                    style={styles.modalButton}
                  >
                    <Text style={styles.buttonText}>刪除使用者</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={async () => {
                      await userLogout();
                      setUserInfoModalVisible(!userInfoModalVisible);
                    }}
                    style={styles.modalButton}
                  >
                    <Text style={styles.buttonText}>登出</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() =>
                      setUserInfoModalVisible(!userInfoModalVisible)
                    }
                  >
                    <Text style={styles.buttonText}>關閉</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>,
        ]}

      {!user.id &&
        user.id === "-1" && [
          /* Login to use seetings */
          <Text style={styles.headerText}>登入以使用設定</Text>,
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setUserLoginVisible(true)}
          >
            <Text style={styles.buttonText}>登入</Text>
          </TouchableOpacity>,
          /*登入 Modal*/
          <Modal
            animationType="fade"
            transparent={true}
            visible={userLoginVisible}
            onRequestClose={() => {
              setUserLoginVisible(!userLoginVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalHeaderText}>登入</Text>
                </View>
                <View style={styles.modalBody}>
                  <View style={styles.modalInputLayout}>
                    <SvgImage style={styles.modalInputSvg} name="userAccount" />
                    <Text style={styles.inputLabel}>使用者名稱:</Text>
                  </View>
                  <TextInput
                    style={styles.modalInput}
                    ref={usernameLoginInputRef}
                    placeholder="輸入名稱"
                    onChangeText={setAccount}
                  />
                  <View style={styles.modalInputLayout}>
                    <SvgImage
                      style={styles.modalInputSvg}
                      name="userPassword"
                    />
                    <Text style={styles.inputLabel}>使用者密碼:</Text>
                  </View>
                  <TextInput
                    style={styles.modalInput}
                    ref={passwordLoginInputRef}
                    placeholder="輸入密碼"
                    secureTextEntry={true}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setUserRegisVisible(true);
                      setUserLoginVisible(!userLoginVisible);
                    }}
                  >
                    <Text style={styles.linkText}>
                      沒有帳號嗎，點擊此以註冊
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={async () => {
                      await userLogin(account, password);
                      usernameInput?.clear();
                      passwordInput?.clear();
                      setUserLoginVisible(!userLoginVisible);
                    }}
                  >
                    <Text style={styles.buttonText}>登入</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => setUserLoginVisible(!userLoginVisible)}
                  >
                    <Text style={styles.buttonText}>關閉</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>,
          /*使用者註冊 Modal*/ <Modal
            animationType="fade"
            transparent={true}
            visible={userRegisVisible}
            onRequestClose={() => {
              setUserRegisVisible(!userRegisVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalHeaderText}>註冊</Text>
                </View>
                <View style={styles.modalBody}>
                  <View style={styles.modalInputLayout}>
                    <SvgImage style={styles.modalInputSvg} name="userAccount" />
                    <Text style={styles.inputLabel}>使用者名稱:</Text>
                  </View>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="輸入名稱"
                    ref={usernameRegisterInputRef}
                    onChangeText={setAccount}
                  />
                  <View style={styles.modalInputLayout}>
                    <SvgImage
                      style={styles.modalInputSvg}
                      name="userPassword"
                    />
                    <Text style={styles.inputLabel}>使用者密碼:</Text>
                  </View>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="輸入密碼"
                    ref={passwordRegisterInputRef}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                  />
                </View>
                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={async () => {
                      await userRegister(account, password);
                      usernameRegisterInput?.clear();
                      passwordRegisterInput?.clear();
                      setUserRegisVisible(!userRegisVisible);
                    }}
                  >
                    <Text style={styles.buttonText}>提交</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => setUserRegisVisible(!userRegisVisible)}
                  >
                    <Text style={styles.buttonText}>關閉</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>,
        ]}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 16,
    color: "white",
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  linkText: {
    color: "gray",
    textDecorationLine: "underline",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 30,
    padding: "3%",
  },
  headerText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
  },
  body: {
    gap: 20,
  },

  // box
  box: {
    backgroundColor: "#FFFFFF0A",
    borderRadius: 10,
    gap: 10,
    padding: 15,
    marginBottom: 20,
  },
  boxTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  boxInputLayout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  boxButton: {
    backgroundColor: "#4f8ef7",
    maxWidth: 180,
    flex: 1,
    borderRadius: 10,
    alignItems: "center",
    padding: 10,
  },
  boxInput: {
    width: 180,
    backgroundColor: "#ffffff00",
    padding: 10,
    borderRadius: 10,
    borderColor: "white",
    borderWidth: 2,
  },

  // modal
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

  // radio btn
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
    justifyContent: "space-between",
  },
});
