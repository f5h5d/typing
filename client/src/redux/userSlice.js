import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API } from "../constants"
import axios from "axios"

export const fetchUser = createAsyncThunk('user/fetchUser', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`http://localhost:5000/auth/fetchUser`, { withCredentials: true})
    return response.data; // Return user data
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const logoutUser = (dispatch) => {
  localStorage.remove("token");
  dispatch(clearUser());
}

const initialState = {
  user: null, 
  guestUser: null,
  loading: false,
  error: null,
  userStats: {}
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUserStats: (state, action) => {
      state.userStats = action.payload;
    }
  },
  extraReducers: (builder) => { // extraReducers used for asyncThunk and its life cycle - runs when the thunk is loading (pending), when it has been fulfilled (completed) and if the request was rejected (failed)
    builder
      .addCase(fetchUser.pending, (state) => {
        // When the `fetchUser` thunk is dispatched and is pending
        state.loading = true;  // Set loading state
        state.error = null;    // Clear previous errors
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        // When the `fetchUser` thunk resolves successfully
        state.loading = false;       // Stop loading
        state.user = action.payload; // Update the user with fetched data
      })
      .addCase(fetchUser.rejected, (state, action) => {
        // When the `fetchUser` thunk fails
        state.loading = false;       // Stop loading
        state.error = action.payload; // Set error state
      });
  }
});


export const {
  setUser,
  setUserStats
  // reset,
} = userSlice.actions;

export default userSlice.reducer;
