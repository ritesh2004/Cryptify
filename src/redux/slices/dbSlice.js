import { createSlice } from "@reduxjs/toolkit";

// ---------------- Initial State ----------------
const initialState = {
  dbName: "",
  isBackup: false,
};

// ---------------- Slice ----------------

const dbSlice = createSlice({
    name: "db",
    initialState,
    reducers: {
        setDbName: (state, action) => {
        state.dbName = action.payload;
        },
        setIsBackup: (state, action) => {
        state.isBackup = action.payload;
        },
    },
});

// ---------------- Actions ----------------
export const { setDbName, setIsBackup } = dbSlice.actions;

// ---------------- Reducer ----------------

export default dbSlice.reducer;