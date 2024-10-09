import { createSlice } from "@reduxjs/toolkit";

import { UserSettings, Sport, Habit } from "@/app/(tabs)";
import { setUser } from "./userSlice";

const userSettingsSlice = createSlice({
  name: "userSettingsSlice",
  initialState: { sport: [], habit: [] } as UserSettings,
  reducers: {
    updateSport: (state, action: { payload: Sport[] }) => {
      state.sport = action.payload;
    },
    updateHabit: (state, action: { payload: Habit[] }) => {
      state.habit = action.payload;
    },
    setUserSettings: (state, action: { payload: UserSettings }) => {
      return action.payload;
    }
  },
});

export const { updateSport, updateHabit, setUserSettings } =
userSettingsSlice.actions;
export default userSettingsSlice.reducer;
