import { configureStore } from "@reduxjs/toolkit";

// Importing Reducers
import userReducer from "./reducers/userReducer";
import departmentsReducer from "./reducers/departmentsReducer";


// PRODUCTION
export const server = "https://task-manager-backend-btas.onrender.com/api";

// DEVELOPMENT
// export const server = "http://localhost:2000/api/v1";

const store = configureStore({
  reducer: {
    user: userReducer,
    // departments: departmentsReducer, // Add departments reducer
    departments: departmentsReducer,

  },
});

export default store;
