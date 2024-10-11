import { createSlice } from "@reduxjs/toolkit";

import { User } from "@/app/(tabs)";

const userSlice = createSlice({
  name: "userSlice",
  initialState: { id: "-1", account: "", password: "", status: "" } as User,
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
  },
});

export const { updateUserAccount, updateUserPassword, setUser } =
  userSlice.actions;
export default userSlice.reducer;
