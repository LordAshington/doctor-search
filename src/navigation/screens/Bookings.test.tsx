import { Provider } from "react-redux";
import {
  mockAppointmentState,
  mockAppointmentStateWithBookings,
  mockAppState,
  mockBookedAppointments,
} from "../../__mocks__/apiResponses";
import { Bookings } from "./Bookings";
import { configureStore } from "redux-mock-store";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { useNavigation } from "@react-navigation/native";
import {
  combineReducers,
  configureStore as realConfigureStore, // for real store
} from "@reduxjs/toolkit";
import appReducer from "../../store/slices/doctorStoreSlice";
import appointmentReducer from "../../store/slices/appointmentStoreSlice";

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
  })),
}));

jest.mock("../../store/hooks", () => ({
  ...jest.requireActual("../../store/hooks"),
  useAppDispatch: jest.fn(),
}));

jest.useFakeTimers();

const mockStore = configureStore([]);

const store = mockStore({
  app: mockAppState,
  appointments: mockAppointmentStateWithBookings,
});

const storeWithoutBookings = mockStore({
  app: mockAppState,
  appointments: [],
});

describe("Bookings Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should render and show the title", () => {
    render(
      <Provider store={store}>
        <Bookings />
      </Provider>,
    );
    expect(screen.getByText("Your booked appointments:")).toBeVisible();
  });

  it("should show all bookings", () => {
    render(
      <Provider store={store}>
        <Bookings />
      </Provider>,
    );
    expect(screen.getByText("Your booked appointments:")).toBeVisible();
    expect(
      screen.getByTestId("booking-Test White-Monday-9:00 AM"),
    ).toBeVisible();
    expect(
      screen.getByTestId("booking-Test Blue-Monday-9:30 AM"),
    ).toBeVisible();
  });

  it("should allow a user to cancel their booking", async () => {
    const realStore = realConfigureStore({
      reducer: combineReducers({
        app: appReducer,
        appointments: appointmentReducer,
      }),
      preloadedState: {
        app: mockAppState,
        appointments: {
          appointmentSlots: mockAppointmentState.appointmentSlots,
          bookedAppointments: mockBookedAppointments,
          isLoading: false,
          error: null,
        },
      },
    });

    render(
      <Provider store={realStore}>
        <Bookings />
      </Provider>,
    );
    expect(screen.getByText("Your booked appointments:")).toBeVisible();
    expect(
      screen.getByTestId("booking-Test White-Monday-9:00 AM"),
    ).toBeVisible();
    const cancelButton = screen.getByTestId("cancel-Test White-Monday-9:00 AM");
    expect(cancelButton).toBeVisible();
    fireEvent.press(cancelButton);
    await waitFor(() => {
      expect(
        screen.queryByTestId("booking-Test White-Monday-9:00 AM"),
      ).not.toBeNull();
    });
  });

  it("should show no bookings when there are none", () => {
    render(
      <Provider store={storeWithoutBookings}>
        <Bookings />
      </Provider>,
    );
    expect(screen.getByText("Your booked appointments:")).toBeVisible();
    expect(screen.getByText("No booked appointments.")).toBeVisible();
    expect(screen.getByText("Start a new booking")).toBeVisible();

    expect(
      screen.queryByTestId("booking-Test White-Monday-9:00 AM"),
    ).not.toBeTruthy();
    expect(
      screen.queryByTestId("booking-Test Blue-Monday-9:30 AM"),
    ).not.toBeTruthy();
  });

  it("should return to home when no bookings and start new is pressed", () => {
    render(
      <Provider store={storeWithoutBookings}>
        <Bookings />
      </Provider>,
    );
    expect(screen.getByText("Your booked appointments:")).toBeVisible();
    expect(screen.getByText("No booked appointments.")).toBeVisible();
    expect(
      screen.queryByTestId("booking-Test White-Monday-9:00 AM"),
    ).not.toBeTruthy();
    expect(
      screen.queryByTestId("booking-Test Blue-Monday-9:30 AM"),
    ).not.toBeTruthy();

    const startNewBookingButton = screen.getByText("Start a new booking");
    expect(startNewBookingButton).toBeVisible();
    fireEvent.press(startNewBookingButton);
    waitFor(() => {
      expect(useNavigation().navigate).toHaveBeenCalledWith("HomeTabs");
    });
  });
});
