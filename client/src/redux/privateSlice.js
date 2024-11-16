import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  roomID: "",
  joiningRoom: false,
  startPrivateGame: false,
  roomOwner: false,
};

const privateSlice = createSlice({
  name: "privateLobby",
  initialState,
  reducers: {
    setRoomID: (state, action) => {
      state.roomID = action.payload;
    },
    setJoiningRoom: (state, action) => {
      state.joiningRoom = action.payload;
    },
    setStartPrivateGame: (state, action) => {
      state.startPrivateGame = action.payload;
    },
    setRoomOwner: (state, action) => {
      state.roomOwner = action.payload;
    }
  },
});


export const {
  setRoomID,
  setJoiningRoom,
  setStartPrivateGame,
  setRoomOwner
  // reset,
} = privateSlice.actions;

export default privateSlice.reducer;
