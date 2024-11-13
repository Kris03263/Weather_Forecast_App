import { createSlice } from "@reduxjs/toolkit";

import { UserSettings, Sport, Habit } from "@/app/(tabs)/_layout";

const userSettingsSlice = createSlice({
  name: "userSettingsSlice",
  initialState: { sport: [], habit: [] } as UserSettings,
  reducers: {
    setSport: (state, action: { payload: Sport[] }) => {
      state.sport = action.payload;
    },
    setHabit: (state, action: { payload: Habit[] }) => {
      state.habit = action.payload;
    },
    setUserSettings: (state, action: { payload: UserSettings }) => {
      return action.payload;
    },
  },
});

export const { setSport, setHabit, setUserSettings } =
  userSettingsSlice.actions;
export default userSettingsSlice.reducer;
