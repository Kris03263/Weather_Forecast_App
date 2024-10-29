import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  ScrollView,
  FlatList,
} from "react-native";
import { useSelector } from "react-redux";

import {
  Selecter,
  WeatherDataList,
  WeatherData,
  Region,
  userAddRegion,
} from "./_layout";

import { Background } from "@/components/Background";
import { SvgImage } from "@/components/Svg";

export default function MenuScreen() {
  const region = useSelector((state: { region: Region[] }) => state.region);
  const weatherDataList = useSelector(
    (state: { weatherData: WeatherDataList }) => state.weatherData
  );

  return (
    <View style={styles.container}>
      {/* Gradiant */}
      {/* <Background weatherData={weatherData} /> */}

      <View
        style={{
          backgroundColor: "#191919",
          height: "100%",
          width: "100%",
          position: "absolute",
          zIndex: -1,
        }}
      />

      {/* Header */}
      <View style={styles.topSection}>
        <View style={styles.headerLayout}>
          <Text style={styles.headerText}>地區</Text>

          <TouchableOpacity
            onPress={async () => {
              userAddRegion({
                name: "臺北市, 大同區",
                id: "1",
                latitude: "25.0478",
                longitude: " 121.5155",
              });
            }}
          >
            <SvgImage
              style={{
                width: 30,
                height: 30,
              }}
              name="plus"
            ></SvgImage>
          </TouchableOpacity>
        </View>
      </View>

      {/* Body */}
      {weatherDataList && (
        <ScrollView style={styles.bodySection}>
          <FlatList
            data={region ?? []}
            renderItem={({ item }) =>
              regionCard(
                item.name,
                weatherDataList[item.name]?.[0]?.[0] ?? null
              )
            }
            keyExtractor={(item) => item.name}
          />
        </ScrollView>
      )}
    </View>
  );
}

function regionCard(region: string, weatherData: WeatherData) {
  return (
    <TouchableOpacity>
      <View style={styles.regionCard}>
        <Background weatherData={weatherData} style={{ borderRadius: 12 }} />

        <View style={styles.regionCardDisplay}>
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.regionCardTitleText}>{region}</Text>
            <Text style={styles.regionCardSubText}>{"當前地區"}</Text>
          </View>
          <Text style={styles.regionCardTemperatureText}>
            {(weatherData?.temp ?? "--") + "°C"}
          </Text>
        </View>

        <View style={styles.regionCardDisplay}>
          <Text style={styles.regionCardText}>{"晴天"}</Text>
          <Text style={styles.regionCardText}>{"最高溫度 | 最低溫度"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 16,
    color: "white",
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  linkText: {
    color: "gray",
    textDecorationLine: "underline",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: "3%",
    marginTop: "10%",
  },
  headerText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  headerLayout: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    width: "100%",
  },
  bodySection: {
    backgroundColor: "#FFFFFF01",
    height: "70%",
    padding: "3%",
    paddingBottom: "20%",
  },
  regionCard: {
    margin: 5,
    padding: 10,
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 10,
  },
  regionCardDisplay: { flexDirection: "row", justifyContent: "space-between" },
  regionCardTitleText: { color: "white", fontSize: 20, fontWeight: "bold" },
  regionCardSubText: { color: "gray", fontSize: 12 },
  regionCardTemperatureText: { color: "white", fontSize: 36 },
  regionCardText: { color: "white", fontSize: 12 },
});
