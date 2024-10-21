import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// Define the initial state using that type
const initialState = {
    isLoggedIn: false,
    token: null,
    user: null
}

// Slices contain Redux reducer logic for updating state, and
// generate actions that can be dispatched to trigger those updates.
export const loginSlice = createSlice({
  name: 'login',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    loginSuccess: (state, action) => {
        state.isLoggedIn = true;
        state.token = action.payload.refreshToken;
        state.user = action.payload.user;
    },

    logout: (state) => {
        state.isLoggedIn = false;
        state.token = null;
        state.user = null;
    }
  }
})

// Export the generated action creators for use in components
export const { loginSuccess,logout } = loginSlice.actions

// Export the slice reducer for use in the store configuration
export default loginSlice.reducer