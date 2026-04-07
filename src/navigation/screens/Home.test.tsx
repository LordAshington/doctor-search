import {
  mockAppState,
  mockAppointmentState,
  mockLoadingAppState,
  mockErrorAppState,
  mockFullyBookedAppointmentState,
} from "../../__mocks__/apiResponses";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { Home } from "./Home";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { useNavigation } from "@react-navigation/native";
import { store as mockStoreInstance } from "../../store/store";

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
  })),
}));

jest.mock("../../store/store", () => ({
  store: { dispatch: jest.fn() },
}));

jest.useFakeTimers();

const mockStore = configureStore([]);

const store = mockStore({
  app: mockAppState,
  appointments: mockAppointmentState,
});

describe("Home Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should render and show the title", () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>,
    );
    expect(screen.getByText("Select a Doctor")).toBeVisible();
  });

  it("should fetch doctors on mount if list is empty", () => {
    const emptyDoctorStore = mockStore({
      app: { ...mockAppState, doctorList: [] },
      appointments: mockAppointmentState,
    });

    render(
      <Provider store={emptyDoctorStore}>
        <Home />
      </Provider>,
    );

    expect(mockStoreInstance.dispatch).toHaveBeenCalled();
  });

  it("should not fetch doctors if list already exists", () => {
    render(
      <Provider store={store}>
        {" "}
        // mockAppState has doctors
        <Home />
      </Provider>,
    );

    expect(mockStoreInstance.dispatch).not.toHaveBeenCalled();
  });

  it("should show a list of doctors with available time slots", () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>,
    );
    expect(screen.getByText("Select a Doctor")).toBeVisible();
    // Button elements do not use the text element for their content,
    // so we need to add a test id and use getByTestId
    expect(screen.getByTestId("Test White")).toBeVisible();
    expect(screen.getByTestId("Test Blue")).toBeVisible();
    expect(screen.getByTestId("Test Green")).toBeVisible();
  });

  it("should show an empty list if all slots are booked", () => {
    // When all appointment slots are in bookedAppointments
    const fullyBookedStore = mockStore({
      app: mockAppState,
      appointments: mockFullyBookedAppointmentState,
    });
    render(
      <Provider store={fullyBookedStore}>
        <Home />
      </Provider>,
    );
    expect(screen.getByText("Select a Doctor")).toBeVisible();
    expect(
      screen.getByText(
        "No doctors available at the moment. Please check back later.",
      ),
    ).toBeVisible();
  });

  it("should navigate to the chosen doctor booking screen", async () => {
    const mockNavigate = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });

    render(
      <Provider store={store}>
        <Home />
      </Provider>,
    );
    expect(screen.getByText("Select a Doctor")).toBeTruthy();
    const doctorButton = await screen.getByTestId("Test White");
    expect(doctorButton).toBeTruthy();
    // Simulate button press
    fireEvent.press(doctorButton);
    // Next screen should be appointments with the right doctorß
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("AppointmentSelect", {
        doctorName: "Test White",
      });
    });
  });

  it("should show error if the API call fails", () => {
    const errorStore = mockStore({
      app: mockErrorAppState,
      appointments: mockAppointmentState,
    });
    render(
      <Provider store={errorStore}>
        <Home />
      </Provider>,
    );
    // Error message should be displayed
    expect(screen.getByText("Error: Failed to fetch doctors")).toBeVisible();
  });

  it("should dispatch fetchDoctors when retry is pressed", () => {
    const errorStore = mockStore({
      app: mockErrorAppState,
      appointments: mockAppointmentState,
    });

    render(
      <Provider store={errorStore}>
        <Home />
      </Provider>,
    );

    fireEvent.press(screen.getByText("Retry"));
    expect(mockStoreInstance.dispatch).toHaveBeenCalled();
  });

  it("should show the loading screen", () => {
    const loadingStore = mockStore({
      app: mockLoadingAppState,
      appointments: mockAppointmentState,
    });
    render(
      <Provider store={loadingStore}>
        <Home />
      </Provider>,
    );

    // Loading indicator should be displayed
    expect(screen.getByText("Loading doctors...")).toBeVisible();
  });

  it("should show each doctor only once even with multiple slots", () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>,
    );

    expect(screen.getAllByTestId("Test White").length).toBe(1);
  });
});
