import { createSlice } from "@reduxjs/toolkit";

import { WeatherDataList, WeatherData } from "@/app/(tabs)/_layout";

const weatherDataSlice = createSlice({
  name: "weatherData",
  initialState: {} as WeatherDataList,
  reducers: {
    updateWeatherData3h: (state, action: { payload: WeatherData[] }) => {
      const key = `${action.payload[0].city}, ${action.payload[0].district}`;
      if (!state[key]) {
        state[key] = [];
      }
      state[key][0] = action.payload;
    },
    updateWeatherData12h: (state, action: { payload: WeatherData[] }) => {
      const key = `${action.payload[0].city}, ${action.payload[0].district}`;
      if (!state[key]) {
        state[key] = [];
      }
      state[key][1] = action.payload;
    },
  },
});

export const { updateWeatherData3h, updateWeatherData12h } =
  weatherDataSlice.actions;
export default weatherDataSlice.reducer;
