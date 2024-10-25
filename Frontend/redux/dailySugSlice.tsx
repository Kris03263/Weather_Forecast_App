import { createSlice } from "@reduxjs/toolkit";

import { DailySug } from "@/app/(tabs)/_layout";

const dailySugSlice = createSlice({
  name: "dailySugSlice",
  initialState: {} as DailySug,
  reducers: {
    updateDailySug: (state, action: { payload: DailySug }) => {
      return action.payload;
    },
  },
});

export const { updateDailySug } = dailySugSlice.actions;
export default dailySugSlice.reducer;
