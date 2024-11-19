import { createSlice } from "@reduxjs/toolkit";

import { EarthquakeData, EarthquakeDataList } from "@/app/(tabs)/_layout";

const earthquakeDataSlice = createSlice({
  name: "earthquakeData",
  initialState: {} as EarthquakeDataList,
  reducers: {
    setRecentEarthquakeData: (state, action: { payload: EarthquakeData }) => {
      state.recent = action.payload;
    },
    setHistoryEarthquakeData: (
      state,
      action: { payload: EarthquakeData[] }
    ) => {
      state.history = action.payload;
    },
  },
});

export const { setRecentEarthquakeData, setHistoryEarthquakeData } =
  earthquakeDataSlice.actions;
export default earthquakeDataSlice.reducer;
