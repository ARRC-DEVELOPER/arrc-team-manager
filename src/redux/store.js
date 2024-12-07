import { configureStore } from "@reduxjs/toolkit";

// Importing Reducers
import userReducer from "./reducers/userReducer";
import departmentsReducer from "./reducers/departmentsReducer";

// Deplopement URL
// export const server = "http://localhost:5000/api";

// Production URL
export const server = "https://arrc-team-manager-server.onrender.com/api";

const store = configureStore({
  reducer: {
    user: userReducer,
    // departments: departmentsReducer, // Add departments reducer
    departments: departmentsReducer,
  },
});

export default store;
