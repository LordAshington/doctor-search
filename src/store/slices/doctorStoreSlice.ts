import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppointmentSlotType } from "../../types/appointmentSlotStoreTypes";

const API_URL = process.env.DOCTORS_URL;

interface AppState {
  isLoading: boolean;
  doctorList: AppointmentSlotType[] | null;
  error: string | null;
}

const initialState: AppState = {
  isLoading: false,
  doctorList: null,
  error: null,
};

export const fetchDoctors = createAsyncThunk(
  "doctors/fetchDoctors",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch doctors",
      );
    }
  },
);

const doctorStore = createSlice({
  name: "app",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setDoctorList: (state, action: PayloadAction<AppointmentSlotType[]>) => {
      state.doctorList = action.payload;
    },
    clearDoctorList: (state) => {
      state.doctorList = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.doctorList = action.payload;
        state.error = null;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setLoading, setDoctorList, clearDoctorList } =
  doctorStore.actions;
export default doctorStore.reducer;
