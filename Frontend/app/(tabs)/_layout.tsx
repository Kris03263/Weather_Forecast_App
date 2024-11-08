import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { StyleSheet } from "react-native";
import { Provider, useSelector } from "react-redux";
import { Tabs } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import io from "socket.io-client";

import { useColorScheme } from "@/hooks/useColorScheme";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import store from "@/redux/store";
import {
  updateWeatherData3h,
  updateWeatherData12h,
} from "@/redux/weatherDataSlice";
import { setRegion, updateRegion } from "@/redux/regionListSlice";
import {
  setSelectedRegionIndex,
  setSelectedTimeInterval,
} from "@/redux/selecterSlice";
import { removeUser, setUser } from "@/redux/userSlice";
import { setUserSettings } from "@/redux/userSettingsSlice";
import { updateDailySug } from "@/redux/dailySugSlice";
import { MessageModal } from "@/components/MessageModal";
import { setMessage, setVisible } from "@/redux/globalMessageSlice";
import { MenuProvider } from "react-native-popup-menu";

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
  // FETCH
  const user = await HandleUserLogin(_account, _password);

  // ERROR HANDLE
  if (!user) {
    return;
  }

  // STORE
  store.dispatch(setUser(user));
  AsyncStorage.setItem("userID", user.id);

  // UPDATE
  await Promise.all([updateUserSettings(), updateDailySuggestions()]);

  console.log("Login as " + user.account);
};
export const userLogout = async () => {
  // STORE
  AsyncStorage.setItem("userID", "-1");
  store.dispatch(removeUser());

  console.log("Logged out");
};
export const userDelete = async () => {
  // GET
  let userID = store.getState().user?.id ?? "";
  if (!userID) {
    userID = (await AsyncStorage.getItem("userID")) || "-1";
  }

  // FETCH
  const response = await HandleDeleteUser(userID);

  // ERROR HANDLE
  if (!response) {
    return;
  }

  // STORE
  AsyncStorage.setItem("userID", "-1");
  store.dispatch(removeUser());

  // AFTER
  await Promise.all([userLogout()]);

  console.log("Delete with response: " + response.status);
};
export const userRegister = async (_account: string, _password: string) => {
  // FETCH
  const user = await HandleSetUser(_account, _password);

  // ERROR HANDLE
  if (!user) {
    return;
  }

  // STORE
  store.dispatch(setUser(user));
  AsyncStorage.setItem("userID", user.id);

  // UPDATE
  await Promise.all([userLogin(_account, _password)]);

  console.log("Register as " + user.account);
};
export const userSetSports = async (_sportIDs: number[]) => {
  // GET
  const habit = store.getState().userSettings?.habit ?? [];
  let userID = store.getState().user?.id ?? "";
  if (!userID) {
    userID = (await AsyncStorage.getItem("userID")) || "-1";
  }

  // FETCH
  const response = await HandleSetUserSports(userID, _sportIDs);
  const sports = await HandleGetUserSports(userID);

  // ERROR HANDLE
  if (!sports || !response) {
    return;
  }

  // STORE
  store.dispatch(
    setUserSettings({
      sport: sports,
      habit: habit,
    })
  );

  console.log("Set sports with response: " + response.Status);
};
export const userSetHabits = async (_habitIDs: number[]) => {
  // GET
  const sport = store.getState().userSettings?.sport ?? [];
  let userID = store.getState().user?.id ?? "";
  if (!userID) {
    userID = (await AsyncStorage.getItem("userID")) || "-1";
  }

  // FETCH
  const response = await HandleSetUserHabits(userID, _habitIDs);
  const habits = await HandleGetUserHabits(userID);

  // ERROR HANDLE
  if (!habits || !response) {
    return;
  }

  // STORE
  store.dispatch(
    setUserSettings({
      sport: sport,
      habit: habits,
    })
  );

  console.log("Set habits with response: " + response.Status);
};
export const userAddRegion = async (_region: Region) => {
  // GET
  let regions = store.getState().region ?? [];
  if (regions.length === 0) {
    regions = JSON.parse((await AsyncStorage.getItem("regions")) || "[]");
  }

  // ERROR HANDLE
  if (regions.find((region) => region.id === _region.id)) {
    console.error("Region already exists");
    return;
  }

  // STORE
  store.dispatch(setRegion([...regions, _region]));
  AsyncStorage.setItem("regions", JSON.stringify([...regions, _region]));

  // BEFORE UPDATE
  await Promise.all([
    updateWeatherData_3h(_region),
    updateWeatherData_12h(_region),
  ]);

  console.log("Added region: " + _region.name);
  console.log("Region list: " + JSON.stringify(store.getState().region));
};
export const userRemoveRegion = async (_region: Region) => {
  // GET
  let regions = store.getState().region ?? [];
  if (regions.length === 0) {
    regions = JSON.parse((await AsyncStorage.getItem("regions")) || "[]");
  }

  // ERROR HANDLE
  if (!regions.find((region) => region.id === _region.id)) {
    setNotification(`${_region.name} 不存在`);
    return;
  }

  // STORE
  store.dispatch(setRegion(regions.filter((r) => r.id !== _region.id)));
  AsyncStorage.setItem(
    "regions",
    JSON.stringify(regions.filter((r) => r.id !== _region.id))
  );

  // BEFORE UPDATE
  await Promise.all([
    updateWeatherData_3h(_region),
    updateWeatherData_12h(_region),
  ]);

  console.log("Added region: " + _region.name);
  console.log("Region list: " + JSON.stringify(store.getState().region));
};
export const getAllRegionList = async (): Promise<RegionList> => {
  // FETCH
  const regionList = await HandleGetAllRegion();

  // ERROR HANDLE
  if (!regionList) {
    return { city: {} } as RegionList;
  }

  // RETURN
  return regionList;
};
export const getAllSportList = async (): Promise<Sport[]> => {
  // FETCH
  const sportList = await HandleGetAllSport();

  // ERROR HANDLE
  if (!sportList) {
    return [] as Sport[];
  }

  // RETURN
  return sportList;
};
export const getAllHabitList = async (): Promise<Habit[]> => {
  // FETCH
  const habitList = await HandleGetAllHabit();

  // ERROR HANDLE
  if (!habitList) {
    return [] as Habit[];
  }

  // RETURN
  return habitList;
};
export const updateRegion0 = async () => {
  // GET
  let regions = store.getState().region ?? [];
  if (regions.length === 0) {
    regions = JSON.parse((await AsyncStorage.getItem("regions")) || "[]");
  }

  // FETCH
  const region = await HandleGetLocation();

  // ERROR HANDLE
  if (!region) {
    return;
  }

  // STORE
  store.dispatch(updateRegion(region));
  AsyncStorage.setItem(
    "regions",
    JSON.stringify([region, ...regions.filter((_, i) => i !== 0)])
  );

  // BEFORE UPDATE
  await Promise.all([updateRegionList()]);

  console.log("Updated region[0] to: " + region.name);
  console.log("Region list: " + JSON.stringify(store.getState().region));
};
export const updateRegionList = async () => {
  // GET
  let regions = store.getState().region ?? [];
  if (regions.length === 0) {
    regions = JSON.parse((await AsyncStorage.getItem("regions")) || "[]");
  }

  // STORE
  store.dispatch(setRegion(regions));
  AsyncStorage.setItem("regions", JSON.stringify(regions));

  // AFTER UPDATE
  await Promise.all([updateWeatherData_3h(), updateWeatherData_12h()]);

  console.log("Updated regions");
  console.log("Region list: " + JSON.stringify(store.getState().region));
};
export const updateWeatherData_3h = async (_region?: Region) => {
  // GET
  let regions = _region ? [_region] : store.getState().region ?? [];
  if (regions.length === 0) {
    regions = JSON.parse((await AsyncStorage.getItem("regions")) || "[]");
  }

  await Promise.all(
    regions.map(async (region) => {
      // FETCH
      const weatherData3h = await HandleGetWeatherData3h(region);

      // ERROR HANDLING
      if (!weatherData3h) return null;

      // STORE
      store.dispatch(updateWeatherData3h(weatherData3h));
    })
  );

  console.log(
    "Updated weather data (3h) for: " + (_region ? _region.name : "all regions")
  );
};
export const updateWeatherData_12h = async (_region?: Region) => {
  // GET
  let regions = _region ? [_region] : store.getState().region ?? [];
  if (regions.length === 0) {
    regions = JSON.parse((await AsyncStorage.getItem("regions")) || "[]");
  }

  await Promise.all(
    regions.map(async (region) => {
      // FETCH
      const weatherData12h = await HandleGetWeatherData12h(region);

      // ERROR HANDLING
      if (!weatherData12h) return null;

      // STORE
      store.dispatch(updateWeatherData12h(weatherData12h));
    })
  );

  console.log(
    "Updated weather data (12h) for: " +
      (_region ? _region.name : "all regions")
  );
};
export const updateUser = async () => {
  // GET
  let userID = store.getState().user?.id ?? "";
  if (!userID) {
    userID = (await AsyncStorage.getItem("userID")) || "-1";
  }

  // CHECK
  if (userID === "-1") return;

  // FETCH
  const user = await HandleGetUser(userID);

  // STORE
  store.dispatch(
    setUser(user ?? { id: "-1", account: "", password: "", status: "" })
  );
  AsyncStorage.setItem("userID", user?.id ?? "-1");

  // AFTER
  await Promise.all([updateUserSettings(), updateDailySuggestions()]);

  console.log("Updated user");
};
export const updateDailySuggestions = async () => {
  // GET
  let userID = store.getState().user?.id ?? "";
  let regions = store.getState().region ?? [];
  if (!userID) {
    userID = (await AsyncStorage.getItem("userID")) || "-1";
  }
  if (regions.length === 0) {
    regions = JSON.parse((await AsyncStorage.getItem("regions")) || "[]");
  }

  // FETCH
  const dailySuggestions = (await HandleGetDailySug(userID, regions[0])) ?? {};

  // STORE
  store.dispatch(updateDailySug(dailySuggestions));

  console.log("Updated daily suggestions");
};
export const updateUserSettings = async () => {
  // GET
  let userID = store.getState().user?.id ?? "";
  if (!userID) {
    userID = (await AsyncStorage.getItem("userID")) || "-1";
  }

  // CHECK
  if (userID === "-1") return;

  // FETCH
  const userSettings = {
    sport: (await HandleGetUserSports(userID)) ?? [],
    habit: (await HandleGetUserHabits(userID)) ?? [],
  };

  // STORE
  store.dispatch(setUserSettings(userSettings));
  AsyncStorage.setItem("userSettings", JSON.stringify(userSettings));

  console.log("Updated user settings");
};
export const requestLocationPermission = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();

  return status == "granted";
};
export const setNotification = async (message: string) => {
  store.dispatch(setMessage(message));
  store.dispatch(setVisible(true));
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
    setNotification(String(e));
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
    setNotification(String(e));
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
    setNotification(String(e));
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
    setNotification(String(e));
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
    setNotification(String(e));
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
    setNotification(String(e));
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
    setNotification(String(e));
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
    setNotification(String(e));
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
    setNotification(String(e));
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
    setNotification(String(e));
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
    setNotification(`獲取 ${_region} 3h 資料失敗 \n錯誤訊息: ` + String(e));
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
    setNotification(`獲取 ${_region} 12h 資料失敗 \n錯誤訊息: ` + String(e));
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
    setNotification(String(e));
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
    setNotification(String(e));
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
    setNotification(String(e));
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
    setNotification(String(e));
    return null;
  }
};

export default function TabLayout() {
  const [serverMessages, setServerMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [serverMessage, setServerMessage] = useState("");

  useEffect(() => {
    // Update current location and current time every minute
    const Update = async () => {
      console.log("Updating data......");

      await Promise.all([updateRegion0(), updateRegionList(), updateUser()]);

      console.log(
        "-----------------------------------------------------\n" +
          `| ${new Date()} \t|` +
          "\n" +
          "-----------------------------------------------------\n" +
          "| Data update success! \t\t\t\t\t\t\t\t|" +
          "\n" +
          "-----------------------------------------------------\n"
      );
    };

    const init = async () => {
      // var ws = new WebSocket(hostURL);
      // const testMsg = {
      //   userID: 1,
      //   longitude: "120.62343304881064",
      //   latitude: "24.21694034808",
      // };

      // ws.onopen = () => {
      //   setNotification("連接 WebSocket 成功");
      //   setConnectionStatus("Connected");

      //   if (ws.readyState === WebSocket.OPEN) {
      //     ws.send(JSON.stringify(testMsg));
      //     setNotification("訊息已發送");
      //   } else {
      //     setNotification("WebSocket 未連接，無法發送訊息");
      //   }
      // };
      // ws.onerror = (error) => {
      //   setNotification(`連接 WebSocket 失敗: ${error}`);
      //   setConnectionStatus("Disconnected");
      // };
      // ws.onclose = (event) => {
      //   setNotification(
      //     `已斷開 WebSocket 連線: (${event.code}) ${event.reason}`
      //   );
      //   setConnectionStatus("Disconnected");
      // };
      // ws.onmessage = (e) => {
      //   console.log("aaaa");
      //   console.log(e.data);
      // };

      // const socket = io(hostURL, {
      //   transports: ["websocket", "polling"],
      //   reconnectionAttempts: 5,
      //   timeout: 2000,
      // });

      // // 連接成功事件
      // socket.on("connect", () => {
      //   setNotification("Connected to server");
      //   setConnectionStatus("Connected");
      //   // 設置位置（選擇真實或假資料）
      //   // socket.emit("set_location", {
      //   //   userID: 1,
      //   //   longitude: "120.62343304881064",
      //   //   latitude: "24.21694034808",
      //   // });
      //   // 或者
      //   socket.emit("set_location_fake", {
      //     userID: 1,
      //     longitude: "120.62343304881064",
      //     latitude: "24.21694034808",
      //   });
      //   socket.send({
      //     userID: 1,
      //     longitude: "120.62343304881064",
      //     latitude: "24.21694034808",
      //   });
      // });
      // // // 連接失敗事件
      // socket.on("connect_error", () => {
      //   setNotification("連接WebSocket失敗");
      //   setConnectionStatus("Disconnected");
      // });
      // // 註冊成功事件
      // socket.on("registration_success", (data) => {
      //   setNotification(data.message);
      // });
      // // 地震更新事件（真實資料）
      // socket.on("earthquake_update", (data) => {
      //   setNotification(`Received earthquake update: ${data}`); // 更新 UI 或顯示地震通知
      // });
      // // 地震更新事件（假資料）
      // socket.on("earthquake_update_fake", (data) => {
      //   setNotification(`Received earthquake update: ${data}`);
      // });
      // // 錯誤事件
      // socket.on("error", (error) => {
      //   setNotification(error.message);
      // });
      // // 斷開連接事件
      // socket.on("disconnect", (event) => {
      //   setNotification("Disconnected from WebSocket : ");
      //   setConnectionStatus("Disconnected");
      // });

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
    const ws = new WebSocket(hostURL);
    const testMsg = {
      userID: 1,
      longitude: "120.62343304881064",
      latitude: "24.21694034808",
    };

    ws.onopen = () => {
      setNotification("WebSocket connection opened");
      ws.send(JSON.stringify(testMsg)); // Send a test message to the server
      setIsConnected(true); // Update state to reflect successful connection
    };

    ws.onmessage = (e) => {
      setNotification("Message from server:" + e.data);
      setServerMessage(e?.data); // Store the server message
    };

    ws.onerror = (e) => {
      setNotification("WebSocket error:" + e);
      setIsConnected(false); // Update state if there is an error
    };

    ws.onclose = (e) => {
      setNotification("WebSocket connection closed:" + e.code + e.reason);
      setIsConnected(false); // Update state if the connection closes
    };

    // Clean up WebSocket connection when the component unmounts
    return () => {
      ws.close();
    };
  }, []);

  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <MenuProvider>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: "white", // 設置圖標為白色
            tabBarInactiveTintColor: "white", // 未選中的圖標顏色
            headerShown: false,
            tabBarStyle: styles.tabBar, // 應用自定義的樣式
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
                  size={20} // 縮小圖標
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
                  size={20} // 縮小圖標
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
                  size={20} // 縮小圖標
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
