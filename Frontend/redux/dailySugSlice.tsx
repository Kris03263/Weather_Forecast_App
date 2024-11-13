import { createSlice } from "@reduxjs/toolkit";

import { DailySug } from "@/app/(tabs)/_layout";

const dailySugSlice = createSlice({
  name: "dailySugSlice",
  initialState: {} as DailySug,
  reducers: {
    setDailySug: (state, action: { payload: DailySug }) => {
      return action.payload;
    },
  },
});

export const { setDailySug } = dailySugSlice.actions;
export default dailySugSlice.reducer;
