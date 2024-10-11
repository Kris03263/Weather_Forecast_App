import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Platform, PermissionsAndroid } from "react-native";
import Geolocation, { GeoPosition } from "react-native-geolocation-service";
import { Provider } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

import store from "@/redux/store";
import {
  updateWeatherData3h,
  updateWeatherData12h,
} from "@/redux/weatherDataSlice";
import { setRegion } from "@/redux/regionListSlice";
import { updateTimeInterval, updateRegion } from "@/redux/selecterSlice";
import { setUser } from "@/redux/userSlice";
import { setUserSettings } from "@/redux/userSettingsSlice";
import { updateDailySportSug } from "@/redux/dailySportSugSlice";

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

export interface selecter {
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

export interface DailySportSug {
  sportName: string;
  id: number;
  sportSuggestion: string;
}

//////////////////////
// Define functions //
//////////////////////

export const userLogin = async (_account: string, _password: string) => {
  try {
    const user = await HandleUserLogin(_account, _password);
    console.log(user);
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

  if (!data || data.id === "-1") {
    throw new Error(data?.status ?? "Data is empty");
  }

  return data;
};

const HandleGetUser = async (_userID: string): Promise<User> => {
  const data = await fetch(`${hostURL}/Users/?id=${_userID}`, {
    method: "GET",
    headers: {
      // "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data as User;
    })
    .catch((error) => console.error("Error:", error));

  if (!data || data.id === "-1") {
    throw new Error(data?.status ?? "Data is empty");
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
      console.log(data);
      return data as User;
    })
    .catch((error) => console.error("Error:", error));

  if (!data || data.id === "-1") {
    throw new Error(data?.status ?? "Data is empty");
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
      console.log(data);
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

  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }

  if (data[0].id === -1) {
    throw new Error(data?.[0]?.sportName ?? "Data is empty");
  }

  return data;
};

const HandleSetUserHabits = async (
  _userID: string,
  _habitIDs: number[]
): Promise<boolean> => {
  console.log({
    userID: _userID,
    habitIDs: _habitIDs,
  });
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
      console.log(data);
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

  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }

  if (data[0].id === -1) {
    throw new Error(data?.[0]?.habitName ?? "Data is empty");
  }

  return data;
};

const HandleGetLocal = async (): Promise<Region> => {
  // Request location permission
  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "We need access to your location",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      return true;
    }
  };

  // Get current location
  const getCurrentLocation = async (): Promise<GeoPosition> => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (pos) => {
          resolve(pos);
        },
        (error) => {
          reject(new Error(error.message));
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  };

  if (!(await requestLocationPermission())) {
    throw new Error("Location permission denied");
  }

  const position = await getCurrentLocation();

  if (!position) {
    throw new Error("Failed to get location");
  }

  const weatherData = await HandleGetWeatherData3h(
    position.coords.latitude.toString(),
    position.coords.longitude.toString()
  );

  if (!weatherData) {
    throw new Error("Failed to get weather data");
  }

  const region: Region = {
    id: `${weatherData[0].city}, ${weatherData[0].district}`,
    name: `${weatherData[0].city}, ${weatherData[0].district}`,
    longitude: position.coords.longitude.toString(),
    latitude: position.coords.latitude.toString(),
  };

  return region;
};

const HandleGetWeatherData3h = async (
  _latitude: string,
  _longitude: string
): Promise<WeatherData[]> => {
  const weatherData3h = await fetch(`${hostURL}/Weather/Get3hData`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ longitude: _longitude, latitude: _latitude }),
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
  _latitude: string,
  _longitude: string
): Promise<WeatherData[]> => {
  const weatherData12h = await fetch(`${hostURL}/Weather/Get12hData`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ longitude: _longitude, latitude: _latitude }),
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

const HandleGetDailySportSug = async (
  _userID: string,
  _latitude: string,
  _longitude: string
): Promise<DailySportSug[]> => {
  console.log({
    userID: _userID,
    longitude: _longitude,
    latitude: _latitude,
  });
  const data = await fetch(`${hostURL}/Users/GetDailySportsSuggestion`, {
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
      return data as DailySportSug[];
    })
    .catch((error) => {
      throw new Error(error);
    });

  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }

  if (data[0].id === -1) {
    throw new Error(data?.[0]?.sportName ?? "Daily sport suggestion is empty");
  }

  return data;
};

export default function TabLayout() {
  useEffect(() => {
    // Update current location and current time every minute
    const Update = async () => {
      try {
        console.log("Updating data......");

        let userID: string = "-1";
        let user: User = {} as User;
        let userSettings: UserSettings = {} as UserSettings;
        let regions: Region[] = [];
        let region: Region | null = null;
        let weatherData3h: WeatherData[] = [];
        let weatherData12h: WeatherData[] = [];
        let dailySportSuggestions: DailySportSug[] = [];

        // Get time
        let time = new Date().toLocaleDateString();
        console.log("Complete get time");

        // Get regions from local storage
        regions = JSON.parse((await AsyncStorage.getItem("regions")) || "[]");
        console.log("Complete get regions from local storage");

        // Get user id from local storage
        userID = JSON.parse((await AsyncStorage.getItem("userID")) || "-1");
        console.log("Complete get userID from local storage");

        // Get current location
        try {
          region = await HandleGetLocal();
          console.log("Complete get current location");
        } catch (error) {
          console.error("Failed to get current location: " + error);
        }

        // Get user data
        try {
          user = await HandleGetUser(userID);
          console.log("Complete get user data");
        } catch (error) {
          console.error("Failed to get user data: " + error);
        }

        // Get user settings data
        try {
          userSettings = {
            sport: await HandleGetUserSports(userID),
            habit: await HandleGetUserHabits(userID),
          };
          console.log("Complete get user settings data");
        } catch (error) {
          console.error("Failed to get user settings data: " + error);
        }

        // Set regions[0] to current location
        if (region) {
          regions[0] = region;
          await AsyncStorage.setItem("regions", JSON.stringify(regions));
          console.log("Complete set regions[0] to current location");
        } else {
          console.log(
            "Failed to set regions[0] to current location, use local storage location instead"
          );
        }

        // Update weather data
        try {
          for (let i = 0; i < regions.length; i++) {
            weatherData3h = await HandleGetWeatherData3h(
              regions[i].latitude,
              regions[i].longitude
            );
            weatherData12h = await HandleGetWeatherData12h(
              regions[i].latitude,
              regions[i].longitude
            );
          }
          console.log("Complete update weather data");
        } catch (error) {
          console.error("Failed to update weather data: " + error);
        }

        // Update daily sport suggestion
        try {
          dailySportSuggestions = await HandleGetDailySportSug(
            user.id,
            regions[0].latitude,
            regions[0].longitude
          );
          console.log("Complete update daily sport suggestion");
        } catch (error) {
          console.error("Failed to update daily sport suggestion: " + error);
        }

        // Set store data
        store.dispatch(setRegion(regions));
        store.dispatch(updateRegion(regions[0].id));
        store.dispatch(setUser(user));
        store.dispatch(setUserSettings(userSettings));
        store.dispatch(updateWeatherData3h(weatherData3h));
        store.dispatch(updateWeatherData12h(weatherData12h));
        store.dispatch(updateDailySportSug(dailySportSuggestions));
        console.log("Complete set store data");

        console.log(
          "Data update completed! \n",
          "time: ",
          time,
          "\n",
          "regions: ",
          store.getState().region,
          "\n",
          "weatherData: ",
          store.getState().weatherData,
          "\n",
          "user: ",
          store.getState().user,
          "\n",
          "userSettings: ",
          store.getState().userSettings
        );
      } catch (error) {
        console.error("Data update failed! " + error);
      }
    };
    Update();
    store.dispatch(updateTimeInterval(0));

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
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "home" : "home-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="setting"
          options={{
            title: "Settings",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "settings-sharp" : "settings-outline"}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </Provider>
  );
}
