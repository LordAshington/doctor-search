import {
  combineReducers,
  configureStore,
  createListenerMiddleware,
} from "@reduxjs/toolkit";
import appReducer from "./slices/doctorStoreSlice";
import appointmentReducer from "./slices/appointmentStoreSlice";
import { fetchDoctors } from "./slices/doctorStoreSlice";
import { setAppointmentSlots } from "./slices/appointmentStoreSlice";
import { splitTimeSlots } from "../utils/timeUtils";
import { persistStore, persistReducer } from "redux-persist";
import { createAsyncStorage } from "@react-native-async-storage/async-storage";

const listenerMiddleware = createListenerMiddleware();

// Listen for fetchDoctors.fulfilled and generate appointment slots
listenerMiddleware.startListening({
  actionCreator: fetchDoctors.fulfilled,
  effect: (action, listenerApi) => {
    const doctors = action.payload;
    if (Array.isArray(doctors) && doctors.length > 0) {
      // Generate all appointment slots from all doctors
      const allSlots = doctors.flatMap((doctor) => splitTimeSlots(doctor));
      // Dispatch to appointment store
      listenerApi.dispatch(setAppointmentSlots(allSlots));
    }
  },
});

// Config for the persisted storage using AsyncStorage with redux persist
const storage = createAsyncStorage("redux");

const rootReducer = combineReducers({
  app: appReducer,
  appointments: appointmentReducer,
});

const persistConfig = {
  key: "root",
  storage: storage, // Use AsyncStorage for React Native
  whitelist: ["appointments"], // Only persist the appointments slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).prepend(listenerMiddleware.middleware),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
