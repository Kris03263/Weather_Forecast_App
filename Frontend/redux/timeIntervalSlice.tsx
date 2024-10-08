import { createSlice } from "@reduxjs/toolkit";

interface timeInterval {
  timeInterval: number;
}

const timeIntervalSlice = createSlice({
  name: "timeInterval",
  initialState: 0,
  reducers: {
    updateTimeInterval: (state, action: { payload: number }) =>
      (state = action.payload),
  },
});

export const { updateTimeInterval } = timeIntervalSlice.actions;
export default timeIntervalSlice.reducer;
