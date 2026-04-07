import { Provider } from "react-redux";
import {
  mockAppointmentState,
  mockAppState,
  mockDoctors,
} from "../../__mocks__/apiResponses";
import { NotFound } from "./NotFound";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import configureStore from "redux-mock-store";
import { useNavigation } from "@react-navigation/native";

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

describe("NotFound Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should render and show the title", () => {
    render(
      <Provider store={store}>
        <NotFound />
      </Provider>,
    );
    expect(screen.getByText("404 Not found!")).toBeVisible();
  });

  it("should navigate back to the home screen", async () => {
    const mockNavigate = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });

    render(
      <Provider store={store}>
        <NotFound />
      </Provider>,
    );
    expect(screen.getByText("404 Not found!")).toBeVisible();
    const backButton = screen.getByText("Go to Home");
    expect(backButton).toBeVisible();
    fireEvent.press(backButton);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("HomeTabs");
    });
  });
});
