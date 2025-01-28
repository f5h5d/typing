import { createSlice } from "@reduxjs/toolkit";
import { GUEST_USER_DEFAULT_WPM } from "../constants";

const initialState = {
  guestGamesPlayed: 0,
  guestWpm: GUEST_USER_DEFAULT_WPM,
  guestAccuracy: 0
};

const privateSlice = createSlice({
  name: "privateLobby",
  initialState,
  reducers: {
    updateGuestGamesPlayed: (state, action) => {
      state.guestGamesPlayed += action.payload;
    },
    setGuestWpm: (state, action) => {
      state.guestWpm = action.payload;
    },
    setGuestAccuracy: (state, action) => {
      state.guestAccuracy = action.payload;
    },
  },
});


export const {
  updateGuestGamesPlayed,
  setGuestWpm,
  setGuestAccuracy,
} = privateSlice.actions;

export default privateSlice.reducer;
