import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const createStudent = createAsyncThunk("createStudent", async (data,thunkAPI) => {
  try {
    const res = await axiosInstance.post("/admin/create-student",data);
    toast.success("Student created successfully" || res.data.message);
    return res.data.data.user;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to create student");
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
}) 

export const updateStudent = createAsyncThunk("updateStudent", async ({id,data},thunkAPI) => {
  try {
    const res = await axiosInstance.put(`/admin/update-student/${id}`,data);
    toast.success("Student updated successfully" || res.data.message);
    return res.data.data.user;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to update student");
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
}) 

export const deleteStudent = createAsyncThunk("deleteStudent", async (id,thunkAPI) => {
  try {
    const res = await axiosInstance.delete(`/admin/delete-student/${id}`);
    toast.success("Student deleted successfully" || res.data.message);
    return id;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to delete student");
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
})

export const getAllUsers = createAsyncThunk("getAllUsers", async (id,thunkAPI) => {
  try {
    const res = await axiosInstance.get(`/admin/users`);
    return res.data.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to fetch users");
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
})

export const createTeacher = createAsyncThunk("createTeacher", async (data,thunkAPI) => {
  try {
    const res = await axiosInstance.post("/admin/create-teacher",data);
    toast.success("Teacher created successfully" || res.data.message);
    return res.data.data.user;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to create teacher");
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
}) 

export const updateTeacher = createAsyncThunk("updateTeacher", async ({id,data},thunkAPI) => {
  try {
    const res = await axiosInstance.put(`/admin/update-teacher/${id}`,data);
    toast.success("Teacher updated successfully" || res.data.message);
    return res.data.data.user;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to update teacher");
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
}) 

export const deleteTeacher = createAsyncThunk("deleteTeacher", async (id,thunkAPI) => {
  try {
    const res = await axiosInstance.delete(`/admin/delete-teacher/${id}`);
    toast.success("Teacher deleted successfully" || res.data.message);
    return id;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to delete teacher");
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
})

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    students: [],
    teachers: [],
    projects: [],
    users: [],
    stats: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createStudent.fulfilled, (state, action) => {
        if(state.users) {
          state.users.unshift(action.payload);
        }
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        if(state.users) {
          state.users = state.users.map(user => user._id === action.payload._id ? {...user,...action.payload} : user);
        }
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        if(state.users) {
          state.users = state.users.filter(user => user._id !== action.payload);
        }
      })
      .addCase(createTeacher.fulfilled, (state, action) => {
        if(state.users) {
          state.users.unshift(action.payload);
        }
      })
      .addCase(updateTeacher.fulfilled, (state, action) => {
        if(state.users) {
          state.users = state.users.map(user => user._id === action.payload._id ? {...user,...action.payload} : user);
        }
      })
      .addCase(deleteTeacher.fulfilled, (state, action) => {
        if(state.users) {
          state.users = state.users.filter(user => user._id !== action.payload);
        }
      })
}});

export default adminSlice.reducer;
