import { useNavigation } from "@react-navigation/native";
import { Button, StyleSheet, View, Text } from "react-native";

export function NotFound() {
  const { navigate } = useNavigation();
  return (
    <View style={styles.container}>
      <Text>404 Not found!</Text>
      <Button onPress={() => navigate("HomeTabs")} title="Go to Home" />
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
});
