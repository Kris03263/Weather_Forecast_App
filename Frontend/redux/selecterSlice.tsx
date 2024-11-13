import { createSlice } from "@reduxjs/toolkit";

import { Region, Selecter } from "@/app/(tabs)/_layout";

const selecterSlice = createSlice({
  name: "selecter",
  initialState: {
    regionIndex: 0,
    timeInterval: 0,
    targetRegionIndex: 0,
  } as Selecter,
  reducers: {
    setSelectedRegionIndex: (state, action: { payload: number }) => {
      state.regionIndex = action.payload;
    },
    setSelectedTimeInterval: (state, action: { payload: number }) => {
      state.timeInterval = action.payload;
    },
    setSelectedTargetRegionIndex: (state, action: { payload: number }) => {
      state.targetRegionIndex = action.payload;
    },
  },
});

export const {
  setSelectedRegionIndex,
  setSelectedTimeInterval,
  setSelectedTargetRegionIndex,
} = selecterSlice.actions;
export default selecterSlice.reducer;
