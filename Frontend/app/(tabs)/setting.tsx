import React, { useState, useEffect, useRef, ReactNode } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";

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
  getAllHabitList,
  getAllSportList,
  Region,
} from "./_layout";

import store from "@/redux/store";
import { Widget } from "@/components/Widget";
import { Background } from "@/components/Background";
import CustomModal from "@/components/PopupModal";
import { SvgImage } from "@/components/Svg";
import { RadioButton } from "@/components/RadioButton";

export default function SettingsScreen() {
  // Modal control
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalHeader, setModalHeader] = useState("");
  const [modalContent, setModalContent] = useState<ReactNode>();
  const [modalFooter, setModalFooter] = useState<ReactNode>();
  const [modalType, setModalType] = useState<ModalType>();

  // Temp data
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [sport, setSport] = useState<number[]>([]); // Start from 1
  const [habit, setHabit] = useState<number[]>([]); // Start from 1
  const [sportList, setSportList] = useState<Sport[]>([]);
  const [habitList, setHabitList] = useState<Habit[]>([]);

  // Define ref (element ID)
  const usernameLoginInputRef = useRef<TextInput>(null);
  const usernameInput = usernameLoginInputRef.current;
  const passwordLoginInputRef = useRef<TextInput>(null);
  const passwordInput = passwordLoginInputRef.current;
  const usernameRegisterInputRef = useRef<TextInput>(null);
  const usernameRegisterInput = usernameRegisterInputRef.current;
  const passwordRegisterInputRef = useRef<TextInput>(null);
  const passwordRegisterInput = passwordRegisterInputRef.current;

  // Data from Redux
  const user = useSelector((state: { user: User }) => state.user);
  const userSettings = useSelector(
    (state: { userSettings: { sport: Sport[]; habit: Habit[] } }) =>
      state.userSettings
  );
  const selecter = useSelector(
    (state: { selecter: Selecter }) => state.selecter
  );
  const regions = useSelector((state: { regions: Region[] }) => state.regions);
  const weatherDataList = useSelector(
    (state: { weatherData: WeatherDataList }) => state.weatherData
  );
  const weatherData =
    weatherDataList?.[regions[selecter.regionIndex]?.name]?.[0]?.[0] ?? null;

  useEffect(() => {
    getAllHabitList().then((data) => {
      setHabitList(data);
    });
    getAllSportList().then((data) => {
      setSportList(data);
    });
  }, []);

  useEffect(() => {
    setSport(
      store.getState().userSettings?.sport?.map((sport) => sport.id) ?? []
    );
    setHabit(
      store.getState().userSettings?.habit?.map((habit) => habit.id) ?? []
    );
  }, [userSettings]);

  enum ModalType {
    LOGIN = "登入",
    REGISTER = "註冊",
    USER = "使用者",
    SPORT = "運動",
    HABIT = "嗜好",
  }

  const openModal = (modalType: ModalType) => {
    setModalHeader(modalType);
    setModalContent(getModalContent(modalType));
    setModalFooter(getModalFooter(modalType));
    setModalType(modalType);
    setModalVisible(true);
  };

  useEffect(() => {
    if (isModalVisible) {
      switch (modalType) {
        case ModalType.LOGIN:
          openModal(ModalType.LOGIN);
          break;
        case ModalType.REGISTER:
          openModal(ModalType.REGISTER);
          break;
        case ModalType.USER:
          openModal(ModalType.USER);
          break;
        case ModalType.SPORT:
          openModal(ModalType.SPORT);
          break;
        case ModalType.HABIT:
          openModal(ModalType.HABIT);
          break;
        default:
          break;
      }
    }
  }, [sport, habit, account, password]);

  const getModalContent = (type: ModalType) => {
    switch (type) {
      case ModalType.LOGIN:
        return (
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
                openModal(ModalType.REGISTER);
              }}
            >
              <Text style={styles.linkText}>沒有帳號嗎，點擊此以註冊</Text>
            </TouchableOpacity>
          </>
        );
      case ModalType.REGISTER:
        return (
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
        );
      case ModalType.USER:
        return (
          <>
            <Text style={styles.modalInputLabel}>
              {"使用者名稱: " + user.account}
            </Text>
            <Text style={styles.modalInputLabel}>
              {"使用者密碼: " + user.password}
            </Text>
          </>
        );
      case ModalType.SPORT:
        return (
          <>
            {sportList.map((option) => (
              <RadioButton
                key={option.id}
                label={option.sportName}
                selected={sport.includes(option.id)}
                onPress={() => {
                  setSport((pre) =>
                    pre.includes(option.id)
                      ? pre.filter((item) => item !== option.id)
                      : [...pre, option.id]
                  );
                }}
              />
            ))}
          </>
        );
      case ModalType.HABIT:
        return (
          <>
            {habitList.map((option) => (
              <RadioButton
                key={option.id}
                label={option.habitName}
                selected={habit.includes(option.id)}
                onPress={() => {
                  setHabit((pre) =>
                    pre.includes(option.id)
                      ? pre.filter((item) => item !== option.id)
                      : [...pre, option.id]
                  );
                }}
              />
            ))}
          </>
        );
      default:
        return <></>;
    }
  };
  const getModalFooter = (type: ModalType) => {
    switch (type) {
      case ModalType.LOGIN:
        return (
          <>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                usernameInput?.clear();
                passwordInput?.clear();
                userLogin(account, password);
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
        );
      case ModalType.REGISTER:
        return (
          <>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                usernameRegisterInput?.clear();
                passwordRegisterInput?.clear();
                userRegister(account, password);
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
        );
      case ModalType.USER:
        return (
          <>
            <TouchableOpacity
              onPress={() => {
                userDelete(store.getState().user.id);
                setModalVisible(false);
              }}
              style={styles.modalButton}
            >
              <Text style={styles.buttonText}>刪除使用者</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                userLogout();
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
        );
      case ModalType.SPORT:
        return (
          <>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                userSetSports(sport);
                setModalVisible(false);
              }}
            >
              <Text style={styles.buttonText}>儲存&關閉</Text>
            </TouchableOpacity>
          </>
        );
      case ModalType.HABIT:
        return (
          <>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                userSetHabits(habit);
                setModalVisible(false);
              }}
            >
              <Text style={styles.buttonText}>儲存&關閉</Text>
            </TouchableOpacity>
          </>
        );
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
                  ? openModal(ModalType.USER)
                  : openModal(ModalType.LOGIN);
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
                onPress={() => openModal(ModalType.SPORT)}
              >
                <Text style={styles.buttonText}>選擇運動</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.boxInputLayout}>
              <Text style={styles.boxInputLabel}>興趣偏好:</Text>
              <TouchableOpacity
                style={styles.boxButton}
                onPress={() => openModal(ModalType.HABIT)}
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
              onPress={() => openModal(ModalType.LOGIN)}
            >
              <Text style={styles.buttonText}>登入</Text>
            </TouchableOpacity>
          </Widget>
        </View>
      )}

      <CustomModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        header={modalHeader}
        content={modalContent}
        footer={modalFooter}
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
    padding: "3%",
    paddingBottom: 80,
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
});
