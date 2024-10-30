import React, { useState, useEffect, useRef, ReactNode } from "react";
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
import CustomModal from "@/components/CustomModal";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

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
  <TouchableOpacity style={styles.radioButtonLayout} onPress={onPress}>
    <View
      style={[styles.radioButton, selected && styles.radioButtonSelected]}
    />
    <Text style={styles.radioLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function SettingsScreen() {
  // Modal's visiblility control
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalHeader, setModalHeader] = useState("");
  const [modalContent, setModalContent] = useState((<></>) as ReactNode);
  const [modalFooter, setModalFooter] = useState((<></>) as ReactNode);

  // Temp data
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [sport, setSport] = useState<number[]>([]); // Start from 1
  const [habit, setHabit] = useState<number[]>([]); // Start from 1

  // Define ref (element ID)
  const usernameLoginInputRef = useRef<TextInput>(null);
  const usernameInput = usernameLoginInputRef.current;
  const passwordLoginInputRef = useRef<TextInput>(null);
  const passwordInput = passwordLoginInputRef.current;
  const usernameRegisterInputRef = useRef<TextInput>(null);
  const usernameRegisterInput = usernameRegisterInputRef.current;
  const passwordRegisterInputRef = useRef<TextInput>(null);
  const passwordRegisterInput = passwordRegisterInputRef.current;

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

  useEffect(() => {
    setSport(
      store.getState().userSettings?.sport?.map((sport) => sport.id) ?? []
    );
    setHabit(
      store.getState().userSettings?.habit?.map((habit) => habit.id) ?? []
    );
  }, [userSettings]);

  useEffect(() => {
    console.log("NMSL");
  }, [habit, sport]);

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

  const openModal = (modal: {
    header: string;
    content: ReactNode;
    footer: ReactNode;
  }) => {
    setModalHeader(modal.header);
    setModalContent(modal.content);
    setModalFooter(modal.footer);
    setModalVisible(true);
  };

  enum ModalType {
    LOGIN = "login",
    REGISTER = "register",
    USER = "user",
    SPORT = "sport",
    HABIT = "habit",
  }

  const getModalByType = (type: ModalType) => {
    switch (type) {
      case ModalType.LOGIN:
        return {
          header: "登入",
          content: (
            <>
              <View style={styles.modalInputLayout}>
                <SvgImage style={styles.modalInputSvg} name="userAccount" />
                <Text style={styles.modalInputLabel}>使用者名稱: </Text>
              </View>
              <TextInput
                style={styles.modalInput}
                ref={usernameLoginInputRef}
                placeholder="輸入名稱"
                onChangeText={setAccount}
              />
              <View style={styles.modalInputLayout}>
                <SvgImage style={styles.modalInputSvg} name="userPassword" />
                <Text style={styles.modalInputLabel}>使用者密碼: </Text>
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
                  openModal(getModalByType(ModalType.REGISTER));
                }}
              >
                <Text style={styles.linkText}>沒有帳號嗎，點擊此以註冊</Text>
              </TouchableOpacity>
            </>
          ),
          footer: (
            <>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={async () => {
                  await userLogin(account, password);
                  usernameInput?.clear();
                  passwordInput?.clear();
                  setModalVisible(false);
                }}
              >
                <Text style={styles.buttonText}>登入</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>關閉</Text>
              </TouchableOpacity>
            </>
          ),
        };
      case ModalType.REGISTER:
        return {
          header: "註冊",
          content: (
            <>
              <View style={styles.modalInputLayout}>
                <SvgImage style={styles.modalInputSvg} name="userAccount" />
                <Text style={styles.modalInputLabel}>使用者名稱: </Text>
              </View>
              <TextInput
                style={styles.modalInput}
                placeholder="輸入名稱"
                ref={usernameRegisterInputRef}
                onChangeText={setAccount}
              />
              <View style={styles.modalInputLayout}>
                <SvgImage style={styles.modalInputSvg} name="userPassword" />
                <Text style={styles.modalInputLabel}>使用者密碼: </Text>
              </View>
              <TextInput
                style={styles.modalInput}
                placeholder="輸入密碼"
                ref={passwordRegisterInputRef}
                onChangeText={setPassword}
                secureTextEntry={true}
              />
            </>
          ),
          footer: (
            <>
              {" "}
              <TouchableOpacity
                style={styles.modalButton}
                onPress={async () => {
                  await userRegister(account, password);
                  usernameRegisterInput?.clear();
                  passwordRegisterInput?.clear();
                  setModalVisible(false);
                }}
              >
                <Text style={styles.buttonText}>提交</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>關閉</Text>
              </TouchableOpacity>
            </>
          ),
        };
      case ModalType.USER:
        return {
          header: "使用者",
          content: (
            <>
              <Text style={styles.modalInputLabel}>
                {"使用者名稱: " + user.account}
              </Text>
              <Text style={styles.modalInputLabel}>
                {"使用者密碼: " + user.password}
              </Text>
            </>
          ),
          footer: (
            <>
              {" "}
              <TouchableOpacity
                onPress={async () => {
                  await userDelete();
                  setModalVisible(false);
                }}
                style={styles.modalButton}
              >
                <Text style={styles.buttonText}>刪除使用者</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  await userLogout();
                  setModalVisible(false);
                }}
                style={styles.modalButton}
              >
                <Text style={styles.buttonText}>登出</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>關閉</Text>
              </TouchableOpacity>
            </>
          ),
        };
      case ModalType.SPORT:
        return {
          header: "選擇運動",
          content: (
            <>
              <View style={styles.radioGroupLayout}>
                {["不小心刪掉忘記了"].map(
                  // Temp data (replace with all sport request from API)
                  (option, index) => (
                    <RadioButton
                      key={index}
                      label={option}
                      selected={sport.includes(index + 1)}
                      onPress={() => {
                        toggleOption(index + 1, setSport);
                        openModal(getModalByType(ModalType.SPORT));
                      }}
                    />
                  )
                )}
              </View>
            </>
          ),
          footer: (
            <>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={async () => {
                  await userSetSports(sport);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.buttonText}>儲存&關閉</Text>
              </TouchableOpacity>
            </>
          ),
        };
      case ModalType.HABIT:
        return {
          header: "選擇嗜好",
          content: (
            <>
              <View style={styles.radioGroupLayout}>
                {["做甜點", "健行", "登山", "玩遊戲", "出遊", "閱讀"].map(
                  // Temp data (replace with all habit request from API)
                  (option, index) => (
                    <RadioButton
                      key={index}
                      label={option}
                      selected={habit.includes(index + 1)}
                      onPress={() => {
                        toggleOption(index + 1, setHabit);
                        openModal(getModalByType(ModalType.HABIT));
                      }}
                    />
                  )
                )}
              </View>
            </>
          ),
          footer: (
            <>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={async () => {
                  await userSetHabits(habit);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.buttonText}>儲存&關閉</Text>
              </TouchableOpacity>
            </>
          ),
        };
    }
  };

  return (
    <View style={styles.container}>
      {/* Gradiant */}
      <Background weatherData={weatherData} />

      {/* Header */}
      <View style={styles.topSection}>
        <View style={styles.headerLayout}>
          <Text style={styles.headerText}>設定</Text>
          <View>
            <TouchableOpacity
              style={styles.avatar}
              onPress={() => {
                user.id && user.id !== "-1"
                  ? openModal(getModalByType(ModalType.USER))
                  : openModal(getModalByType(ModalType.LOGIN));
              }}
            ></TouchableOpacity>
          </View>
        </View>
      </View>

      {user.id && user.id !== "-1" && (
        <View style={styles.bodySection}>
          {/* 天氣偏好區塊 */}
          <Widget isShow={true}>
            <Text style={styles.boxTitle}>天氣偏好</Text>
            <View style={styles.boxInputLayout}>
              <Text style={styles.boxInputLabel}>溫度偏好:</Text>
              <TextInput style={styles.boxInput} placeholder="輸入溫度(°C)" />
            </View>
            <View style={styles.boxInputLayout}>
              <Text style={styles.boxInputLabel}>濕度偏好:</Text>
              <TextInput style={styles.boxInput} placeholder="輸入濕度" />
            </View>
          </Widget>
          {/* 活動偏好區塊 */}
          <Widget isShow={true}>
            <Text style={styles.boxTitle}>活動偏好</Text>
            <View style={styles.boxInputLayout}>
              <Text style={styles.boxInputLabel}>運動偏好:</Text>
              <TouchableOpacity
                style={styles.boxButton}
                onPress={() => openModal(getModalByType(ModalType.SPORT))}
              >
                <Text style={styles.buttonText}>選擇運動</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.boxInputLayout}>
              <Text style={styles.boxInputLabel}>興趣偏好:</Text>
              <TouchableOpacity
                style={styles.boxButton}
                onPress={() => openModal(getModalByType(ModalType.HABIT))}
              >
                <Text style={styles.buttonText}>選擇嗜好</Text>
              </TouchableOpacity>
            </View>
          </Widget>
        </View>
      )}

      {(!user.id || user.id === "-1") && (
        <View style={styles.bodySection}>
          <Widget isShow={true}>
            <Text style={styles.boxTitle}>登入以使用設定</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => openModal(getModalByType(ModalType.LOGIN))}
            >
              <Text style={styles.buttonText}>登入</Text>
            </TouchableOpacity>
          </Widget>
        </View>
      )}

      <CustomModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        modal={{
          header: modalHeader,
          content: modalContent,
          footer: modalFooter,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  topSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: "3%",
    marginTop: "10%",
  },
  headerLayout: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    width: "100%",
  },
  headerText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: "#ccc",
  },
  bodySection: {
    backgroundColor: "#FFFFFF01",
    height: "70%",
    padding: "3%",
    paddingBottom: "20%",
  },

  // Box
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
  boxInput: {
    width: 180,
    backgroundColor: "#ffffff00",
    padding: 10,
    borderRadius: 10,
    borderColor: "white",
    borderWidth: 2,
  },
  boxInputLabel: {
    color: "white",
    fontSize: 16,
  },
  boxButton: {
    backgroundColor: "#4f8ef7",
    maxWidth: 180,
    flex: 1,
    borderRadius: 10,
    alignItems: "center",
    padding: 10,
  },

  // Modal
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
  modalInputLabel: {
    fontSize: 16,
    color: "black",
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

  // Radio button
  radioGroupLayout: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  radioButtonLayout: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "gray",
    marginRight: 10,
  },
  radioButtonSelected: {
    backgroundColor: "blue",
  },
  radioLabel: {
    fontSize: 16,
  },
});
