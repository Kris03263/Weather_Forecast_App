import { configureStore } from "@reduxjs/toolkit";

import regionSlice from "./regionListSlice";
import weatherDataSlice from "./weatherDataSlice";
import timeIntervalSlice from "./timeIntervalSlice";

const store = configureStore({
  reducer: {
    region: regionSlice,
    weatherData: weatherDataSlice,
    timeInterval: timeIntervalSlice,
  },
});

export default store;
