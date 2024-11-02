import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { Provider, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useColorScheme } from "@/hooks/useColorScheme";

import store from "@/redux/store";
import {
  updateWeatherData3h,
  updateWeatherData12h,
} from "@/redux/weatherDataSlice";
import { setRegion, updateRegion } from "@/redux/regionListSlice";
import {
  setSelectedRegion,
  setSelectedTimeInterval,
} from "@/redux/selecterSlice";
import { removeUser, setUser } from "@/redux/userSlice";
import { setUserSettings } from "@/redux/userSettingsSlice";
import { updateDailySug } from "@/redux/dailySugSlice";
import { StyleSheet } from "react-native";

// todo list
// 1. Change region-selector to number

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
  region: string;
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

  console.log("Set sports with response: " + response.status);
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

  console.log("Set habits with response: " + response.status);
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
  await Promise.all([updateWeatherData_3h(), updateWeatherData_12h()]);

  console.log("Updated region[0] to: " + region.name);
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

  // FETCH
  const user = await HandleGetUser(userID);

  // ERROR HANDLING
  if (!user) {
    return;
  }

  // STORE
  store.dispatch(setUser(user));
  AsyncStorage.setItem("userID", JSON.stringify(user.id));

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

//////////////////
// API fetching // (Return null & set global err msg if catch error)
//////////////////

const hostURL = "https://weather-2-10.onrender.com"; //`${hostURL}/`

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
    console.error(e);
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
    console.error(e);
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
    console.error(e);
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
    console.error(e);
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

    if (response.status !== "Successful") {
      throw new Error(response.status);
    }

    return response;
  } catch (e) {
    console.error(e);
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
    console.error(e);
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

    if (response.status !== "Successful") {
      throw new Error(response.status);
    }

    return response;
  } catch (e) {
    console.error(e);
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
    console.error(e);
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
  } catch (error) {
    console.error(error);
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
  } catch (error) {
    console.error(error);
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
  } catch (error) {
    console.error(error);
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
  } catch (error) {
    const [city, district] = _region.name.split(", ");
    console.error(`Getting ${_region} 12h data failed: ` + error);
    console.log(
      "Data: " +
        JSON.stringify({
          userID: _userID ?? "-1",
          longitude: "0",
          latitude: "0",
          cusloc: {
            city: city,
            district: district,
          },
        })
    );
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
  } catch (error) {
    console.error(error);
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
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default function TabLayout() {
  useEffect(() => {
    // Update current location and current time every minute
    const Update = async () => {
      console.log("Updating data......");

      await Promise.all([
        updateRegion0(),
        updateWeatherData_3h(),
        updateWeatherData_12h(),
        updateUser(),
      ]);

      console.log(
        "-----------------------------------------------------\n" +
          `| ${new Date()} \t|` +
          "\n" +
          "----------------------------------------------------\n" +
          "| Data update success! \t\t\t\t\t\t\t\t|" +
          "\n" +
          "----------------------------------------------------\n"
      );
    };

    const init = async () => {
      let regions: Region[] = JSON.parse(
        (await AsyncStorage.getItem("regions")) || "[]"
      );

      store.dispatch(setRegion(regions));

      // Set default region and time interval
      store.dispatch(setSelectedRegion(regions[0]?.name ?? ""));
      store.dispatch(setSelectedTimeInterval(0));
    };

    init();
    Update();
    const interval = setInterval(async () => {
      await Update();
    }, 60000); // Time gap (ms)

    return () => clearInterval(interval);
  }, []);

  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
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
    </Provider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 黑色半透明背景
    position: "absolute", // 讓背景浮動
    height: "8%", // 調整高度以便縮小圖標居中
    paddingHorizontal: 120,
    paddingBottom: 30,
    paddingTop: 10,
    borderTopWidth: 0,
  },
});
