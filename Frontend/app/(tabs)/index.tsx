import {
  Image,
  StyleSheet,
  Platform,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  PermissionsAndroid,
} from "react-native";
import { useEffect } from "react";
import Geolocation, { GeoPosition } from "react-native-geolocation-service";
import { Provider } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalDropdown from "react-native-modal-dropdown";

import { WeatherDisplay } from "@/components/WeatherDisplay";
import { ForecastDisplayWidget } from "@/components/ForecastDisplayWidget";
import { IndicatorsDisplayWidget_single } from "@/components/IndicatorsDisplayWidget_single";
import { IndicatorsDisplayWidget_double } from "@/components/IndicatorsDisplayWidget_double";
import { SuggestionDisplayWidget } from "@/components/SuggestionDisplayWidget";

import store from "@/redux/store";
import {
  updateWeatherData3h,
  updateWeatherData12h,
} from "@/redux/weatherDataSlice";
import { setRegion } from "@/redux/regionListSlice";
import { updateTimeInterval } from "@/redux/timeIntervalSlice";

// TODO list:
// - [V] Add weather data API
// - [V] Add weather image
// - [ ] Fix muti-day weather forecast view
// - [ ] Switch to use region name to fetch weather data
// - [V] Switch to use Redux for global state management
// - [V] Move weatherDataList, region, currentTime to index.tsx

export interface State {
  user: User;
  weatherData: WeatherDataList;
  regions: Region[];
  isLoading: boolean;
  timeInterval: number;
}

export interface User {
  id: number;
  account: string;
  password: string;
  status: string;
}

export interface WeatherDataList {
  [key: string]: WeatherData[][];
}

export interface WeatherData {
  [key: string]: string;
}

//    {
//         "aqi": null,
//         "bodyTemp": "29",
//         "city": "新北市",
//         "district": "汐止區",
//         "pm2.5": null,
//         "rainRate": "30",
//         "sitename": null,
//         "temp": "25",
//         "time": "2024-10-05 00:00:00",
//         "weatherCode": "11",
//         "weatherDes": "陰短暫陣雨。降雨機率 30%。溫度攝氏24至25度。舒適。東南風 風速<= 1級(每秒1公尺)。相對濕度94%。",
//         "weatherText": "陰短暫陣雨",
//         "wet": "94",
//         "windDirection": "東南風",
//         "windSpeed": "29"
//     }

export const indicatorsDictionary = {
  aqi: {
    title: "AQI",
    unit: "",
    value: "",
  },
  bodyTemp: {
    title: "Body Temp",
    unit: "°C",
    value: "",
  },
  "pm2.5": {
    title: "PM2.5",
    unit: "μg/m³",
    value: "",
  },
  rainRate: {
    title: "Rain Rate",
    unit: "mm/hr",
    value: "",
  },
  temp: {
    title: "Temp",
    unit: "°C",
    value: "",
  },
  wet: {
    title: "Humidity",
    unit: "%",
    value: "",
  },
  windDirection: {
    title: "Wind Direction",
    unit: "",
    value: "",
  },
  windSpeed: {
    title: "Wind Speed",
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

export default function HomeScreen() {
  ////////////////
  // Use effect //
  ////////////////

  useEffect(() => {
    // Update current location and current time every minute
    const Update = async () => {
      try {
        console.log("Updating data......");

        let regions: Region[] = [];
        let region: Region | null = null;

        // Get regions from local storage
        regions = JSON.parse((await AsyncStorage.getItem("regions")) || "[]");
        console.log("Complete get regions from local storage");

        // Get current location
        try {
          region = await HandleGetLocal();
          console.log("Complete get current location");
        } catch (error) {
          console.error("Failed to get current location: " + error);
        }

        // Set regions[0] to current location
        regions[0] = region || regions[0];
        console.log("Complete set regions[0] to current location");

        // Save regions to localstorage
        await AsyncStorage.setItem("regions", JSON.stringify(regions));
        store.dispatch(setRegion(regions));
        console.log("Complete save regions to local storage");

        // Update time
        let time = new Date().toLocaleDateString();
        console.log("Complete update time");

        // Update weather data
        try {
          for (let i = 0; i < regions.length; i++) {
            let weatherData3h = await HandleGetWeatherData3h(
              regions[i].latitude,
              regions[i].longitude
            );
            let weatherData12h = await HandleGetWeatherData12h(
              regions[i].latitude,
              regions[i].longitude
            );

            store.dispatch(updateWeatherData3h(weatherData3h));
            store.dispatch(updateWeatherData12h(weatherData12h));
          }
          console.log("Complete update weather data");
        } catch (error) {
          console.error("Failed to update weather data: " + error);
        }

        console.log(
          "Data update completed! \n",
          "time: ",
          time,
          "\n",
          "regions: ",
          store.getState().region,
          "\n",
          "weatherData: ",
          store.getState().weatherData
        );
      } catch (error) {
        console.error("Data update failed! " + error);
      }
    };
    Update();

    const interval = setInterval(async () => {
      await Update();
    }, 60000); // Time gap (ms)

    return () => clearInterval(interval);
  }, []);

  //////////////////////
  // Define functions //
  //////////////////////

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
    latitude: string,
    longitude: string
  ): Promise<WeatherData[]> => {
    const weatherData3h = await fetch(
      `https://weather-2-9.onrender.com/Weather/Get3hData`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ longitude: longitude, latitude: latitude }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((error) => {
        throw new Error(error);
      });

    if (!weatherData3h) {
      throw new Error("Failed to get weather data (3h)");
    }

    return weatherData3h;
  };

  const HandleGetWeatherData12h = async (
    latitude: string,
    longitude: string
  ): Promise<WeatherData[]> => {
    const weatherData12h = await fetch(
      `https://weather-2-9.onrender.com/Weather/Get12hData`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ longitude: longitude, latitude: latitude }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((error) => {
        throw new Error(error);
      });

    if (!weatherData12h) {
      throw new Error("Failed to get weather data (3h)");
    }

    return weatherData12h;
  };

  return (
    <Provider store={store}>
      <View style={styles.container}>
        {/* Top Section */}
        <View style={styles.topSection}>
          <WeatherDisplay />
          <ModalDropdown
            options={["Day View (3h)", "Weak View (1d)"]}
            onSelect={(index, value) => {
              store.dispatch(updateTimeInterval(parseInt(index)));
            }}
            defaultValue="Select Interval..."
            textStyle={styles.dropdown}
            dropdownStyle={styles.dropdownBox}
          />
        </View>

        {/* Body Section */}
        <ScrollView style={styles.bodySection}>
          <View style={{ gap: 20 }}>
            <ForecastDisplayWidget />

            <View style={styles.row}>
              <IndicatorsDisplayWidget_single type="wet" />
              <IndicatorsDisplayWidget_single type="rainRate" />
            </View>

            <View style={styles.row}>
              <IndicatorsDisplayWidget_double
                type1="windSpeed"
                type2="windDirection"
              />
            </View>

            <View style={styles.row}>
              <SuggestionDisplayWidget type="dressing" />
              <SuggestionDisplayWidget type="health" />
            </View>

            <View style={styles.row}>
              <SuggestionDisplayWidget type="sport" />
              <SuggestionDisplayWidget type="transportation" />
            </View>

            <View style={styles.row}>
              <SuggestionDisplayWidget type="activity" />
            </View>
          </View>
        </ScrollView>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#10202b",
  },
  topSection: {
    height: "30%",
    justifyContent: "center",
    position: "relative",
  },
  bodySection: {
    backgroundColor: "#FFFFFF01",
    height: "70%",
    padding: "3%",
  },
  row: {
    minWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  dropdown: {
    marginLeft: 20,
    width: 150,
    height: 32,
    color: "white",
    fontSize: 16,
    padding: 4,
    backgroundColor: "none",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "white",
  },
  dropdownBox: {
    width: 200,
    height: 200,
  },
});
