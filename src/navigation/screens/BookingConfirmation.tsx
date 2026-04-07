import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import { AppointmentSlotType } from "../../types/appointmentSlotStoreTypes";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addBookedAppointment } from "../../store/slices/appointmentStoreSlice";
import { Button, Text } from "react-native";

type Props = StaticScreenProps<{
  appointmentDetails: AppointmentSlotType;
}>;

export function BookingConfirmation({ route }: Props) {
  const dispatch = useAppDispatch();
  const { bookedAppointments } = useAppSelector((state) => state.appointments);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const { navigate } = useNavigation();

  // Check if the appointment was successfully added to the store
  // navigate back to the home screen if it was,
  // otherwise show an error message and a retry button
  useEffect(() => {
    if (bookedAppointments && bookedAppointments.length > 0) {
      const isBooked = bookedAppointments.some(
        (appointment) =>
          appointment.name === route.params.appointmentDetails.name &&
          appointment.day_of_week ===
            route.params.appointmentDetails.day_of_week &&
          appointment.available_at ===
            route.params.appointmentDetails.available_at &&
          appointment.available_until ===
            route.params.appointmentDetails.available_until,
      );

      if (isBooked) {
        setBookingError(null);
        navigate("HomeTabs");
      }
    }
  }, [bookedAppointments, route.params.appointmentDetails]);

  // Dispatch the booked appointment to Redux store
  function confirmBooking(appointmentSlot: AppointmentSlotType) {
    try {
      dispatch(addBookedAppointment(appointmentSlot));
    } catch (error) {
      setBookingError("Failed to confirm booking. Please try again.");
      console.error("Booking error:", error);
    }
  }

  return (
    <View style={styles.container}>
      {bookingError && (
        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: "red" }}>{bookingError}</Text>
          <Button
            color="red"
            onPress={() => confirmBooking(route.params.appointmentDetails)}
            title="Retry"
          />
        </View>
      )}
      {!bookingError && (
        <>
          <Text>Please confirm your booking</Text>
          <Text>{route.params.appointmentDetails.name}</Text>
          <Text>{route.params.appointmentDetails.day_of_week}</Text>
          <Text>
            {route.params.appointmentDetails.available_at} -{" "}
            {route.params.appointmentDetails.available_until}
          </Text>
          <View style={styles.confirmButton}>
            <Button
              color="white"
              onPress={() => confirmBooking(route.params.appointmentDetails)}
              title="Confirm booking"
            />
          </View>
        </>
      )}
      <Button onPress={() => navigate("HomeTabs")} color="red" title="Cancel" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#EDF3FC",
  },
  confirmButton: {
    backgroundColor: "blue",
    margin: 10,
    padding: 4,
    borderRadius: 20,
  },
  loading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "blue",
  },
});
