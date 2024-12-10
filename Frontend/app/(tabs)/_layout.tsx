import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { StyleSheet } from "react-native";
import { Provider } from "react-redux";
import { Tabs } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MenuProvider } from "react-native-popup-menu";
import io, { Socket } from "socket.io-client";
import md5 from "md5";

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
import {
  setHistoryEarthquakeData,
  setRecentEarthquakeData,
} from "@/redux/earthquakeDataSlice";
import { setTyphoonData } from "@/redux/typhoonDataSlice";

// Enums
export enum indicators {
  bodyTemp = "bodyTemp",
  aqi = "aqi",
  pm2_5 = "pm2.5",
  rainRate = "rainRate",
  temp = "temp",
  wet = "wet",
  windDirection = "windDirection",
  windSpeed = "windSpeed",
}
export enum disasterTypes {
  earthquake = "earthquake",
  typhoon = "typhoon",
}

// Dictionary
export const indicatorsDictionary = {
  [indicators.aqi]: {
    title: "空氣品質",
    unit: "",
    value: "",
    svgName: "aqi",
    hasChart: false,
  },
  [indicators.bodyTemp]: {
    title: "體感溫度",
    unit: "°C",
    value: "",
    svgName: "temp",
    hasChart: true,
  },
  [indicators.pm2_5]: {
    title: "PM2.5指標",
    unit: "μg/m³",
    value: "",
    svgName: "pm2_5",
    hasChart: false,
  },
  [indicators.rainRate]: {
    title: "降雨機率",
    unit: "%",
    value: "",
    svgName: "rainRate",
    hasChart: true,
  },
  [indicators.temp]: {
    title: "溫度",
    unit: "°C",
    value: "",
    svgName: "temp",
    hasChart: true,
  },
  [indicators.wet]: {
    title: "濕度",
    unit: "%",
    value: "",
    svgName: "wet",
    hasChart: true,
  },
  [indicators.windDirection]: {
    title: "風向",
    unit: "",
    value: "",
    svgName: "windDirection",
    hasChart: false,
  },
  [indicators.windSpeed]: {
    title: "風速",
    unit: "m/s",
    value: "",
    svgName: "windSpeed",
    hasChart: true,
  },
};

// Interfaces
export interface WeatherDataList {
  [key: string]: WeatherData[][];
}
export interface WeatherData {
  [key: string]: string;
}
export interface EarthquakeDataList {
  recent: EarthquakeData;
  history: EarthquakeData[];
}
export interface EarthquakeData {
  color: string;
  content: string;
  depth: string;
  distance: string;
  intensity: {
    AreaDesc: string;
    AreaIntensity: string;
    CountyName: string;
  }[];
  location: string;
  magnitude: string;
  nowLocationIntensity: string;
  reportImg: string;
  shakeImg: string;
  time: string;
}
export interface TyphoonData {
  cname: string;
  futurePosition: {
    circleOf15Ms: {
      radius: string;
    };
    circleOf25Ms: {
      radius: string;
    };
    coordinate: string;
    futureTime: string;
    maxGustSpeed: string;
    maxWindSpeed: string;
    movingDirection: string;
    movingSpeed: string;
    pressure: string;
    stateTransfers: {
      lang: string;
      value: string;
    }[];
  }[];
  name: string;
  pastPosition: {
    circleOf15Ms: {
      quadrantRadii: {
        radius: {
          dir: string;
          value: string;
        }[];
      };
      radius: string;
    };
    circleOf25Ms: {
      quadrantRadii: {
        radius: {
          dir: string;
          value: string;
        }[];
      };
      radius: string;
    };
    coordinate: string;
    fixTime: string;
    maxGustSpeed: string;
    maxWindSpeed: string;
    movingDirection: string;
    movingPrediction: {
      lang: string;
      value: string;
    }[];
    movingSpeed: string;
    pressure: string;
  };
}
export interface Region {
  id: string; // md5
  city: string;
  district: string;
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
  await userLogout();

  const user = await HandleUserLogin(_account, _password);

  if (!user) {
    showNotification("帳號或密碼錯誤");
    return;
  }

  store.dispatch(setUser(user));
  AsyncStorage.setItem("userID", JSON.stringify(user.id));

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

  if (!response) {
    showNotification("刪除帳號失敗，請稍後再試");
    return;
  }

  store.dispatch(removeUser());
  AsyncStorage.setItem("userID", "-1");

  console.log("Delete with response: " + response.status);
};
export const userRegister = async (_account: string, _password: string) => {
  if (_account === "") {
    showNotification("帳號不可為空");
    return;
  }
  if (_password === "") {
    showNotification("請設定一個密碼");
    return;
  }

  const user = await HandleSetUser(_account, _password);

  if (!user) {
    showNotification("註冊失敗，請稍後再試");
    return;
  }

  store.dispatch(setUser(user));
  AsyncStorage.setItem("userID", JSON.stringify(user.id));

  await Promise.all([userLogin(_account, _password)]);

  console.log("Register as " + user.account);
};
export const userSetSports = async (_sportIDs: number[]) => {
  const userID = store.getState().user.id;

  const response = await HandleSetUserSports(userID, _sportIDs);
  const sports = await HandleGetUserSports(userID);

  if (!sports || !response) {
    showNotification("運動資料更新失敗，請稍後再試");
    return;
  }

  store.dispatch(setSport(sports));

  console.log("Set sports with response: " + response.Status);
};
export const userSetHabits = async (_habitIDs: number[]) => {
  const userID = store.getState().user.id;

  const response = await HandleSetUserHabits(userID, _habitIDs);
  const habits = await HandleGetUserHabits(userID);

  if (!habits || !response) {
    showNotification("喜好資料更新失敗，請稍後再試");
    return;
  }

  store.dispatch(setHabit(habits));

  console.log("Set habits with response: " + response.Status);
};
export const userAddRegion = async (_city: string, _district: string) => {
  const regions = store.getState().regions;
  const _region: Region = {
    id: md5(`${_city}${_district}`),
    city: _city,
    district: _district,
    longitude: "-1",
    latitude: "-1",
  };

  if (!_city || !_district) {
    showNotification("地區資料不完整");
    return;
  }
  if (regions.find((region) => region.id === _region.id)) {
    showNotification(`${_region.city}, ${_region.district} 已存在`);
    return;
  }

  store.dispatch(setRegions([...regions, _region]));
  AsyncStorage.setItem("regions", JSON.stringify([...regions, _region]));

  await Promise.all([
    updateWeatherData_3h(_region),
    updateWeatherData_12h(_region),
  ]);

  console.log(`Added region: ${_region.city}, ${_region.city}`);
  console.log("Region list: " + JSON.stringify(store.getState().regions));
};
export const userRemoveRegion = async (_index: number) => {
  const regions = store.getState().regions;

  if (_index === 0) {
    showNotification("無法刪除目前位置");
    return;
  }
  if (_index >= regions.length) {
    showNotification("地區不存在");
    return;
  }

  store.dispatch(setRegions(regions.filter((r, index) => index !== _index)));
  AsyncStorage.setItem(
    "regions",
    JSON.stringify(regions.filter((r, index) => index !== _index))
  );

  await Promise.all([updateRegions()]);

  console.log(
    `Added region: ${regions[_index].city}, ${regions[_index].district}`
  );
  console.log("Region list: " + JSON.stringify(store.getState().regions));
};
export const getAllRegionList = async (): Promise<RegionList> => {
  const regionList = await HandleGetAllRegion();

  if (!regionList) {
    showNotification("獲取所有地區選項失敗");
    return {} as RegionList;
  }

  return regionList;
};
export const getAllSportList = async (): Promise<Sport[]> => {
  const sportList = await HandleGetAllSport();

  if (!sportList) {
    showNotification("獲取所有運動選項失敗");
    return [];
  }

  return sportList;
};
export const getAllHabitList = async (): Promise<Habit[]> => {
  const habitList = await HandleGetAllHabit();

  if (!habitList) {
    showNotification("獲取所有喜好選項失敗");
    return [];
  }

  return habitList;
};
export const updateEarthquakeData = async () => {
  const userID = store.getState().user.id;
  const regions = store.getState().regions;

  const data = await HandleGetEarthquakeData(
    userID,
    regions[0].latitude,
    regions[0].longitude
  );

  if (!data) {
    showNotification("更新地震資料失敗");
    return;
  }

  store.dispatch(setRecentEarthquakeData(data[0]));
  store.dispatch(setHistoryEarthquakeData(data));

  console.log("Updated earthquake data");
};
export const updateTyphoonData = async (): Promise<void> => {
  const data = await HandleGetTyphoonData();
  if (!data) {
    showNotification("更新颱風資料失敗");
    return;
  }
  store.dispatch(setTyphoonData(data));
};
export const updateRegion0 = async () => {
  const regions = store.getState().regions;

  const region = await HandleGetLocation();

  if (!region) {
    showNotification("獲取目前位置失敗");
    return;
  }

  store.dispatch(setRegions([region, ...regions.filter((_, i) => i !== 0)]));
  AsyncStorage.setItem(
    "regions",
    JSON.stringify([region, ...regions.filter((_, i) => i !== 0)])
  );

  await Promise.all([
    updateWeatherData_3h(region),
    updateWeatherData_12h(region),
  ]);

  console.log(`Updated region[0] to: ${region.city}, ${region.district}`);
};
export const updateRegions = async () => {
  const regions = store.getState().regions;

  store.dispatch(setRegions(regions));
  AsyncStorage.setItem("regions", JSON.stringify(regions));

  await Promise.all([updateWeatherData_3h(), updateWeatherData_12h()]);

  console.log("Updated all regions");
};
export const updateWeatherData_3h = async (_region?: Region) => {
  const userID = store.getState().user.id;
  const regions = _region ? [_region] : store.getState().regions;

  await Promise.all(
    regions.map(async (region) => {
      const weatherData3h = await HandleGetWeatherData3h(userID, region);

      if (!weatherData3h) {
        showNotification(
          `更新${region.city}, ${region.district}天氣資料(3h)失敗`
        );
        return;
      }

      store.dispatch(updateWeatherData3h(weatherData3h));
    })
  );

  console.log(
    _region
      ? `Updated weather data (3h) for: ${_region.city}, ${_region.district}`
      : "Updated weather data (3h) for: all regions"
  );
};
export const updateWeatherData_12h = async (_region?: Region) => {
  const userID = store.getState().user.id;
  const regions = _region ? [_region] : store.getState().regions;

  await Promise.all(
    regions.map(async (region) => {
      const weatherData12h = await HandleGetWeatherData12h(userID, region);

      if (!weatherData12h) {
        showNotification(
          `更新${region.city}, ${region.district}天氣資料(12h)失敗`
        );
        return;
      }

      store.dispatch(updateWeatherData12h(weatherData12h));
    })
  );

  console.log(
    _region
      ? `Updated weather data (12h) for: ${_region.city}, ${_region.district}`
      : "Updated weather data (12h) for: all regions"
  );
};
export const updateUser = async () => {
  const userID = store.getState().user.id;

  if (userID === "-1") return;

  const user = await HandleGetUser(userID);

  if (!user) {
    showNotification("更新使用者資料失敗");
    return;
  }

  store.dispatch(setUser(user));
  AsyncStorage.setItem("userID", user?.id ?? "-1");

  await Promise.all([updateUserSettings(), updateDailySuggestions()]);

  console.log("Updated user");
};
export const updateDailySuggestions = async () => {
  let userID = store.getState().user.id;
  let regions = store.getState().regions;

  const dailySuggestions = await HandleGetDailySug(userID, regions[0]);

  if (!dailySuggestions) {
    showNotification("更新每日建議失敗");
    return;
  }

  store.dispatch(setDailySug(dailySuggestions));

  console.log("Updated daily suggestions");
};
export const updateUserSettings = async () => {
  let userID = store.getState().user.id;

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

  store.dispatch(
    setUser({ id: userID, account: "", password: "", status: "" })
  );
  store.dispatch(setRegions(regions));
  store.dispatch(setUserSettings(userSettings));

  console.log("Synced local data to global");
};

//////////////////
// API fetching //
//////////////////

const hostURL = "https://420269.xyz/";

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
    console.log(
      "HandleSetUser failed! \n" +
        "Sending: \n" +
        JSON.stringify({
          userAccount: _account,
          password: _password,
        }) +
        "Error: \n" +
        String(e)
    );
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
    console.log(
      "HandleGetUser failed! \n" +
        "URL: \n" +
        `${hostURL}/Users/?id=${_userID}` +
        "Error: \n" +
        String(e)
    );
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
    console.log(
      "HandleDeleteUser failed! \n" +
        "Sending: \n" +
        JSON.stringify({
          userID: _userID,
        }) +
        "Error: \n" +
        String(e)
    );
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
    console.log(
      "HandleUserLogin failed! \n" +
        "Sending: \n" +
        JSON.stringify({
          userAccount: _account,
          password: _password,
        }) +
        "Error: \n" +
        String(e)
    );
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
    console.log(
      "HandleSetUserSports failed! \n" +
        "Sending: \n" +
        JSON.stringify({
          userID: _userID,
          sportIDs: _sportIDs,
        }) +
        "Error: \n" +
        String(e)
    );
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
    console.log(
      "HandleGetUserSports failed! \n" +
        "URL: \n" +
        `${hostURL}/Users/UserSports?ID=${_userID}` +
        "Error: \n" +
        String(e)
    );
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
    console.log(
      "HandleSetUserHabits failed! \n" +
        "Sending: \n" +
        JSON.stringify({
          userID: _userID,
          habitIDs: _habitIDs,
        }) +
        "Error: \n" +
        String(e)
    );
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
    console.log(
      "HandleGetUserHabits failed! \n" +
        "URL: \n" +
        `${hostURL}/Users/UserHabits?ID=${_userID}` +
        "Error: \n" +
        String(e)
    );
    return null;
  }
};
const HandleGetLocation = async (): Promise<Region | null> => {
  try {
    if (!(await requestLocationPermission())) {
      throw new Error("Location permission denied");
    }

    const position = await Location.getCurrentPositionAsync({});

    if (!position) {
      throw new Error("Location not found");
    }

    const region = await HandleGetRegionCoords(
      position.coords.latitude.toString(),
      position.coords.longitude.toString()
    );

    return region;
  } catch (e) {
    console.log("HandleGetLocation failed! \n" + "Error: \n" + String(e));
    return null;
  }
};
const HandleGetRegionCoords = async (
  _latitude: string,
  _longitude: string
): Promise<Region | null> => {
  try {
    const data = await fetch(`${hostURL}/Users/locationData`, {
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
        return {
          id: md5(`${data.city}${data.district}`),
          city: data.city,
          district: data.district,
          longitude: _longitude,
          latitude: _latitude,
        } as Region;
      });

    return data;
  } catch (e) {
    console.log(
      "HandleGetRegionCoords failed! \n" +
        "Sending: \n" +
        JSON.stringify({
          longitude: _longitude,
          latitude: _latitude,
        }) +
        "Error: \n" +
        String(e)
    );
    return null;
  }
};
const HandleGetWeatherData3h = async (
  _userID: string,
  _region: Region
): Promise<WeatherData[] | null> => {
  try {
    const data = await fetch(`${hostURL}/Weather/Get3hData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID: _userID,
        cusloc: {
          city: _region.city,
          district: _region.district,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        return data as WeatherData[];
      });

    return data;
  } catch (e) {
    console.log(
      "HandleGetWeatherData3h failed! \n" +
        "Sending: \n" +
        JSON.stringify({
          userID: _userID,
          cusloc: {
            city: _region.city,
            district: _region.district,
          },
        }) +
        "Error: \n" +
        String(e)
    );
    return null;
  }
};
const HandleGetWeatherData12h = async (
  _userID: string,
  _region: Region
): Promise<WeatherData[] | null> => {
  try {
    const data = await fetch(`${hostURL}/Weather/Get12hData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID: _userID,
        cusloc: {
          city: _region.city,
          district: _region.district,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      });

    return data;
  } catch (e) {
    console.log(
      "HandleGetWeatherData12h failed! \n" +
        "Sending: \n" +
        JSON.stringify({
          userID: _userID,
          cusloc: {
            city: _region.city,
            district: _region.district,
          },
        }) +
        "Error: \n" +
        String(e)
    );
    return null;
  }
};
const HandleGetDailySug = async (
  _userID: string,
  _region: Region
): Promise<DailySug | null> => {
  try {
    const data = await fetch(`${hostURL}/Users/GetDailySuggestion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID: _userID,
        cusloc: {
          city: _region.city,
          district: _region.district,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        return data as DailySug;
      });

    return data;
  } catch (e) {
    console.log(
      "HandleGetDailySug failed! \n" +
        "Sending: \n" +
        JSON.stringify({
          userID: _userID,
          cusloc: {
            city: _region.city,
            district: _region.district,
          },
        }) +
        "Error: \n" +
        String
    );
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
    console.log("HandleGetAllRegion failed! \n" + "Error: \n" + String(e));
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
    console.log("HandleGetAllSport failed! \n" + "Error: \n" + String(e));
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
    console.log("HandleGetAllHabit failed! \n" + "Error: \n" + String(e));
    return null;
  }
};
const HandleGetEarthquakeData = async (
  _userID: string,
  _latitude: string,
  _longitude: string
): Promise<EarthquakeData[] | null> => {
  try {
    const data = await fetch(`${hostURL}/Disaster/GetEarthQuakeData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID: _userID,
        longitude: _longitude,
        latitude: _latitude,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        return data as EarthquakeData[];
      });

    return data;
  } catch (e) {
    console.log(
      "HandleGetEarthquakeData failed! \n" +
        "Sending: \n" +
        JSON.stringify({
          userID: _userID,
          longitude: _longitude,
          latitude: _latitude,
        }) +
        "Error: \n" +
        String(e)
    );
    return null;
  }
};

const HandleGetTyphoonData = async () => {
  try {
    const data = await fetch(`${hostURL}/Disaster/GetTyphoonData`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        return data as TyphoonData[];
      });
    return data;
  } catch (e) {
    console.log("HandleGetEarthquakeData failed! \n" + "Error: \n" + String(e));
    return null;
  }
};

export default function TabLayout() {
  const [socketInstance, setSocketInstance] = useState<Socket>();
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    // Update current location and current time every minute
    let time = 0;
    const Update = async () => {
      console.log(`${new Date()}: 
+---------------------------------------------------+
|                                      /\\_/\\        |
| Starting update data                ( o.o )       |
|                                      >-0-<        |
+---------------------------------------------------+`);
      const timer = setInterval(() => (time += 10), 10);

      await syncLocalDataToGlobal();
      await Promise.all([
        updateRegion0(),
        updateRegions(),
        updateUser(),
        updateEarthquakeData(),
        updateTyphoonData(),
      ]);

      console.log(`${new Date()}: 
+---------------------------------------------------+
|                                      /\\_/\\        | 
| Data update success!(${time}ms)\t      ( o.o )       |
|                                      >-0-<        |
+---------------------------------------------------+`);
      clearInterval(timer);
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
    const socket = io(hostURL, {
      transports: ["websocket"],
      reconnectionAttempts: 10,
    });

    setSocketInstance(socket);

    socket.on("connect", () => {
      socket.emit("set_location", {
        userID: 1,
        longitude: "120.62343304881064",
        latitude: "24.21694034808",
      });
      socket.emit("set_location_fake", {
        userID: store.getState().user?.id ?? "-1",
        longitude: store.getState().regions[0]?.longitude ?? "-1",
        latitude: store.getState().regions[0]?.latitude ?? "-1",
      });
      console.log(`Connect WebSocket (id: ${socket.id}) success`);
      setIsConnected(true);
    });
    socket.on("connect_error", () => {
      console.log(`Connect WebSocket (id: ${socket.id}) failed`);
      setIsConnected(false);
    });
    socket.on("error", (error) => {
      console.log(`Connect WebSocket error: ${error.message}`);
      setIsConnected(false);
    });
    socket.on("disconnect", () => {
      console.log("Disconnect from WebSocket");
      setIsConnected(false);
    });
    socket.on("registration_success", (data) => {
      console.log(data.message);
    });
    socket.on("earthquake_update", (data) => {
      showNotification(`${JSON.stringify(data)}`);
    });
    socket.on("earthquake_update_fake", (data) => {
      showNotification(`${JSON.stringify(data)}`);
    });
  }, []);

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
    paddingBottom: 20,
    borderTopWidth: 0,
  },
});
