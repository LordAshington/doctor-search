import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { StyleSheet, View, Text, Button, TouchableOpacity } from "react-native";
import { useAppSelector } from "../../store/hooks";
import { ScrollView } from "react-native-gesture-handler";

type Props = StaticScreenProps<{
  doctorName: string;
}>;

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

/**
 * Show a list of available appointment slots for the selected doctor.
 * When one is selected, the user will be taken to the BookingConfirmation
 * screen where they can confirm their booking.
 * @param doctorName - passed from Home screen when a doctor is selected. Used to filter appointment slots for display.
 *
 */
export function AppointmentSelect({ route }: Props) {
  const { navigate } = useNavigation();

  const { appointmentSlots, bookedAppointments } = useAppSelector(
    (state) => state.appointments,
  );

  // Filter slots based on the doctors name
  const filteredByName = appointmentSlots?.filter(
    (slot) => slot.name === route.params.doctorName,
  );

  // Filter out already booked slots
  // Using some to filter out any slots that match the name, day_of_week,
  // available_at and available_until of a booked appointment.
  const filteredSlots = filteredByName?.filter((slot) => {
    return !bookedAppointments?.some(
      (appointment) =>
        appointment.name === slot.name &&
        appointment.day_of_week === slot.day_of_week &&
        appointment.available_at === slot.available_at &&
        appointment.available_until === slot.available_until,
    );
  });

  // Using a render function to show all the possible days
  function renderDayOfWeek(day: string) {
    return (
      <View key={day} style={styles.dayOfWeek}>
        <Text style={styles.dayTitle}>{day}</Text>
        {filteredSlots?.map((slot, index) => {
          if (slot.day_of_week === day) {
            return (
              <View key={index} style={styles.column}>
                <TouchableOpacity
                  testID={`${slot.day_of_week}-${slot.available_at}`}
                  onPress={() =>
                    navigate("BookingConfirmation", {
                      appointmentDetails: slot,
                    })
                  }
                >
                  <Text
                    style={styles.slotButtonText}
                    adjustsFontSizeToFit
                    numberOfLines={1}
                  >
                    {slot.available_at} - {slot.available_until}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }
        })}
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: "#EDF3FC" }}>
      <View style={styles.container}>
        <Text style={styles.title}>
          Select a time for {route.params.doctorName}
        </Text>
        <View style={styles.grid}>{DAYS.map(renderDayOfWeek)}</View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
    margin: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  column: {
    flexDirection: "column",
    gap: 10,
    borderWidth: 1,
    borderColor: "gray",
    margin: 5,
    padding: 5,
    borderRadius: 20,
    backgroundColor: "#C6EAF5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  dayOfWeek: {
    flexGrow: 1,
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    backgroundColor: "#D2FCFA",
    width: "40%",
  },
  slotButtonText: {
    fontSize: 16,
  },
});
