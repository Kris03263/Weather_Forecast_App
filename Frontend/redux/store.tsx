import { configureStore } from "@reduxjs/toolkit";

import regionsSlice from "./regionsSlice";
import weatherDataSlice from "./weatherDataSlice";
import selecterSlice from "./selecterSlice";
import userSlice from "./userSlice";
import userSettingsSlice from "./userSettingsSlice";
import dailySugSlice from "./dailySugSlice";
import globalMessageSlice from "./globalMessageSlice";
import earthquakeDataSlice from "./earthquakeDataSlice";

const store = configureStore({
  reducer: {
    regions: regionsSlice,
    weatherData: weatherDataSlice,
    selecter: selecterSlice,
    user: userSlice,
    userSettings: userSettingsSlice,
    dailySug: dailySugSlice,
    globalMessage: globalMessageSlice,
    earthquakeData: earthquakeDataSlice,
  },
});

export default store;
