import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  FlatList,
  PermissionsAndroid,
  Platform,
} from "react-native";
import { EffectCallback, useEffect, useRef, useState } from "react";
import ModalDropdown from "react-native-modal-dropdown";
import Geolocation, { GeoPosition } from "react-native-geolocation-service";

import { Widget } from "@/components/Widget";
import { SvgImage } from "@/components/Svg";

interface WeatherDataList {
  // Define weather data list structure
  [key: string]: WeatherData[];
}

interface WeatherData {
  // Define weather data structure
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
  // Define region structure
  id: string;
  name: string;
  longitude: string;
  latitude: string;
}

// TODO list:
// - [V] Add weather data API
// - [ ] Add weather image
// - [ ] Add longtitute and latitude to region document
// - [ ] Move weatherDataList, location, currentTime to index.tsx and make it global

export function ForecastDisplayWidget() {
  const [weatherDataList, setWeatherDataList] =
    useState<WeatherDataList | null>(null);
  const [regions, setRegions] = useState<Region[] | null>(null);
  const [timeInterval_type, setTimeInterval] = useState<number | null>(0);
  const [currentTime, setCurrentTime] = useState<string | null>("");
  const [isLoading, setLoading] = useState<boolean | null>(true);

  ////////////////
  // Use effect //
  ////////////////

  useEffect(() => {
    // Update current location and current time every minute
    const Update = async () => {
      try {
        console.log("Updating region data......");

        // Update current location
        await HandleUpdateRegion();

        // Upadate current time
        HandleUpdateCurrentTime();

        console.log("Region data update completed! region: " + regions);
      } catch (error) {
        console.error("Region data update failed! " + error);
      }
    };

    Update(); // Initial update

    const interval = setInterval(async () => {
      await Update();
    }, 60000); // Time gap (ms)

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Update weather data when location, regions, or time interval type changes
    const UpdateWeatherDataList = async () => {
      try {
        // Wait for location data
        while (!regions) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        console.log("Updating weather data......");

        // Set loading state
        setLoading(true);

        // Update weather data list
        await HandleUpdateWeatherDataList();

        // Set loading state
        setLoading(false);

        console.log("Weather data update completed!");
      } catch (error) {
        console.log("Weather data update failed! " + error);
      }
    };

    UpdateWeatherDataList();
  }, [regions, timeInterval_type]);

  //////////////////////
  // Define functions //
  //////////////////////

  const HandleUpdateCurrentTime = () => {
    const date = new Date().toLocaleDateString();

    // Update current time
    setCurrentTime(date);
  };

  const HandleUpdateTimeInterval = async (type: number) => {
    // Update time interval type
    setTimeInterval(type);
  };

  const HandleUpdateWeatherDataList = async () => {
    const weatherDataList: WeatherDataList = {};

    // Fetch weather data for each region
    for (const region of regions || []) {
      const latitude = region.latitude;
      const longitude = region.longitude;
      const weatherData = await HandleGetWeatherData(latitude, longitude);

      weatherDataList[region.id] = weatherData;
    }

    // Update weather data
    setWeatherDataList(weatherDataList);
  };

  const HandleUpdateRegion = async () => {
    const regions_ = regions || [];
    const currentLocation = await HandleGetGeoPosition();
    const latitude = currentLocation?.coords.latitude.toString();
    const longitude = currentLocation?.coords.longitude.toString();
    const weatherData = await HandleGetWeatherData(latitude, longitude);
    const region = {
      id: `${weatherData[0].district}, ${weatherData[0].city}`,
      name: `${weatherData[0].district}, ${weatherData[0].city}`,
      latitude: latitude,
      longitude: longitude,
    };

    // Check if region already exists // Need to move to AddRegion function
    if (regions?.find((_region) => _region.id === region.id)) {
      throw new Error("Region already exists");
    }

    regions_[0] = region;

    setRegions(regions_);
  };

  const HandleGetWeatherData = async (
    latitude: string,
    longitude: string
  ): Promise<WeatherData[]> => {
    let weatherData: WeatherData[] | null = null;

    // Fetch API to get weather data
    switch (timeInterval_type) {
      case 0: // Day View (3h) // https://weather-2-9.onrender.com/Weather/Get3hData
        weatherData = await fetch(`http://127.0.0.1:8000/Weather/Get3hData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ longitude: longitude, latitude: latitude }),
        })
          .then((response) => response.json())
          .then((data) => {
            return data;
          })
          .catch((error) => {
            throw new Error(error);
          });
        break;
      case 1: // Weak View (1d) // https://weather-2-9.onrender.com/Weather/Get12hData
        weatherData = await fetch(`http://127.0.0.1:8000/Weather/Get12hData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ longitude: longitude, latitude: latitude }),
        })
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
    const getCurrentLocation = async () => {
      return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          (pos) => {
            // Update location
            console.log(pos);
            positionData = pos;
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
      await getCurrentLocation();
    } else {
      throw new Error("Location permission denied");
    }

    if (positionData) {
      return positionData;
    } else {
      throw new Error("positionData is null");
    }
  };

  const FormatTime = (_time: string) => {
    // Format time based on time interval type
    // Time example: 2024-10-04 12:00:00
    const time = _time.split(" ");
    switch (timeInterval_type) {
      case 0: // Day View (3h)\
        return `${time[1].split(":")[0]}:00`;
      case 1: // Weak View (1d)
        return `${time[0].split("-")[1]}/${time[0].split("-")[2]}`;
    }
  };

  if (!isLoading) {
    return (
      <Widget style={styles.customWidgetStyle}>
        <View style={styles.titleDisplay}>
          <SvgImage style={{ width: 30, height: 30 }} name="weather" />
          <Text style={styles.title}>Forecast</Text>
        </View>

        <FlatList
          style={{ width: "100%", gap: 10 }}
          data={regions}
          renderItem={({ item }) => (
            <View style={styles.cityView}>
              <Text style={styles.subTitle}>
                {item.name} ({currentTime})
              </Text>

              <FlatList
                horizontal
                style={{ width: "100%" }}
                data={weatherDataList ? weatherDataList[item.id] : []}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.weatherCard}>
                    <Image
                      // source={require("./cloud.png")} // require weather image
                      style={styles.weatherIcon}
                    />
                    <Text style={styles.weatherTime}>
                      {FormatTime(item.time)}
                    </Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.time}
              />
            </View>
          )}
          keyExtractor={(item) => item.id}
        />

        <View style={styles.row}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => HandleUpdateRegion()}
          >
            <SvgImage style={{ width: 40, height: 40 }} name="plus" />
          </TouchableOpacity>

          <ModalDropdown
            options={["Day View (3h)", "Weak View (1d)"]}
            onSelect={(index, value) =>
              HandleUpdateTimeInterval(parseInt(index))
            }
            defaultValue="Select Interval..."
            textStyle={styles.dropdown}
            dropdownStyle={styles.dropdownBox}
          />
        </View>
      </Widget>
    );
  } else {
    return (
      <Widget style={styles.customWidgetStyle}>
        <View style={styles.titleDisplay}>
          <SvgImage style={{ width: 30, height: 30 }} name="weather" />
          <Text style={styles.title}>Forecast</Text>
        </View>

        <Text style={styles.title}>Loading......</Text>
      </Widget>
    );
  }
}

// Default Style
const styles = StyleSheet.create({
  customWidgetStyle: {
    minHeight: "auto",
    justifyContent: "center",
    alignItems: "center",
  },
  cityView: {
    width: "100%",
    overflow: "hidden",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  titleDisplay: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
  },
  title: {
    color: "white",
    fontSize: 24,
    textAlign: "left",
  },
  subTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  weatherScroll: {
    flexDirection: "row",
  },
  weatherCard: {
    width: 60,
    height: 80,
    backgroundColor: "#EAEAEA30",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 5,
  },
  weatherIcon: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  weatherTime: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF00",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 24,
    color: "#000000",
  },
  dropdown: {
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
  row: {
    minWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
});
