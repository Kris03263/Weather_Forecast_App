// React Component and Package
import { useState, useEffect, useRef, ReactNode } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
// Interfaces and Enums
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
// Components
import { Widget } from "@/components/Widget";
import { Background } from "@/components/Background";
import { PopupModal } from "@/components/PopupModal";
import { SvgImage } from "@/components/Svg";
import { RadioButton } from "@/components/RadioButton";
// Redux
import store from "@/redux/store";

export default function SettingsScreen() {
  // Modal control
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [isRegisterModalVisible, setRegisterModalVisible] = useState(false);
  const [isUserModalVisible, setUserModalVisible] = useState(false);
  const [isSportModalVisible, setSportModalVisible] = useState(false);
  const [isHabitModalVisible, setHabitModalVisible] = useState(false);

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
    weatherDataList?.[regions[selecter.regionIndex]?.id]?.[0]?.[0] ?? null;

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

  // Modal Control
  enum ModalType {
    LOGIN = "登入",
    REGISTER = "註冊",
    USER = "使用者",
    SPORT = "運動",
    HABIT = "嗜好",
  }

  const openModal = (modalType: ModalType) => {
    switch (modalType) {
      case ModalType.LOGIN:
        setLoginModalVisible(true);
        break;
      case ModalType.REGISTER:
        setRegisterModalVisible(true);
        break;
      case ModalType.USER:
        setUserModalVisible(true);
        break;
      case ModalType.SPORT:
        setSportModalVisible(true);
        break;
      case ModalType.HABIT:
        setHabitModalVisible(true);
        break;
      default:
        break;
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
            <Pressable
              style={styles.userInfoButton}
              onPress={() => {
                user.id && user.id !== "-1"
                  ? openModal(ModalType.USER)
                  : openModal(ModalType.LOGIN);
              }}
            >
              <Text style={styles.buttonText}>
                {user.id && user.id !== "-1" ? "使用者資訊" : "登入"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      {user.id && user.id !== "-1" && (
        <View style={styles.bodySection}>
          {/* 天氣偏好區塊 */}
          <Widget
            title="運動偏好"
            svgName="sport"
            isVisible={true}
            style={styles.customWidgetStyle}
            isPressable={true}
            onPress={() => openModal(ModalType.SPORT)}
          >
            <Text style={styles.widgetText}>
              選擇你喜歡的運動以接收每日運動建議
            </Text>
          </Widget>
          {/* 活動偏好區塊 */}
          <Widget
            title="活動偏好"
            svgName="activity"
            isVisible={true}
            style={styles.customWidgetStyle}
            isPressable={true}
            onPress={() => openModal(ModalType.HABIT)}
          >
            <Text style={styles.widgetText}>
              選擇你喜歡的活動以接收每日活動建議
            </Text>
          </Widget>
        </View>
      )}

      {(!user.id || user.id === "-1") && (
        <View style={styles.bodySection}>
          <Widget
            title="登入以使用設定"
            svgName="userAccount"
            isVisible={true}
            style={styles.customWidgetStyle}
            isPressable={true}
            onPress={() => openModal(ModalType.LOGIN)}
          >
            <Text style={styles.widgetText}>
              登入以使用設定功能，或點擊註冊以創建新帳號
            </Text>
          </Widget>
        </View>
      )}

      {/* Login Modal */}
      <PopupModal
        isVisible={isLoginModalVisible}
        onClose={() => setLoginModalVisible(false)}
        header={ModalType.LOGIN}
      >
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

        <Pressable
          onPress={() => {
            openModal(ModalType.REGISTER);
          }}
        >
          <Text style={styles.linkText}>沒有帳號嗎，點擊此以註冊</Text>
        </Pressable>

        <Pressable
          style={styles.modalButton}
          onPress={() => {
            usernameInput?.clear();
            passwordInput?.clear();
            userLogin(account, password);
            setLoginModalVisible(false);
          }}
        >
          <Text style={styles.buttonText}>登入</Text>
        </Pressable>

        <Pressable
          style={styles.modalButton}
          onPress={() => setLoginModalVisible(false)}
        >
          <Text style={styles.buttonText}>關閉</Text>
        </Pressable>
      </PopupModal>
      {/* Regis Modal */}
      <PopupModal
        isVisible={isRegisterModalVisible}
        onClose={() => setRegisterModalVisible(false)}
        header={ModalType.REGISTER}
      >
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

        <Pressable
          style={styles.modalButton}
          onPress={() => {
            usernameRegisterInput?.clear();
            passwordRegisterInput?.clear();
            userRegister(account, password);
            setRegisterModalVisible(false);
          }}
        >
          <Text style={styles.buttonText}>提交</Text>
        </Pressable>

        <Pressable
          style={styles.modalButton}
          onPress={() => setRegisterModalVisible(false)}
        >
          <Text style={styles.buttonText}>關閉</Text>
        </Pressable>
      </PopupModal>
      {/* User info Modal */}
      <PopupModal
        isVisible={isUserModalVisible}
        onClose={() => setUserModalVisible(false)}
        header={ModalType.USER}
      >
        <Text style={styles.modalInputLabel}>
          {"使用者名稱: " + user.account}
        </Text>

        <Pressable
          onPress={() => {
            userDelete(store.getState().user.id);
            setUserModalVisible(false);
          }}
          style={styles.modalButton}
        >
          <Text style={styles.buttonText}>刪除使用者</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            userLogout();
            setUserModalVisible(false);
          }}
          style={styles.modalButton}
        >
          <Text style={styles.buttonText}>登出</Text>
        </Pressable>

        <Pressable
          style={styles.modalButton}
          onPress={() => setUserModalVisible(false)}
        >
          <Text style={styles.buttonText}>關閉</Text>
        </Pressable>
      </PopupModal>
      {/* Sport Modal */}
      <PopupModal
        isVisible={isSportModalVisible}
        onClose={() => setSportModalVisible(false)}
        header={ModalType.SPORT}
      >
        {sportList.map((option) => (
          <RadioButton
            key={option.id}
            label={option.sportName}
            isSelected={sport.includes(option.id)}
            onSelect={() => {
              setSport((pre) =>
                pre.includes(option.id)
                  ? pre.filter((item) => item !== option.id)
                  : [...pre, option.id]
              );
            }}
          />
        ))}
        <Pressable
          style={styles.modalButton}
          onPress={() => {
            userSetSports(sport);
            setSportModalVisible(false);
          }}
        >
          <Text style={styles.buttonText}>儲存</Text>
        </Pressable>
      </PopupModal>
      {/* Habit Modal */}
      <PopupModal
        isVisible={isHabitModalVisible}
        onClose={() => setHabitModalVisible(false)}
        header={ModalType.HABIT}
      >
        {habitList.map((option) => (
          <RadioButton
            key={option.id}
            label={option.habitName}
            isSelected={habit.includes(option.id)}
            onSelect={() => {
              setHabit((pre) =>
                pre.includes(option.id)
                  ? pre.filter((item) => item !== option.id)
                  : [...pre, option.id]
              );
            }}
          />
        ))}
        <Pressable
          style={styles.modalButton}
          onPress={() => {
            userSetHabits(habit);
            setHabitModalVisible(false);
          }}
        >
          <Text style={styles.buttonText}>儲存</Text>
        </Pressable>
      </PopupModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  userInfoButton: {
    height: 30,
    backgroundColor: "#2196F3",
    borderRadius: 5,
    justifyContent: "center",
    padding: 10,
  },
  bodySection: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF01",
    alignItems: "center",
    justifyContent: "center",
    padding: "3%",
    paddingBottom: 80,
  },
  // Widget
  customWidgetStyle: {},
  widgetText: {
    color: "white",
    fontSize: 16,
  },
  // Modal
  modalButton: {
    backgroundColor: "#2196F3",
    borderRadius: 10,
    justifyContent: "center",
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
  linkText: {
    color: "gray",
    textDecorationLine: "underline",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
});
