import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppointmentSlotType } from "../../types/appointmentSlotStoreTypes";

interface AppState {
  isLoading: boolean;
  appointmentSlots: AppointmentSlotType[] | null;
  error: string | null;
  bookedAppointments: AppointmentSlotType[] | null;
}

const initialState: AppState = {
  isLoading: false,
  appointmentSlots: null,
  error: null,
  bookedAppointments: [],
};

const appointmentStore = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAppointmentSlots: (
      state,
      action: PayloadAction<AppointmentSlotType[]>,
    ) => {
      state.appointmentSlots = action.payload;
    },
    clearAppointmentSlots: (state) => {
      state.appointmentSlots = null;
      state.error = null;
    },
    addBookedAppointment: (
      state,
      action: PayloadAction<AppointmentSlotType>,
    ) => {
      state.bookedAppointments = [
        ...(state.bookedAppointments || []),
        action.payload,
      ];
    },
    clearBookedAppointment: (
      state,
      action: PayloadAction<AppointmentSlotType>,
    ) => {
      const index = state.bookedAppointments?.findIndex(
        (appointment) =>
          appointment.name === action.payload.name &&
          appointment.available_at === action.payload.available_at &&
          appointment.available_until === action.payload.available_until,
      );
      if (index !== undefined && index > -1 && state.bookedAppointments) {
        state.bookedAppointments.splice(index, 1);
      }
    },
  },
});

export const {
  setLoading,
  setAppointmentSlots,
  clearAppointmentSlots,
  addBookedAppointment,
  clearBookedAppointment,
} = appointmentStore.actions;
export default appointmentStore.reducer;
