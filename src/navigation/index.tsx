import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createStaticNavigation,
  StaticParamList,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image } from "react-native";
import user from "../assets/user.png";
import newspaper from "../assets/newspaper.png";
import { Home } from "./screens/Home";
import { Bookings } from "./screens/Bookings";
import { NotFound } from "./screens/NotFound";
import { AppointmentSelect } from "./screens/AppointmentSelect";
import { BookingConfirmation } from "./screens/BookingConfirmation";

const HomeTabs = createBottomTabNavigator({
  screens: {
    Home: {
      screen: Home,
      options: {
        title: "Home",
        tabBarIcon: ({ color, size }) => (
          <Image
            source={newspaper}
            tintColor={color}
            style={{
              width: size,
              height: size,
            }}
          />
        ),
      },
    },
    Bookings: {
      screen: Bookings,
      options: {
        title: "Bookings",
        tabBarIcon: ({ color, size }) => (
          <Image
            source={user}
            tintColor={color}
            style={{
              width: size,
              height: size,
            }}
          />
        ),
      },
    },
  },
});

const RootStack = createNativeStackNavigator({
  screens: {
    HomeTabs: {
      screen: HomeTabs,
      options: {
        title: "Home",
        headerShown: false,
      },
    },
    AppointmentSelect: {
      screen: AppointmentSelect,
      linking: {
        path: ":doctorName(@[a-zA-Z0-9-_]+)",
        parse: {
          doctorName: (value) => value.replace(/^@/, ""),
        },
        stringify: {
          doctorName: (value) => `@${value}`,
        },
      },
    },
    BookingConfirmation: {
      screen: BookingConfirmation,
      linking: {
        path: ":appointmentDetails",
        parse: {
          appointmentDetails: (value) => JSON.parse(value),
        },
        stringify: {
          appointmentDetails: (value) => JSON.stringify(value),
        },
      },
    },
    NotFound: {
      screen: NotFound,
      options: {
        title: "404",
      },
      linking: {
        path: "*",
      },
    },
  },
});

export const Navigation = createStaticNavigation(RootStack);

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
