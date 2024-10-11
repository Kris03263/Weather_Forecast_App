import { createSlice } from "@reduxjs/toolkit";

import { DailySportSug } from "@/app/(tabs)";

const dailySportSugSlice = createSlice({
  name: "dailySportSugSlice",
  initialState: [] as DailySportSug[],
  reducers: {
    updateDailySportSug: (state, action: { payload: DailySportSug[] }) => {
      state = action.payload;
    },
  },
});

export const { updateDailySportSug } = dailySportSugSlice.actions;
export default dailySportSugSlice.reducer;
