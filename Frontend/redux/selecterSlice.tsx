import { createSlice } from "@reduxjs/toolkit";

import { Region, Selecter } from "@/app/(tabs)/_layout";

const selecterSlice = createSlice({
  name: "selecter",
  initialState: {} as Selecter,
  reducers: {
    setSelectedRegionIndex: (state, action: { payload: number }) => {
      state.regionIndex = action.payload;
    },
    setSelectedTimeInterval: (state, action: { payload: number }) => {
      state.timeInterval = action.payload;
    },
  },
});

export const { setSelectedRegionIndex, setSelectedTimeInterval } =
  selecterSlice.actions;
export default selecterSlice.reducer;
