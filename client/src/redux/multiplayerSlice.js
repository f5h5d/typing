import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isMultiplayer: false,
  room: 0,
  mode: -1, // 0 is quotes 1 is words
  otherPlayersData: {},
  socketID: "",
  racePlacement: 0,
  preRaceTimer: -1, // -1 means that no timer currently
  hasRaceStarted: false,
};

const multiplayerSlice = createSlice({
  name: "multiplayer",
  initialState,
  reducers: {
    setIsMultiplayer: (state, action) => {
      state.isMultiplayer = action.payload;
    },
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    setInitalOtherPlayersData: (state, action) => {
      state.otherPlayersData = action.payload;
    },
    setSocketID: (state, action) => {
      state.socketID = action.payload;
    },
    setRacePlacement: (state, action) => {
      state.racePlacement = action.payload;
    },
    setPreRaceTimer: (state, action) => {
      state.preRaceTimer = action.payload;
    },
    setHasRaceStarted: (state, action) => {
      state.hasRaceStarted = action.payload;
    },


    // setOtherPlayersData: (state, action) => {
    //   state.otherPlayersData = {
    //     ...state.otherPlayersData,
    //     ...action.payload,
    //   };
    // },

    setOtherPlayersData: (state, action) => {
      state.otherPlayersData = action.payload;
    },
  },
});


export const {
  setMode,
  setOtherPlayersData,
  setInitalOtherPlayersData,
  setSocketID,
  setRacePlacement,
  setPreRaceTimer,
  setHasRaceStarted,
  setIsMultiplayer
  // reset,
} = multiplayerSlice.actions;

export default multiplayerSlice.reducer;
