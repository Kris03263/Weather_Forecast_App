import { createSlice } from "@reduxjs/toolkit";

import { Region } from "@/app/(tabs)/_layout";

const regionsSlice = createSlice({
  name: "regions",
  initialState: [] as Region[],
  reducers: {
    // addRegion: (state, action: { payload: Region }) => {
    //   return [...state, action.payload];
    // },
    // removeRegion: (state, action: { payload: string }) => {
    //   return state.filter((region) => region.id !== action.payload);
    // },
    setRegions: (state, action: { payload: Region[] }) => {
      return action.payload;
    },
    // updateRegion: (state, action: { payload: Region }) => {
    //   if (!state.find((region) => region.id === action.payload.id)) {
    //     return [...state, action.payload];
    //   }
    //   return state.map((region) =>
    //     region.id === action.payload.id ? action.payload : region
    //   );
    // },
  },
});

export const { setRegions } = regionsSlice.actions;
export default regionsSlice.reducer;
