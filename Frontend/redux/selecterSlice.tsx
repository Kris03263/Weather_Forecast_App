import { createSlice } from "@reduxjs/toolkit";

import { Selecter } from "@/app/(tabs)/_layout";

const selecterSlice = createSlice({
  name: "selecter",
  initialState: {} as Selecter,
  reducers: {
    updateRegion: (state, action: { payload: string }) => {
      state.region = action.payload;
    },
    updateTimeInterval: (state, action: { payload: number }) => {
      state.timeInterval = action.payload;
    },
  },
});

export const { updateRegion, updateTimeInterval } = selecterSlice.actions;
export default selecterSlice.reducer;
