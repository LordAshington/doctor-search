/**
 * Mock API responses for tests
 */

export const mockDoctors = [
  {
    name: "Test White",
    timezone: "Australia/Sydney",
    day_of_week: "Monday",
    available_at: " 9:00AM",
    available_until: " 5:30PM",
  },
  {
    name: "Test Blue",
    timezone: "Australia/Perth",
    day_of_week: "Monday",
    available_at: " 9:00AM",
    available_until: " 5:00PM",
  },
  {
    name: "Test Green",
    timezone: "Australia/Sydney",
    day_of_week: "Tuesday",
    available_at: " 10:00AM",
    available_until: " 4:00PM",
  },
  {
    name: "Test Brown",
    timezone: "America/New_York",
    day_of_week: "Wednesday",
    available_at: " 1:00PM",
    available_until: " 6:00PM",
  },
  {
    name: "Test Orange",
    timezone: "Australia/Melbourne",
    day_of_week: "Friday",
    available_at: " 10:00AM",
    available_until: " 11:00AM",
  },
];

export const mockAppointmentSlots = [
  {
    name: "Test White",
    timezone: "Australia/Sydney",
    day_of_week: "Monday",
    available_at: "9:00 AM",
    available_until: "9:30 AM",
  },
  {
    name: "Test White",
    timezone: "Australia/Sydney",
    day_of_week: "Monday",
    available_at: "9:30 AM",
    available_until: "10:00 AM",
  },
  {
    name: "Test White",
    timezone: "Australia/Sydney",
    day_of_week: "Monday",
    available_at: "10:00 AM",
    available_until: "10:30 AM",
  },
  {
    name: "Test Blue",
    timezone: "Australia/Perth",
    day_of_week: "Monday",
    available_at: "9:00 AM",
    available_until: "9:30 AM",
  },
  {
    name: "Test Blue",
    timezone: "Australia/Perth",
    day_of_week: "Monday",
    available_at: "9:30 AM",
    available_until: "10:00 AM",
  },
  {
    name: "Test Green",
    timezone: "Australia/Sydney",
    day_of_week: "Tuesday",
    available_at: "2:00 PM",
    available_until: "2:30 PM",
  },
];

export const mockFullyBookedAppointmentsSlots = [
  {
    name: "Test White",
    timezone: "Australia/Sydney",
    day_of_week: "Monday",
    available_at: "9:00 AM",
    available_until: "9:30 AM",
  },
  {
    name: "Test White",
    timezone: "Australia/Sydney",
    day_of_week: "Monday",
    available_at: "9:30 AM",
    available_until: "10:00 AM",
  },
  {
    name: "Test White",
    timezone: "Australia/Sydney",
    day_of_week: "Monday",
    available_at: "10:00 AM",
    available_until: "10:30 AM",
  },
  {
    name: "Test Blue",
    timezone: "Australia/Perth",
    day_of_week: "Monday",
    available_at: "9:00 AM",
    available_until: "9:30 AM",
  },
  {
    name: "Test Blue",
    timezone: "Australia/Perth",
    day_of_week: "Monday",
    available_at: "9:30 AM",
    available_until: "10:00 AM",
  },
  {
    name: "Test Green",
    timezone: "Australia/Sydney",
    day_of_week: "Tuesday",
    available_at: "2:00 PM",
    available_until: "2:30 PM",
  },
];

export const mockBookedAppointments = [
  {
    name: "Test White",
    timezone: "Australia/Sydney",
    day_of_week: "Monday",
    available_at: "9:00 AM",
    available_until: "9:30 AM",
  },
  {
    name: "Test Blue",
    timezone: "Australia/Perth",
    day_of_week: "Monday",
    available_at: "9:30 AM",
    available_until: "10:00 AM",
  },
];

export const mockAppState = {
  doctorList: mockDoctors,
  isLoading: false,
  error: null,
};

export const mockLoadingAppState = {
  doctorList: [],
  isLoading: true,
  error: null,
};

export const mockErrorAppState = {
  doctorList: [],
  isLoading: false,
  error: "Failed to fetch doctors",
};

export const mockAppointmentState = {
  appointmentSlots: mockAppointmentSlots,
  bookedAppointments: [],
};

export const mockAppointmentStateWithBookings = {
  appointmentSlots: mockAppointmentSlots,
  bookedAppointments: mockBookedAppointments,
};

export const mockFullyBookedAppointmentState = {
  appointmentSlots: mockAppointmentSlots,
  bookedAppointments: mockFullyBookedAppointmentsSlots,
};

export const mockRoute = {
  params: {
    doctorName: "Test White",
  },
};

export const mockAppointmentDetails = {
  name: "Test White",
  timezone: "Australia/Sydney",
  day_of_week: "Monday",
  available_at: "9:00 AM",
  available_until: "9:30 AM",
};

export const mockAppointmentRoute = {
  params: {
    appointmentDetails: mockAppointmentDetails,
  },
};
