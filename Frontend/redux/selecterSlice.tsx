import { createSlice } from "@reduxjs/toolkit";

import { Region, Selecter } from "@/app/(tabs)/_layout";

const selecterSlice = createSlice({
  name: "selecter",
  initialState: {} as Selecter,
  reducers: {
    setSelectedRegion: (state, action: { payload: string }) => {
      state.region = action.payload;
    },
    setSelectedTimeInterval: (state, action: { payload: number }) => {
      state.timeInterval = action.payload;
    },
  },
});

export const { setSelectedRegion, setSelectedTimeInterval } =
  selecterSlice.actions;
export default selecterSlice.reducer;
