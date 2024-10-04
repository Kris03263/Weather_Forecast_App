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
import { useEffect, useState } from "react";
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
// - [ ] Add weather data API
// - [ ] Add weather image
// - [ ] Add longtitute and latitude to region document

export function ForecastDisplayWidget() {
  const [weatherDataList, setWeatherDataList] =
    useState<WeatherDataList | null>(null);
  const [location, setLocation] = useState<GeoPosition | null>(null);
  const [regions, setRegions] = useState<Region[] | null>(null);
  const [timeInterval_type, setTimeInterval] = useState(0);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    // Upadate current time
    HandleUpdateCurrentTime();

    // Get location data
    HandleGetLocation();

    // Add region based on location
    HandleAddRegion(
      location ? location.coords.latitude.toString() : "121.66248756678424", // location : default location
      location ? location.coords.longitude.toString() : "25.06715187342581"
    );
  }, []);

  const HandleAddRegion = async (latitude: string, longitude: string) => {
    // Fetch API to get region name
    const weatherData = await HandleGetWeatherData(latitude, longitude);
    if (!weatherData) {
      console.error("Failed to fetch weather data");
      return;
    }

    // Define region id and name
    const id = `${weatherData[0].district}, ${weatherData[0].city}`;
    const name = `${weatherData[0].district}, ${weatherData[0].city}`;

    // Add new region
    setRegions([
      ...(regions || []),
      {
        id: id,
        name: name,
        latitude: latitude,
        longitude: longitude,
      },
    ]);

    // Update weather data
    HandleUpdateWeatherDataList();
  };

  const HandleGetLocation = async () => {
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
          console.log("Location permission denied");
          return false;
        }
      } else {
        return true;
      }
    };

    // Get current location
    if (await requestLocationPermission()) {
      Geolocation.getCurrentPosition(
        (position) => {
          setLocation(position);
          return position;
        },
        (error) => {
          console.error(error);
          return null;
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }
  };

  const HandleGetWeatherData = async (
    latitude: string,
    longitude: string
  ): Promise<WeatherData[] | null> => {
    console.log(latitude, longitude);
    // Fetch API to get weather data
    switch (timeInterval_type) {
      case 0: // Day View (3h) // http://127.0.0.1:8000/Weather/Get3hData
        fetch(`http://127.0.0.1:8000/Weather/Get3hData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ latitude: latitude, longitude: longitude }),
        })
          .then((response) => response.json())
          .then((data) => {
            return data;
          })
          .catch((error) => {
            console.error("Error:", error);
            return null;
          });
      case 1: // Weak View (1d) // http://127.0.0.1:8000/Weather/Get12hData
        fetch(`http://127.0.0.1:8000/Weather/Get12hData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ latitude: latitude, longitude: longitude }),
        })
          .then((response) => response.json())
          .then((data) => {
            return data;
          })
          .catch((error) => {
            console.error("Error:", error);
            return null;
          });
      default:
        return null;
    }
  };

  const HandleUpdateCurrentTime = () => {
    const date = new Date().toLocaleDateString();

    // Update current time
    setCurrentTime(date);
  };

  const HandleUpdateTimeInterval = (type: number) => {
    // Set time interval type
    setTimeInterval(type);

    // Update weather data
    HandleUpdateWeatherDataList();
  };

  const HandleUpdateWeatherDataList = () => {
    const weatherDataList: WeatherDataList = {};

    // Fetch weather data for each region
    regions?.map(async (region) => {
      const latitude = region.latitude;
      const longitude = region.longitude;
      const weatherData = await HandleGetWeatherData(latitude, longitude);
      if (weatherData) {
        weatherDataList[region.id] = weatherData;
      }
    });

    // Update weather data
    setWeatherDataList(weatherDataList);
  };

  const HandleGetTimeFormat = (_time: string) => {
    // Format time based on time interval type
    // Time example: 2024-10-04 12:00:00
    const time = _time.split(" ");
    switch (timeInterval_type) {
      case 0: // Day View (3h)\
        return `${time[1].split(":")[0]}:00`;
        break;
      case 1: // Weak View (1d)
        return `${time[0].split("-")[1]}/${time[0].split("-")[2]}`;
        break;
    }
  };

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
              {item.name} ({currentTime}){" "}
              {location?.coords.latitude + "/" + location?.coords.longitude}
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
                    {HandleGetTimeFormat(item.time)}
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
        <Text style={styles.subTitle}>Add City:</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => HandleAddRegion("thisIs", "test")}
        >
          <SvgImage style={{ width: 40, height: 40 }} name="plus" />
        </TouchableOpacity>

        <Text style={styles.subTitle}>Time Interval:</Text>
        <ModalDropdown
          options={["Day View (3h)", "Weak View (1d)"]}
          onSelect={(index, value) => HandleUpdateTimeInterval(parseInt(index))}
          defaultValue="Day View (3h)"
          textStyle={styles.dropdown}
          dropdownStyle={styles.dropdownBox}
        />
      </View>
    </Widget>
  );
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
