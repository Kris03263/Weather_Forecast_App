import { createSlice } from "@reduxjs/toolkit";

import { selecter } from "@/app/(tabs)/_layout";

const selecterSlice = createSlice({
  name: "selecter",
  initialState: {} as selecter,
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
