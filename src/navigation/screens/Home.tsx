import { StyleSheet, View } from "react-native";
import { useAppSelector } from "../../store/hooks";
import { useEffect } from "react";
import { fetchDoctors } from "../../store/slices/doctorStoreSlice";
import { store } from "../../store/store";
import { Image } from "react-native";
import stethoscope from "../../assets/stethoscope.png";
import { Button, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

/*
  Home landing screen that shows a list of available doctors.
  Once a doctor is selected, the user will be taken to the 
  CalendarSelect screen where they can choose a date and time 
  for their appointment.
  Doctor list is filtered here for display.
*/
export function Home() {
  const { navigate } = useNavigation();
  const { doctorList, isLoading, error } = useAppSelector((state) => state.app);
  const { appointmentSlots, bookedAppointments } = useAppSelector(
    (state) => state.appointments,
  );

  // Filter to show only avaiable doctors (those with appointment
  //  slots that are not already booked)
  const availableDoctors = appointmentSlots?.filter((slot) => {
    return !bookedAppointments?.some(
      (appointment) =>
        appointment.name === slot.name &&
        appointment.day_of_week === slot.day_of_week &&
        appointment.available_at === slot.available_at &&
        appointment.available_until === slot.available_until,
    );
  });

  // Fetch the latest doctor list on component mount
  // and set up an interval to refresh the list every hour
  useEffect(() => {
    if (!doctorList || doctorList.length === 0) {
      store.dispatch(fetchDoctors());
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Select a Doctor</Text>
      {isLoading && <Text>Loading doctors...</Text>}
      {error && (
        <View style={styles.error}>
          <Text>Error: {error}</Text>
          <View style={styles.retryButton}>
            <Button
              color="red"
              onPress={() => store.dispatch(fetchDoctors())}
              title="Retry"
            />
          </View>
        </View>
      )}

      {availableDoctors &&
        [...new Set(availableDoctors.map((slot) => slot.name))].map((name) => (
          <View style={styles.row} key={name}>
            <Image
              source={stethoscope}
              tintColor="blue"
              style={{
                width: 32,
                height: 32,
                alignSelf: "center",
              }}
            />
            <Button
              testID={name}
              onPress={() =>
                navigate("AppointmentSelect", { doctorName: name })
              }
              title={name}
            ></Button>
          </View>
        ))}
      {availableDoctors?.length === 0 && !isLoading && !error && (
        <View style={styles.noDoctorError}>
          <Text style={{ color: "red", fontSize: 16, textAlign: "center" }}>
            No doctors available at the moment. Please check back later.
          </Text>
        </View>
      )}
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
  row: {
    flexDirection: "row",
    gap: 10,
    width: "80%",
  },
  error: {
    padding: 24,
  },
  retryButton: {
    margin: 16,
    backgroundColor: "white",
    borderRadius: 32,
  },
  noDoctorError: {
    padding: 24,
    borderRadius: 20,
    backgroundColor: "white",
  },
});
