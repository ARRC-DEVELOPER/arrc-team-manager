// src/reducers/departmentsReducer.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  departments: null,
  department: null,  // for single department (optional)
  message: null,
  error: null,
};

const departmentsSlice = createSlice({
  name: "departments",
  initialState,
  reducers: {
    // Fetch all departments
    getDepartmentsRequest: (state) => {
      state.loading = true;
    },
    getDepartmentsSuccess: (state, action) => {
      state.loading = false;
      state.departments = action.payload;
    },
    getDepartmentsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create new department
    createDepartmentRequest: (state) => {
      state.loading = true;
    },
    createDepartmentSuccess: (state, action) => {
      state.loading = false;
      state.department = action.payload.department;
      state.message = action.payload.message;
    },
    createDepartmentFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update department
    updateDepartmentRequest: (state) => {
      state.loading = true;
    },
    updateDepartmentSuccess: (state, action) => {
      state.loading = false;
      state.departments = state.departments.map(department =>
        department._id === action.payload._id ? action.payload : department
      );
      state.message = action.payload.message;
    },
    updateDepartmentFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete department
    deleteDepartmentRequest: (state) => {
      state.loading = true;
    },
    deleteDepartmentSuccess: (state, action) => {
      state.loading = false;
      state.departments = state.departments.filter(department => department._id !== action.payload);
      state.message = action.payload.message;
    },
    deleteDepartmentFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Clear Error & Message
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
});

// Exporting the actions and reducer
export const {
  getDepartmentsRequest,
  getDepartmentsSuccess,
  getDepartmentsFail,
  createDepartmentRequest,
  createDepartmentSuccess,
  createDepartmentFail,
  updateDepartmentRequest,
  updateDepartmentSuccess,
  updateDepartmentFail,
  deleteDepartmentRequest,
  deleteDepartmentSuccess,
  deleteDepartmentFail,
  clearError,
  clearMessage,
} = departmentsSlice.actions;

export default departmentsSlice.reducer;
