import { createSlice } from "@reduxjs/toolkit";

import { GlobalMessage } from "@/app/(tabs)/_layout";

const globalMessageSlice = createSlice({
  name: "globalMessage",
  initialState: { message: "", isVisible: false } as GlobalMessage,
  reducers: {
    setMessage: (state, action: { payload: string }) => {
      state.message = action.payload;
    },
    setVisible: (state, action: { payload: boolean }) => {
      state.isVisible = action.payload;
    },
  },
});

export const { setMessage, setVisible } = globalMessageSlice.actions;
export default globalMessageSlice.reducer;
