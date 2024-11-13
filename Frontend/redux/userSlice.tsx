import { createSlice } from "@reduxjs/toolkit";

import { User } from "@/app/(tabs)/_layout";

const userSlice = createSlice({
  name: "userSlice",
  initialState: { id: "-1", account: "", password: "", status: "" } as User,
  reducers: {
    setUserAccount: (state, action: { payload: string }) => {
      state.account = action.payload;
    },
    setUserPassword: (state, action: { payload: string }) => {
      state.password = action.payload;
    },
    setUser: (state, action: { payload: User }) => {
      return action.payload;
    },
    removeUser: (state) => {
      return { id: "-1", account: "", password: "", status: "" } as User;
    },
  },
});

export const { setUserAccount, setUserPassword, setUser, removeUser } =
  userSlice.actions;
export default userSlice.reducer;
