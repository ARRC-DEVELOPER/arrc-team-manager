// src/actions/departmentActions.js
import axios from 'axios';
import { server } from '../store';
import {
  createDepartmentRequest,
  createDepartmentSuccess,
  createDepartmentFail,
  updateDepartmentRequest,
  updateDepartmentSuccess,
  updateDepartmentFail,
  deleteDepartmentRequest,
  deleteDepartmentSuccess,
  deleteDepartmentFail,
  getDepartmentsRequest,
  getDepartmentsSuccess,
  getDepartmentsFail,
} from '../reducers/departmentsReducer.js';

// Fetch all departments
export const getDepartments = () => async (dispatch) => {
  try {
    dispatch(getDepartmentsRequest());
    const { data } = await axios.get(`${server}/departments`, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    dispatch(getDepartmentsSuccess(data.departments)); // Assuming 'departments' is in response
  } catch (error) {
    console.error("Error fetching departments:", error);
    dispatch(getDepartmentsFail(error.response?.data?.message || error.message));
  }
};

// Create a new department
export const createDepartment = (departmentData) => async (dispatch) => {
  try {
    dispatch(createDepartmentRequest());
    const { data } = await axios.post(`${server}/departments`, departmentData, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    dispatch(createDepartmentSuccess(data.department)); // Assuming 'department' is in response
  } catch (error) {
    console.error("Error creating department:", error);
    dispatch(createDepartmentFail(error.response?.data?.message || error.message));
  }
};

// Update an existing department
export const updateDepartment = (departmentId, departmentData) => async (dispatch) => {
  try {
    dispatch(updateDepartmentRequest());
    const { data } = await axios.put(`${server}/departments/${departmentId}`, departmentData, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    dispatch(updateDepartmentSuccess(data.department)); // Assuming 'department' is in response
  } catch (error) {
    console.error("Error updating department:", error);
    dispatch(updateDepartmentFail(error.response?.data?.message || error.message));
  }
};

// Delete a department
export const deleteDepartment = (departmentId) => async (dispatch) => {
  try {
    dispatch(deleteDepartmentRequest());
    const { data } = await axios.delete(`${server}/departments/${departmentId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    dispatch(deleteDepartmentSuccess(data.message || departmentId)); // Assuming 'message' or departmentId in response
  } catch (error) {
    console.error("Error deleting department:", error);
    dispatch(deleteDepartmentFail(error.response?.data?.message || error.message));
  }
};
