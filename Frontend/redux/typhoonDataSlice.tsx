import { createSlice } from "@reduxjs/toolkit";

import { TyphoonData } from "@/app/(tabs)/_layout";

const TyphoonDataSlice = createSlice({
  name: "typhoonDataSlice",
  initialState: [] as TyphoonData[],
  reducers: {
    setTyphoonData: (state, action: { payload: TyphoonData[] }) => {
      return action.payload;
    },
  },
});

export const { setTyphoonData } = TyphoonDataSlice.actions;
export default TyphoonDataSlice.reducer;
