import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View, Button, ScrollView, Text } from "react-native";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { AppointmentSlotType } from "../../types/appointmentSlotStoreTypes";
import { clearBookedAppointment } from "../../store/slices/appointmentStoreSlice";
import { useState } from "react";

export function Bookings() {
  const { navigate } = useNavigation();
  const { bookedAppointments } = useAppSelector((state) => state.appointments);
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);

  function cancelBooking(appointment: AppointmentSlotType) {
    try {
      dispatch(clearBookedAppointment(appointment));
    } catch (error) {
      setError("Failed to confirm booking. Please try again.");
      console.error("Booking error:", error);
    }
  }

  return (
    <ScrollView style={{ backgroundColor: "#EDF3FC" }}>
      <View style={styles.container}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>
          Your booked appointments:
        </Text>
        {bookedAppointments && bookedAppointments.length > 0 ? (
          bookedAppointments.map((appointment, index) => (
            <View
              key={index}
              style={styles.column}
              testID={`booking-${appointment.name}-${appointment.day_of_week}-${appointment.available_at}`}
            >
              <Text>{appointment.name}</Text>
              <Text>{appointment.day_of_week}</Text>
              <Text>
                {appointment.available_at} - {appointment.available_until}
              </Text>
              <View style={styles.cancelButton}>
                <Button
                  testID={`cancel-${appointment.name}-${appointment.day_of_week}-${appointment.available_at}`}
                  onPress={() => cancelBooking(appointment)}
                  title="Cancel booking"
                  color="white"
                />
              </View>
            </View>
          ))
        ) : (
          <>
            <Text>No booked appointments.</Text>
            <View style={styles.newButton}>
              <Button
                testID="start-new-booking"
                onPress={() => navigate("HomeTabs", { screen: "Home" })}
                title="Start a new booking"
                color="white"
              />
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
  },
  column: {
    flexDirection: "column",
    gap: 10,
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    borderRadius: 5,
    width: "80%",
  },
  cancelButton: {
    backgroundColor: "red",
    margin: 10,
    padding: 4,
    borderRadius: 20,
  },
  newButton: {
    backgroundColor: "blue",
    margin: 10,
    padding: 4,
    borderRadius: 20,
  },
});
