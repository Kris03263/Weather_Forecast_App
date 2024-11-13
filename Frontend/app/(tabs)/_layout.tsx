import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { StyleSheet } from "react-native";
import { Provider } from "react-redux";
import { Tabs } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MenuProvider } from "react-native-popup-menu";
import io, { Socket } from "socket.io-client";

import { useColorScheme } from "@/hooks/useColorScheme";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { MessageModal } from "@/components/MessageModal";
import store from "@/redux/store";
import {
  updateWeatherData3h,
  updateWeatherData12h,
} from "@/redux/weatherDataSlice";
import { setRegions } from "@/redux/regionsSlice";
import {
  setSelectedRegionIndex,
  setSelectedTimeInterval,
} from "@/redux/selecterSlice";
import { removeUser, setUser } from "@/redux/userSlice";
import { setHabit, setSport, setUserSettings } from "@/redux/userSettingsSlice";
import { setDailySug } from "@/redux/dailySugSlice";
import { setMessage, setVisible } from "@/redux/globalMessageSlice";

// TODO list:
// - [V] Add weather data API
// - [V] Add weather image
// - [X] Fix muti-day weather forecast view (Cancel)
// - [ ] Switch to use region name to fetch weather data
// - [V] Switch to use Redux for global state management
// - [V] Move weatherDataList, region, currentTime to index.tsx
// - [V] Use a global variable to save wrong msg
// - [X] Move background color control to _layout.tsx (Instead moving to Background.tsx)
// - [ ] Change region-selector to number

export interface WeatherDataList {
  [key: string]: WeatherData[][];
}
export interface WeatherData {
  [key: string]: string;
}
export const indicatorsDictionary = {
  aqi: {
    title: "空氣品質",
    unit: "",
    value: "",
  },
  bodyTemp: {
    title: "體感溫度",
    unit: "°C",
    value: "",
  },
  "pm2.5": {
    title: "PM2.5指標",
    unit: "μg/m³",
    value: "",
  },
  rainRate: {
    title: "降雨機率",
    unit: "%",
    value: "",
  },
  temp: {
    title: "溫度",
    unit: "°C",
    value: "",
  },
  wet: {
    title: "濕度",
    unit: "%",
    value: "",
  },
  windDirection: {
    title: "風向",
    unit: "",
    value: "",
  },
  windSpeed: {
    title: "風速",
    unit: "m/s",
    value: "",
  },
};
export interface Region {
  id: string;
  name: string;
  longitude: string;
  latitude: string;
}
export interface RegionList {
  city: {
    [key: string]: string[];
  };
}
export interface Selecter {
  regionIndex: number;
  timeInterval: number;
  targetRegionIndex: number;
}
export interface User {
  account: string;
  password: string;
  id: string;
  status: string;
}
export interface Sport {
  sportName: string;
  id: number;
}
export interface Habit {
  habitName: string;
  id: number;
}
export interface UserSettings {
  sport: Sport[];
  habit: Habit[];
}
export interface DailySug {
  [key: string]: { name: string; suggestion: string }[];
}
export interface GlobalMessage {
  message: string;
  isVisible: boolean;
}

//////////////////////
// Define functions //
//////////////////////

export const userLogin = async (_account: string, _password: string) => {
  const user = await HandleUserLogin(_account, _password);
  if (!user) return;

  store.dispatch(setUser(user));
  AsyncStorage.setItem("userID", user.id);

  await Promise.all([updateUserSettings(), updateDailySuggestions()]);

  console.log("Login as " + user.account);
};
export const userLogout = async () => {
  store.dispatch(removeUser());
  AsyncStorage.setItem("userID", "-1");

  console.log("Logged out");
};
export const userDelete = async (_userID: string) => {
  const response = await HandleDeleteUser(_userID);
  if (!response) return;

  store.dispatch(removeUser());
  AsyncStorage.setItem("userID", "-1");

  console.log("Delete with response: " + response.status);
};
export const userRegister = async (_account: string, _password: string) => {
  const user = await HandleSetUser(_account, _password);
  if (!user) return;

  store.dispatch(setUser(user));
  AsyncStorage.setItem("userID", user.id);

  await Promise.all([userLogin(_account, _password)]);

  console.log("Register as " + user.account);
};
export const userSetSports = async (_sportIDs: number[]) => {
  const userID = store.getState().user.id;

  const response = await HandleSetUserSports(userID, _sportIDs);
  const sports = await HandleGetUserSports(userID);
  if (!sports || !response) return;

  store.dispatch(setSport(sports));

  console.log("Set sports with response: " + response.Status);
};
export const userSetHabits = async (_habitIDs: number[]) => {
  const userID = store.getState().user.id;

  const response = await HandleSetUserHabits(userID, _habitIDs);
  const habits = await HandleGetUserHabits(userID);

  if (!habits || !response) return;

  store.dispatch(setHabit(habits));

  console.log("Set habits with response: " + response.Status);
};
export const userAddRegion = async (_city: string, _district: string) => {
  const regions = store.getState().regions;
  const _region: Region = {
    id: `${_city}${_district}`,
    name: `${_city}, ${_district}`,
    longitude: "-1",
    latitude: "-1",
  };

  if (!_city || !_district) {
    showNotification("地區資料不完整");
    return;
  }
  if (regions.find((region) => region.id === _region.id)) {
    showNotification(`${_region.name} 已存在`);
    return;
  }

  store.dispatch(setRegions([...regions, _region]));
  AsyncStorage.setItem("regions", JSON.stringify([...regions, _region]));

  await Promise.all([
    updateWeatherData_3h(_region),
    updateWeatherData_12h(_region),
  ]);

  console.log("Added region: " + _region.name);
  console.log("Region list: " + JSON.stringify(store.getState().regions));
};
export const userRemoveRegion = async (_index: number) => {
  const regions = store.getState().regions;

  // Consider to remove this
  // if (!regions.find((r, index) => index === _index)) {
  //   showNotification(`${regions[_index]} 不存在`);
  //   return;
  // }

  store.dispatch(setRegions(regions.filter((r, index) => index !== _index)));
  AsyncStorage.setItem(
    "regions",
    JSON.stringify(regions.filter((r, index) => index !== _index))
  );

  await Promise.all([
    updateWeatherData_3h(regions[_index]),
    updateWeatherData_12h(regions[_index]),
  ]);

  console.log("Added region: " + regions[_index].name);
  console.log("Region list: " + JSON.stringify(store.getState().regions));
};
export const getAllRegionList = async (): Promise<RegionList> => {
  const regionList = await HandleGetAllRegion();

  return regionList ?? ({} as RegionList);
};
export const getAllSportList = async (): Promise<Sport[]> => {
  const sportList = await HandleGetAllSport();

  return sportList ?? [];
};
export const getAllHabitList = async (): Promise<Habit[]> => {
  const habitList = await HandleGetAllHabit();

  return habitList ?? [];
};
export const updateRegion0 = async () => {
  const regions = store.getState().regions;

  const region = await HandleGetLocation();
  if (!region) return;

  store.dispatch(setRegions([region, ...regions.filter((_, i) => i !== 0)]));
  AsyncStorage.setItem(
    "regions",
    JSON.stringify([region, ...regions.filter((_, i) => i !== 0)])
  );

  await Promise.all([
    updateWeatherData_3h(region),
    updateWeatherData_12h(region),
  ]);

  console.log("Updated region[0] to: " + region.name);
  console.log("Region list: " + JSON.stringify(store.getState().regions));
};
export const updateRegions = async () => {
  const regions = store.getState().regions;

  store.dispatch(setRegions(regions));
  AsyncStorage.setItem("regions", JSON.stringify(regions));

  await Promise.all([updateWeatherData_3h(), updateWeatherData_12h()]);

  console.log("Updated all regions");
  console.log("Region list: " + JSON.stringify(store.getState().regions));
};
export const updateWeatherData_3h = async (_region?: Region) => {
  const regions = _region ? [_region] : store.getState().regions;

  await Promise.all(
    regions.map(async (region) => {
      const weatherData3h = (await HandleGetWeatherData3h(region)) ?? [];

      store.dispatch(updateWeatherData3h(weatherData3h));
    })
  );

  console.log(
    "Updated weather data (3h) for: " + (_region ? _region.name : "all regions")
  );
};
export const updateWeatherData_12h = async (_region?: Region) => {
  const regions = _region ? [_region] : store.getState().regions;

  await Promise.all(
    regions.map(async (region) => {
      const weatherData12h = (await HandleGetWeatherData12h(region)) ?? [];

      store.dispatch(updateWeatherData12h(weatherData12h));
    })
  );

  console.log(
    "Updated weather data (12h) for: " +
      (_region ? _region.name : "all regions")
  );
};
export const updateUser = async () => {
  const userID = store.getState().user.id;

  if (userID === "-1") return;

  const user = await HandleGetUser(userID);
  if (!user) return;

  store.dispatch(setUser(user));
  AsyncStorage.setItem("userID", user?.id ?? "-1");

  await Promise.all([updateUserSettings(), updateDailySuggestions()]);

  console.log("Updated user");
};
export const updateDailySuggestions = async () => {
  let userID = store.getState().user.id;
  let regions = store.getState().regions;

  const dailySuggestions = (await HandleGetDailySug(userID, regions[0])) ?? {};

  store.dispatch(setDailySug(dailySuggestions));

  console.log("Updated daily suggestions");
};
export const updateUserSettings = async () => {
  let userID = store.getState().user.id;

  if (userID === "-1") return;

  const userSettings = {
    sport: (await HandleGetUserSports(userID)) ?? [],
    habit: (await HandleGetUserHabits(userID)) ?? [],
  };

  store.dispatch(setUserSettings(userSettings));
  AsyncStorage.setItem("userSettings", JSON.stringify(userSettings));

  console.log("Updated user settings");
};
export const requestLocationPermission = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();

  return status == "granted";
};
export const showNotification = async (message: string) => {
  store.dispatch(setMessage(message));
  store.dispatch(setVisible(true));
};
export const syncLocalDataToGlobal = async () => {
  const userID = (await AsyncStorage.getItem("userID")) ?? "-1";
  const regions = JSON.parse((await AsyncStorage.getItem("regions")) ?? "[]");
  const userSettings = JSON.parse(
    (await AsyncStorage.getItem("userSettings")) ?? "{}"
  );

  console.log("local data: ", userID, regions, userSettings);

  store.dispatch(
    setUser({ id: userID, account: "", password: "", status: "" })
  );
  store.dispatch(setRegions(regions));
  store.dispatch(setUserSettings(userSettings));

  console.log("Synced local data to global");
};

//////////////////
// API fetching // (Return null & set global err msg if catch error)
//////////////////

const hostURL = "https://420269.xyz/"; //`https://weather-2-10.onrender.com/` `http://34.49.99.63/` `http://34.110.138.136/`

const HandleSetUser = async (
  _account: string,
  _password: string
): Promise<User | null> => {
  try {
    const data = await fetch(`${hostURL}/Users/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userAccount: _account,
        password: _password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        return data as User;
      });

    if (data.id == "-1") {
      throw new Error(data.status);
    }

    return data;
  } catch (e) {
    showNotification(String(e));
    return null;
  }
};
const HandleGetUser = async (_userID: string): Promise<User | null> => {
  try {
    const data = await fetch(`${hostURL}/Users/?id=${_userID}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        return data as User;
      });

    if (data.id == "-1") {
      throw new Error(data.status);
    }

    return data;
  } catch (e) {
    showNotification(String(e));
    return null;
  }
};
const HandleDeleteUser = async (_userID: string): Promise<any> => {
  try {
    const response = await fetch(`${hostURL}/Users/`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
      body: JSON.stringify({
        userID: _userID,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      });

    if (response.status !== "Successful") {
      throw new Error(response.status);
    }

    return response;
  } catch (e) {
    showNotification(String(e));
    return null;
  }
};
const HandleUserLogin = async (
  _account: string,
  _password: string
): Promise<User | null> => {
  try {
    const data = await fetch(`${hostURL}/Users/Login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userAccount: _account,
        password: _password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        return data as User;
      });

    if (data.id == "-1") {
      throw new Error(data.status);
    }

    return data;
  } catch (e) {
    showNotification(String(e));
    return null;
  }
};
const HandleSetUserSports = async (
  _userID: string,
  _sportIDs: number[]
): Promise<any> => {
  try {
    const response = await fetch(`${hostURL}/Users/UserSports`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        userID: _userID,
        sportIDs: _sportIDs,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      });

    if (response.Status !== "Update Successful !") {
      throw new Error(response.status);
    }

    return response;
  } catch (e) {
    showNotification(String(e));
    return null;
  }
};
const HandleGetUserSports = async (
  _userID: string
): Promise<Sport[] | null> => {
  try {
    const data = await fetch(`${hostURL}/Users/UserSports?ID=${_userID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        return data as Sport[];
      });

    if (data[0]?.id == -1) {
      throw new Error(data[0].sportName);
    }

    return data;
  } catch (e) {
    showNotification(String(e));
    return null;
  }
};
const HandleSetUserHabits = async (
  _userID: string,
  _habitIDs: number[]
): Promise<any> => {
  try {
    const response = await fetch(`${hostURL}/Users/UserHabits`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        userID: _userID,
        habitIDs: _habitIDs,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      });

    if (response.Status !== "Update Successful !") {
      throw new Error(response.status);
    }

    return response;
  } catch (e) {
    showNotification(String(e));
    return null;
  }
};
const HandleGetUserHabits = async (
  _userID: string
): Promise<Habit[] | null> => {
  try {
    const data = await fetch(`${hostURL}/Users/UserHabits?ID=${_userID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return data as Habit[];
      });

    if (data[0]?.id == -1) {
      throw new Error(data[0].habitName);
    }

    return data;
  } catch (e) {
    showNotification(String(e));
    return null;
  }
};
// Need fix
const HandleGetLocation = async (): Promise<Region | null> => {
  try {
    if (!(await requestLocationPermission())) {
      throw new Error("Location permission denied");
    }

    const position = await Location.getCurrentPositionAsync({});

    if (!position) {
      throw new Error("Location not found");
    }

    // Make HandleGetRegionCoords() instead of this
    const weatherData = await HandleGetWeatherDataCoords(
      position.coords.latitude.toString(),
      position.coords.longitude.toString()
    );

    if (!weatherData) {
      throw new Error("Weather data is empty");
    }

    const region: Region = {
      id: "0",
      name: `${weatherData[0].city}, ${weatherData[0].district}`,
      longitude: position.coords.longitude.toString(),
      latitude: position.coords.latitude.toString(),
    };

    return region;
  } catch (e) {
    showNotification(String(e));
    return null;
  }
};
// Change to HandleGetRegionCoords()
const HandleGetWeatherDataCoords = async (
  _latitude: string,
  _longitude: string
): Promise<WeatherData[] | null> => {
  try {
    const data = await fetch(`${hostURL}/Weather/Get3hData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        longitude: _longitude,
        latitude: _latitude,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        return data as WeatherData[];
      });

    return data;
  } catch (e) {
    showNotification(String(e));
    return null;
  }
};
const HandleGetWeatherData3h = async (
  _region: Region,
  _userID?: string
): Promise<WeatherData[] | null> => {
  try {
    const [city, district] = _region.name.split(", ");
    const data = await fetch(`${hostURL}/Weather/Get3hData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID: _userID ?? "-1",
        longitude: "0",
        latitude: "0",
        cusloc: {
          city: city,
          district: district,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        return data as WeatherData[];
      });

    return data;
  } catch (e) {
    showNotification(`獲取 ${_region} 3h 資料失敗 \n錯誤訊息: ` + String(e));
    return null;
  }
};
const HandleGetWeatherData12h = async (
  _region: Region,
  _userID?: string
): Promise<WeatherData[] | null> => {
  try {
    const [city, district] = _region.name.split(", ");
    const data = await fetch(`${hostURL}/Weather/Get12hData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID: _userID ?? "-1",
        longitude: "0",
        latitude: "0",
        cusloc: {
          city: city,
          district: district,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      });

    return data;
  } catch (e) {
    showNotification(`獲取 ${_region} 12h 資料失敗 \n錯誤訊息: ` + String(e));
    return null;
  }
};
const HandleGetDailySug = async (
  _userID: string,
  _region: Region
): Promise<DailySug | null> => {
  try {
    const [city, district] = _region.name.split(", ");
    const data = await fetch(`${hostURL}/Users/GetDailySuggestion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID: _userID,
        longitude: "0",
        latitude: "0",
        cusloc: {
          city: city,
          district: district,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        return data as DailySug;
      });

    return data;
  } catch (e) {
    showNotification(String(e));
    return null;
  }
};
const HandleGetAllRegion = async (): Promise<RegionList | null> => {
  try {
    const data = await fetch(`${hostURL}/Users/GetAllRegion`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        return data as RegionList;
      });

    return data;
  } catch (e) {
    showNotification(String(e));
    return null;
  }
};
const HandleGetAllSport = async (): Promise<Sport[] | null> => {
  try {
    const data = await fetch(`${hostURL}/Users/GetAllSportsOption`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        return data as Sport[];
      });

    return data;
  } catch (e) {
    showNotification(String(e));
    return null;
  }
};
const HandleGetAllHabit = async (): Promise<Habit[] | null> => {
  try {
    const data = await fetch(`${hostURL}/Users/GetAllHabitsOption`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        return data as Habit[];
      });

    return data;
  } catch (e) {
    showNotification(String(e));
    return null;
  }
};

export default function TabLayout() {
  const [socketInstance, setSocketInstance] = useState<Socket>();
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    // Update current location and current time every minute
    const Update = async () => {
      console.log("Updating data......");

      await syncLocalDataToGlobal();
      await Promise.all([updateRegion0(), updateRegions(), updateUser()]);

      console.log(
        "-----------------------------------------------------\n" +
          `| ${new Date()} \t|` +
          "\n" +
          "-----------------------------------------------------\n" +
          "| Data update success! \t\t\t\t\t\t\t\t|" +
          "\n" +
          "-----------------------------------------------------\n" +
          JSON.stringify(store.getState().regions)
      );
    };

    const init = async () => {
      // Set default region and time interval
      store.dispatch(setSelectedRegionIndex(0));
      store.dispatch(setSelectedTimeInterval(0));
    };

    init();
    Update();
    const interval = setInterval(async () => {
      await Update();
    }, 300000); // Time gap (ms)

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const socket = io("https://420269.xyz/", {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
    });

    setSocketInstance(socket);

    socket.on("connect", () => {
      showNotification(`連接 WebSocket (id: ${socket.id}) 成功`);
      setIsConnected(true);
      // 設置位置（選擇真實或假資料）
      socket.emit("set_location", {
        userID: 1,
        longitude: "120.62343304881064",
        latitude: "24.21694034808",
      });
      socket.emit("set_location_fake", {
        userID: 1,
        longitude: "120.62343304881064",
        latitude: "24.21694034808",
      });
    });
    socket.on("connect_error", () => {
      showNotification(`連接 WebSocket (id: ${socket.id}) 失敗`);
      setIsConnected(false);
    });
    socket.on("error", (error) => {
      showNotification(`連接 WebSocket 錯誤: ${error.message}`);
      setIsConnected(false);
    });
    socket.on("disconnect", () => {
      showNotification("已斷開 WebSocket 連線");
      setIsConnected(false);
    });
    socket.on("registration_success", (data) => {
      console.log(data.message);
    });
    socket.on("earthquake_update", (data) => {
      showNotification(`收到地震資料: ${JSON.stringify(data)}`); // 更新 UI 或顯示地震通知
    });
    socket.on("earthquake_update_fake", (data) => {
      showNotification(`收到地震資料(測試用): ${JSON.stringify(data)}`);
    });
  }, []);

  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <MenuProvider>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: "white",
            tabBarInactiveTintColor: "white",
            headerShown: false,
            tabBarStyle: styles.tabBar,
          }}
        >
          <Tabs.Screen
            name="menu"
            options={{
              title: "",
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon
                  name={focused ? "menu" : "menu-outline"}
                  color={color}
                  size={20}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="index"
            options={{
              title: "",
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon
                  name={focused ? "home" : "home-outline"}
                  color={color}
                  size={20}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="setting"
            options={{
              title: "",
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon
                  name={focused ? "settings-sharp" : "settings-outline"}
                  color={color}
                  size={20}
                />
              ),
            }}
          />
        </Tabs>
      </MenuProvider>

      <MessageModal />
    </Provider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    position: "absolute",
    height: 60,
    paddingHorizontal: 120,
    paddingBottom: 30,
    paddingTop: 10,
    borderTopWidth: 0,
  },
});
