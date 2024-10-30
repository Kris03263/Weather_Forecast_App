import { createSlice } from "@reduxjs/toolkit";

import { User } from "@/app/(tabs)/_layout";

const userSlice = createSlice({
  name: "userSlice",
  initialState: {} as User,
  reducers: {
    updateUserAccount: (state, action: { payload: string }) => {
      state.account = action.payload;
    },
    updateUserPassword: (state, action: { payload: string }) => {
      state.password = action.payload;
    },
    setUser: (state, action: { payload: User }) => {
      return action.payload;
    },
    removeUser: (state) => {
      return { id: "-1", account: "", password: "", status: "" };
    },
  },
});

export const { updateUserAccount, updateUserPassword, setUser, removeUser } =
  userSlice.actions;
export default userSlice.reducer;
