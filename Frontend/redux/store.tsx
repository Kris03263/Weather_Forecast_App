import { configureStore } from "@reduxjs/toolkit";

import regionSlice from "./regionListSlice";
import weatherDataSlice from "./weatherDataSlice";
import selecterSlice from "./selecterSlice";
import userSlice from "./userSlice";
import userSettingsSlice from "./userSettingsSlice";

const store = configureStore({
  reducer: {
    region: regionSlice,
    weatherData: weatherDataSlice,
    selecter: selecterSlice,
    user: userSlice,
    userSettings: userSettingsSlice,
  },
});

export default store;
