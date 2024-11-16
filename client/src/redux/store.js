import { configureStore } from "@reduxjs/toolkit";
import typingReducer from "./typingSlice";
import multiplayerReducer from "./multiplayerSlice";
import privateReducer from "./privateSlice";

export default configureStore({
  reducer: {
    typing: typingReducer,
    multiplayer: multiplayerReducer,
    private: privateReducer,
  },
});
