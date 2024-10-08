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
import Geolocation, { GeoPosition } from "react-native-geolocation-service";

import { WeatherDisplay } from "@/components/WeatherDisplay";
import { ForecastDisplayWidget } from "@/components/ForecastDisplayWidget";
import { IndicatorsDisplayWidget_single } from "@/components/IndicatorsDisplayWidget_single";
import { IndicatorsDisplayWidget_double } from "@/components/IndicatorsDisplayWidget_double";
import { SuggestionDisplayWidget } from "@/components/SuggestionDisplayWidget";
import { useState, useEffect } from "react";

// 定義初始狀態
const initialState = {
  user: {
    id: 0,
    account: "",
    password: "",
    status: "",
  },
  weatherData: {},
  regions: [],
  isLoading: true,
  timeInterval: 0,
};

interface State {
  user: User;
  weatherData: WeatherDataList;
  regions: Region[];
  isLoading: boolean;
  timeInterval: number;
}

interface User {
  id: number;
  account: string;
  password: string;
  status: string;
}

interface WeatherDataList {
  [key: string]: WeatherData[];
}

interface WeatherData {
  aqi?: string;
  bodyTemp: string;
  city: string;
  district: string;
  "pm2.5"?: string;
  rainRate: string;
  sitename: string;
  temp: string;
  time: string;
  weatherCode: string;
  weatherDes: string;
  weatherText: string;
  wet: string;
  windDirection: string;
  windSpeed: string;
}

interface Region {
  id: string;
  name: string;
  longitude: string;
  latitude: string;
}

export default function HomeScreen() {
  const [weatherDataList, setWeatherDataList] =
    useState<WeatherDataList | null>(null);
  const [regions, setRegions] = useState<Region[] | null>(null);
  const [timeInterval, setTimeInterval] = useState<number | null>(0);
  const [time, setTime] = useState<string | null>("");
  const [isLoading, setLoading] = useState<boolean | null>(true);

  ////////////////
  // Use effect //
  ////////////////

  useEffect(() => {
    // Update current location and current time every minute
    const Update = async () => {
      try {
        console.log("Updating region data......");

        // Update user

        // Update region data
        await HandleUpdateRegion(0);

        // Update current time
        HandleUpdateTime();

        // Update time interval

        // Update weather data

        console.log("Region data update completed!");
      } catch (error) {
        console.error("Region data update failed! " + error);
      }
    };
    Update();

    const interval = setInterval(async () => {
      await Update();
    }, 60000); // Time gap (ms)

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const UpdateWeatherDataList = async () => {
      try {
        // Wait for location data
        while (!regions) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        console.log("Updating weather data......");

        setLoading(true);
        await HandleUpdateWeatherDataList();
        setLoading(false);

        console.log("Weather data update completed!");
      } catch (error) {
        console.log("Weather data update failed! " + error);
      }
    };
    UpdateWeatherDataList();
  }, [regions, timeInterval]);

  //////////////////////
  // Define functions //
  //////////////////////

  const HandleUpdateTime = () => {
    setTime(new Date().toLocaleDateString());
  };

  const HandleUpdateTimeInterval = async (type: number) => {
    setTimeInterval(type);
  };

  const HandleGetGeoPosition = async (): Promise<GeoPosition> => {
    let positionData: GeoPosition | null = null;

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
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          return false;
        }
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

    if (await requestLocationPermission()) {
      positionData = await getCurrentLocation();
    } else {
      throw new Error("Location permission denied");
    }

    if (positionData) {
      return positionData;
    } else {
      throw new Error("positionData is null");
    }
  };

  const HandleGetWeatherData = async (
    latitude: string,
    longitude: string
  ): Promise<WeatherData[]> => {
    let weatherData: WeatherData[] | null = null;

    // Fetch API to get weather data
    switch (timeInterval) {
      case 0: // Day View (3h) // https://weather-2-9.onrender.com/Weather/Get3hData
        weatherData = await fetch(
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
        break;
      case 1: // Weak View (1d) // https://weather-2-9.onrender.com/Weather/Get12hData
        weatherData = await fetch(
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
        break;
    }

    if (weatherData) {
      return weatherData;
    } else {
      throw new Error("weatherData is null");
    }
  };

  const HandleUpdateWeatherDataList = async () => {
    const weatherDataList: WeatherDataList = {};

    for (const region of regions || []) {
      const latitude = region.latitude;
      const longitude = region.longitude;
      const weatherData = await HandleGetWeatherData(latitude, longitude);

      weatherDataList[region.id] = weatherData;
    }

    setWeatherDataList(weatherDataList);
  };

  const HandleGetRegion = async (
    latitude: string,
    longitude: string
  ): Promise<Region> => {
    const weatherData = await HandleGetWeatherData(latitude, longitude);
    const region = {
      id: `${weatherData[0].district}, ${weatherData[0].city}`,
      name: `${weatherData[0].district}, ${weatherData[0].city}`,
      latitude: latitude,
      longitude: longitude,
    };

    return region;
  };

  const HandleRemoveRegion = async (region: Region) => {
    let regions_ = regions || [];

    // Check if region exists
    if (!regions_?.find((reg) => reg.id === region.id)) {
      throw new Error("Region does not exist");
    }

    setRegions([...regions_.filter((reg) => reg.id !== region.id)]);
  };

  const HandleAddRegion = async (region: Region) => {
    const regions_ = regions || [];

    // Check if region already exists
    if (regions_?.find((reg) => reg.id === region.id)) {
      throw new Error("Region already exists");
    }

    setRegions([...regions_, region]);
  };

  const HandleUpdateRegion = async (index: number) => {
    const regions_ = regions || [];
    const currentLocation = await HandleGetGeoPosition();
    const latitude = currentLocation?.coords.latitude.toString();
    const longitude = currentLocation?.coords.longitude.toString();
    const region = await HandleGetRegion(latitude, longitude);

    regions_[index] = region;

    setRegions([...regions_]);
  };

  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <WeatherDisplay />
      </View>

      {/* Body Section */}
      <ScrollView style={styles.bodySection}>
        <View style={{ gap: 20 }}>
          <ForecastDisplayWidget />

          <View style={styles.row}>
            <IndicatorsDisplayWidget_single type="humidity" />
            <IndicatorsDisplayWidget_single type="rain-rate" />
          </View>

          <View style={styles.row}>
            <IndicatorsDisplayWidget_double
              type1="wind-speed"
              type2="wind-direction"
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
});
