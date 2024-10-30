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
import { setRegion } from "@/redux/regionListSlice";
import { updateRegion } from "@/redux/selecterSlice";
import { setUser } from "@/redux/userSlice";
import { setUserSettings } from "@/redux/userSettingsSlice";
import { updateDailySug } from "@/redux/dailySugSlice";
import { StyleSheet } from "react-native";
import { addRegion } from "@/redux/regionListSlice";

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
  try {
    const user = await HandleUserLogin(_account, _password);
    if (!user || user.id === "-1") {
      throw new Error(user?.status ?? "User data is empty");
    }

    const userSettings = {
      sport: await HandleGetUserSports(user.id),
      habit: await HandleGetUserHabits(user.id),
    };

    AsyncStorage.setItem("userID", JSON.stringify(user.id));
    store.dispatch(setUser(user));
    store.dispatch(setUserSettings(userSettings));

    console.log("Login success");
  } catch (error) {
    console.error("Login fail: " + error);
  }
};

export const userLogout = async () => {
  try {
    AsyncStorage.removeItem("userID");
    store.dispatch(
      setUser({ account: "", password: "", id: "-1", status: "" })
    );
    store.dispatch(setUserSettings({ sport: [], habit: [] }));

    console.log("Logout success");
  } catch (error) {
    console.error("Logout fail: " + error);
  }
};

export const userDelete = async () => {
  try {
    const userID = store.getState().user.id;
    const response = await HandleDeleteUser(userID);

    if (!response) {
      throw new Error("Failed to delete user");
    }

    AsyncStorage.removeItem("userID");
    store.dispatch(
      setUser({ account: "", password: "", id: "-1", status: "" })
    );
    store.dispatch(setUserSettings({ sport: [], habit: [] }));

    console.log("Delete success");
  } catch (error) {
    console.error("Delete fail: " + error);
  }
};

export const userRegister = async (_account: string, _password: string) => {
  try {
    const user = await HandleSetUser(_account, _password);
    if (!user || user.id === "-1") {
      throw new Error(user?.status ?? "User data is empty");
    }

    const response =
      (await HandleSetUserSports(user.id, [])) &&
      (await HandleSetUserHabits(user.id, []));
    if (!response) {
      throw new Error("Failed to set user settings");
    }

    const userSettings = {
      sport: await HandleGetUserSports(user.id),
      habit: await HandleGetUserHabits(user.id),
    };

    AsyncStorage.setItem("userID", JSON.stringify(user.id));
    store.dispatch(setUser(user));
    store.dispatch(setUserSettings(userSettings));

    console.log("Register success");
  } catch (error) {
    console.error("Register fail: " + error);
  }
};

export const userSetSports = async (_sportIDs: number[]) => {
  try {
    const userID = store.getState().user.id;

    const response = await HandleSetUserSports(userID, _sportIDs);
    if (!response) {
      throw new Error("Failed to set sports");
    }

    const sports = await HandleGetUserSports(userID);

    store.dispatch(
      setUserSettings({
        sport: sports,
        habit: store.getState().userSettings.habit,
      })
    );

    console.log("Set sports success");
  } catch (error) {
    console.error("Set sports fail: " + error);
  }
};

export const userSetHabits = async (_habitIDs: number[]) => {
  try {
    const userID = store.getState().user.id;

    const response = await HandleSetUserHabits(userID, _habitIDs);
    if (!response) {
      throw new Error("Failed to set habits");
    }

    const habits = await HandleGetUserHabits(userID);

    store.dispatch(
      setUserSettings({
        sport: store.getState().userSettings.sport,
        habit: habits,
      })
    );

    console.log("Set habits success");
  } catch (error) {
    console.error("Set habits fail: " + error);
  }
};

export const getRegionList = async () => {
  try {
    const regions = await HandleGetAllRegion();
    if (!regions) {
      throw new Error("Region list is empty");
    }

    return regions;
  } catch (error) {
    console.error("Get region list fail: " + error);
  }
};

export const userAddRegion = async (_region: Region) => {
  try {
    const regions = store.getState().region;
    if (regions.find((region) => region.id === _region.id)) {
      throw new Error("Region already exists");
    }

    store.dispatch(addRegion(_region));
    AsyncStorage.setItem("regions", JSON.stringify([...regions, _region]));

    updateWeatherData([_region]);

    console.log("Add region success");
  } catch (error) {
    console.error("Add region fail: " + error);
  }
};

// Update regions[0] to current location
const updateRegion0 = async (regions: Region[]) => {
  const region = await HandleGetLocation();
  regions[0] = region ?? regions[0];

  store.dispatch(setRegion(regions));
  AsyncStorage.setItem("regions", JSON.stringify(regions));

  updateWeatherData([region]);

  console.log("Complete update region[0]");
};

// Update weather data
const updateWeatherData = async (regions: Region[]) => {
  for (let i = 0; i < regions.length; i++) {
    const weatherData3h = await HandleGetWeatherData3h(regions[i]);
    const weatherData12h = await HandleGetWeatherData12h(regions[i]);

    store.dispatch(updateWeatherData3h(weatherData3h));
    store.dispatch(updateWeatherData12h(weatherData12h));
  }

  console.log("Complete update weather data");
};

// Update user data
const updateUserData = async (userID: string) => {
  const regions = store.getState().region;
  const user = await HandleGetUser(userID);
  const userSettings = {
    sport: await HandleGetUserSports(userID),
    habit: await HandleGetUserHabits(userID),
  };
  const dailySuggestions = await HandleGetDailySug(
    userID,
    regions[0]?.latitude ?? "0", // Werid, this shouldn't exist
    regions[0]?.longitude ?? "0" // Maybe try to remove this from POST method
  );

  store.dispatch(setUser(user));
  store.dispatch(setUserSettings(userSettings));
  store.dispatch(updateDailySug(dailySuggestions));

  console.log("Complete update user data");
};

const requestLocationPermission = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  return status == "granted";
};

//////////////////
// API fetching //
//////////////////

const hostURL = "https://weather-2-10.onrender.com"; //`${hostURL}/`

const HandleSetUser = async (
  _account: string,
  _password: string
): Promise<User> => {
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
    })
    .catch((error) => console.error("Error:", error));

  if (!data) {
    throw new Error("Data is empty");
  }
  if (data.id === "-1") {
    console.error(data.status); // Set to global error message
  }

  return data;
};

const HandleGetUser = async (_userID: string): Promise<User> => {
  const data = await fetch(`${hostURL}/Users/?id=${_userID}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      return data as User;
    })
    .catch((error) => console.error("Error:", error));

  if (!data) {
    throw new Error("Data is empty");
  }
  if (data.id === "-1") {
    console.error(data.status); // Set to global error message
  }

  return data;
};

const HandleDeleteUser = async (_userID: string): Promise<boolean> => {
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
      if (data.status === "Successful") {
        return true;
      } else {
        return false;
      }
    })
    .catch((error) => console.error("Error:", error));

  return !!response;
};

const HandleUserLogin = async (
  _account: string,
  _password: string
): Promise<User> => {
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
    })
    .catch((error) => console.error("Error:", error));

  if (!data) {
    throw new Error("Data is empty");
  }
  if (data.id === "-1") {
    console.error(data.status); // Set to global error message
  }

  return data;
};

const HandleSetUserSports = async (
  _userID: string,
  _sportIDs: number[]
): Promise<boolean> => {
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
      if (data.Stats === "Update Successful !") {
        return true;
      } else {
        return false;
      }
    })
    .catch((error) => console.error("Error:", error));

  return !!response;
};

const HandleGetUserSports = async (_userID: string): Promise<Sport[]> => {
  const data = await fetch(`${hostURL}/Users/UserSports?ID=${_userID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data as Sport[];
    })
    .catch((error) => console.error("Error:", error));

  if (!Array.isArray(data)) {
    throw new Error("Data type is not [array]");
  }
  if (data.length === 0) {
    return [];
  }
  if (data[0].id === -1) {
    console.error(data[0].sportName); // Set to global error message
  }

  return data;
};

const HandleSetUserHabits = async (
  _userID: string,
  _habitIDs: number[]
): Promise<boolean> => {
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
      if (data.Stats === "Update Successful !") {
        return true;
      } else {
        return false;
      }
    })
    .catch((error) => console.error("Error:", error));

  return !!response;
};

const HandleGetUserHabits = async (_userID: string): Promise<Habit[]> => {
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
    })
    .catch((error) => console.error("Error:", error));

  if (!Array.isArray(data)) {
    throw new Error("Data type is not [array]");
  }
  if (data.length === 0) {
    return [];
  }
  if (data[0].id === -1) {
    console.error(data[0].habitName); // Set to global error message
  }

  return data;
};

// Need fix
const HandleGetLocation = async (): Promise<Region> => {
  if (!(await requestLocationPermission())) {
    throw new Error("Location permission denied");
  }

  const position = await Location.getCurrentPositionAsync({});

  if (!position) {
    throw new Error("Failed to get location");
  }

  // Make HandleGetRegionCoords() instead of this
  const weatherData = await HandleGetWeatherDataCoords(
    position.coords.latitude.toString(),
    position.coords.longitude.toString()
  );

  if (!weatherData) {
    throw new Error("Failed to get weather data");
  }

  const region: Region = {
    id: "0",
    name: `${weatherData[0].city}, ${weatherData[0].district}`,
    longitude: position.coords.longitude.toString(),
    latitude: position.coords.latitude.toString(),
  };

  return region;
};

const HandleGetWeatherDataCoords = async (
  _latitude: string,
  _longitude: string
): Promise<WeatherData[]> => {
  const weatherData = await fetch(`${hostURL}/Weather/Get3hData`, {
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
      return data;
    })
    .catch((error) => {
      throw new Error(error);
    });

  if (!weatherData) {
    throw new Error("Weather data (Coords) is empty");
  }

  return weatherData;
};

const HandleGetWeatherData3h = async (
  _region: Region
): Promise<WeatherData[]> => {
  const [city, district] = _region.name.split(", ");
  const weatherData3h = await fetch(`${hostURL}/Weather/Get3hData`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
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
    })
    .catch((error) => {
      throw new Error(error);
    });

  if (!weatherData3h) {
    throw new Error("Weather data (3h) is empty");
  }

  return weatherData3h;
};

const HandleGetWeatherData12h = async (
  _region: Region
): Promise<WeatherData[]> => {
  const [city, district] = _region.name.split(", ");
  const weatherData12h = await fetch(`${hostURL}/Weather/Get12hData`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
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
    })
    .catch((error) => {
      throw new Error(error);
    });

  if (!weatherData12h) {
    throw new Error("Weather data (12h) is empty");
  }

  return weatherData12h;
};

const HandleGetDailySug = async (
  _userID: string,
  _latitude: string,
  _longitude: string
): Promise<DailySug> => {
  const data = await fetch(`${hostURL}/Users/GetDailySuggestion`, {
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
      return data as DailySug;
    })
    .catch((error) => {
      throw new Error(error);
    });

  if (!data) {
    throw new Error("Daily suggestion is empty");
  }

  return data;
};

const HandleGetAllRegion = async (): Promise<Region[]> => {
  const data = await fetch(`${hostURL}/Users/GetAllRegion`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      return data as RegionList;
    })
    .catch((error) => {
      throw new Error(error);
    });

  if (!data) {
    throw new Error("Region list is empty");
  }

  const regions: Region[] = [];

  for (const key in data.city) {
    data.city[key].forEach((district) => {
      regions.push({
        id: `${key}, ${district}`,
        name: `${key}, ${district}`,
        longitude: "0",
        latitude: "0",
      });
    });
  }

  return regions;
};

export default function TabLayout() {
  useEffect(() => {
    // Update current location and current time every minute
    const Update = async () => {
      console.log("Updating data......");

      let userID: string = (await AsyncStorage.getItem("userID")) || "-1";
      let regions: Region[] = JSON.parse(
        (await AsyncStorage.getItem("regions")) || "[]"
      );

      if (regions.length !== 0) {
        store.dispatch(updateRegion(regions[0].name));
        AsyncStorage.setItem("regions", JSON.stringify(regions));
      }

      await Promise.all([
        updateRegion0(regions),
        updateWeatherData(regions),
        updateUserData(userID),
      ]);

      console.log(
        "Data update success! \n" +
          "-------------------\n" +
          `${regions[0].name}: ` +
          new Date() +
          "\n" +
          "-------------------\n" +
          "Data: " +
          JSON.stringify(store.getState())
      );
    };

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
