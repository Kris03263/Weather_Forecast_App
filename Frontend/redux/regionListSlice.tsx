import { createSlice } from "@reduxjs/toolkit";

import { Region } from "@/app/(tabs)/_layout";

const regionListSlice = createSlice({
  name: "regionList",
  initialState: [] as Region[],
  reducers: {
    addRegion: (state, action: { payload: Region }) => {
      return [...state, action.payload];
    },
    removeRegion: (state, action: { payload: string }) => {
      return state.filter((region) => region.id !== action.payload);
    },
    setRegion: (state, action: { payload: Region[] }) => {
      return action.payload;
    },
    updateRegion: (state, action: { payload: Region }) => {
      if (!state.find((region) => region.id === action.payload.id)) {
        return [...state, action.payload];
      }
      return state.map((region) =>
        region.id === action.payload.id ? action.payload : region
      );
    },
  },
});

export const { addRegion, removeRegion, setRegion, updateRegion } =
  regionListSlice.actions;
export default regionListSlice.reducer;
