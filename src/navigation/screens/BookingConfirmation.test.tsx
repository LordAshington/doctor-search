import {
  mockAppointmentDetails,
  mockAppointmentRoute,
  mockAppointmentState,
  mockAppState,
} from "../../__mocks__/apiResponses";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { BookingConfirmation } from "./BookingConfirmation";
import configureStore from "redux-mock-store"; // for mock store
import {
  combineReducers,
  configureStore as realConfigureStore, // for real store
} from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { useAppDispatch } from "../../store/hooks";
import appReducer from "../../store/slices/doctorStoreSlice";
import appointmentReducer from "../../store/slices/appointmentStoreSlice";
import { useNavigation } from "@react-navigation/native";

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
  appointments: mockAppointmentState,
});

describe("BookingConfirmation Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset useAppDispatch to use real implementation by default
    (useAppDispatch as jest.Mock).mockImplementation(
      jest.requireActual("../../store/hooks").useAppDispatch,
    );
  });
  it("should render and show the title and details from route", () => {
    render(
      <Provider store={store}>
        <BookingConfirmation
          route={{
            params: {
              appointmentDetails: mockAppointmentDetails,
            },
          }}
        />
      </Provider>,
    );
    expect(screen.getByText("Please confirm your booking")).toBeVisible();
    expect(screen.getByText("Test White")).toBeVisible();
    expect(screen.getByText("Monday")).toBeVisible();
    expect(screen.getByText("9:00 AM - 9:30 AM")).toBeVisible();
  });

  it("should show an error message if booking dispatch fails", async () => {
    const mockDispatch = jest.fn(() => {
      throw new Error("Booking failed");
    });
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);

    render(
      <Provider store={store}>
        <BookingConfirmation route={mockAppointmentRoute} />
      </Provider>,
    );
    fireEvent.press(screen.getByText("Confirm booking"));
    await waitFor(() => {
      expect(
        screen.getByText("Failed to confirm booking. Please try again."),
      ).toBeTruthy();
    });
    expect(screen.getByText("Retry")).toBeTruthy();
  });

  it("should navigate to the home screen if booking is successful", async () => {
    const mockNavigate = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });

    const realStore = realConfigureStore({
      reducer: combineReducers({
        app: appReducer,
        appointments: appointmentReducer,
      }),
      preloadedState: {
        app: mockAppState,
        appointments: {
          appointmentSlots: mockAppointmentState.appointmentSlots,
          bookedAppointments: [],
          isLoading: false,
          error: null,
        },
      },
    });

    render(
      <Provider store={realStore}>
        <BookingConfirmation route={mockAppointmentRoute} />
      </Provider>,
    );
    fireEvent.press(screen.getByText("Confirm booking"));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("HomeTabs");
    });
  });

  it("should navigate to the home screen if cancel is pressed", async () => {
    const mockNavigate = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });

    render(
      <Provider store={store}>
        <BookingConfirmation route={mockAppointmentRoute} />
      </Provider>,
    );

    // Simulate pressing the cancel button
    fireEvent.press(screen.getByText("Cancel"));

    // Wait for the navigate function to be called with the home screen
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("HomeTabs");
    });
  });
});
