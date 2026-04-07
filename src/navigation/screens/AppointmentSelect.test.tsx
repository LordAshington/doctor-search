import configureStore from "redux-mock-store";
import {
  mockAppointmentState,
  mockAppointmentStateWithBookings,
  mockAppState,
} from "../../__mocks__/apiResponses";
import { Provider } from "react-redux";
import { AppointmentSelect } from "./AppointmentSelect";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { useNavigation } from "@react-navigation/native";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest"),
);
jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
  })),
}));

jest.useFakeTimers();

const mockStore = configureStore([]);

const store = mockStore({
  app: mockAppState,
  appointments: mockAppointmentState,
});

const mockRoute = {
  params: { doctorName: "Test White" },
  key: "AppointmentSelect",
  name: "AppointmentSelect",
};

describe("AppointmentSelect Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should render and show the title selected by route params", () => {
    render(
      <Provider store={store}>
        <AppointmentSelect route={mockRoute} />
      </Provider>,
    );

    expect(screen.getByText("Select a time for Test White")).toBeTruthy();
  });

  it("should show a list of the available appointment slots", () => {
    render(
      <Provider store={store}>
        <AppointmentSelect route={mockRoute} />
      </Provider>,
    );

    expect(screen.getByTestId("Monday-9:00 AM")).toBeTruthy();
    expect(screen.getByTestId("Monday-9:30 AM")).toBeTruthy();
    expect(screen.getByTestId("Monday-10:00 AM")).toBeTruthy();
  });

  it("should hide unavailable appointment slots", () => {
    const storeWithBookings = mockStore({
      app: mockAppState,
      appointments: mockAppointmentStateWithBookings,
    });

    render(
      <Provider store={storeWithBookings}>
        <AppointmentSelect route={mockRoute} />
      </Provider>,
    );
    expect(screen.getByTestId("Monday-9:30 AM")).toBeTruthy();
    expect(screen.getByTestId("Monday-10:00 AM")).toBeTruthy();
  });

  it("should navigate to the confirmation screen when a booking is pressed", async () => {
    const mockNavigate = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });

    render(
      <Provider store={store}>
        <AppointmentSelect route={mockRoute} />
      </Provider>,
    );
    expect(screen.getByText("Select a time for Test White")).toBeTruthy();
    const appointmentButton = await screen.getByTestId("Monday-9:00 AM");
    expect(appointmentButton).toBeTruthy();
    // Simulate button press
    fireEvent.press(appointmentButton);
    // Next screen should be appointments with the right doctorß
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("BookingConfirmation", {
        appointmentDetails: {
          name: "Test White",
          timezone: "Australia/Sydney",
          day_of_week: "Monday",
          available_at: "9:00 AM",
          available_until: "9:30 AM",
        },
      });
    });
  });
});
