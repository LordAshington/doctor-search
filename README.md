# Auto generated this react navigation with expo template from the react navigation guide

npx create-expo-app@latest --template react-navigation/template

## Setup

Prerequisites include having xcode and android studio with an simulators setup, or a real physical device with developer mode enabled.
Have a new version of node installed and ruby > 3 for ios.
For debugging install react native devtools as flipper is no longer supported.
I had to add some patches to get this working right on my older 2019 intel macbook.
I wanted to use the latest expo so you may need to remove those patches (they are specifically around vision Os support)

## Usage

1. install node modules with `npm install`
2. run `npm start` for expo go or

   ```sh
   npm run ios
   # or
   npm run android
   ```

   for simulator / real device builds.
   Further info is below in the auto generated documents.

3. Once the app is loaded choose a doctor to see all their available time slots.
4. Once a doctor is selected choose a time slot.
5. If that. time is available you can 'book' it and confirm the time on the confirmation screen.
6. In the navigation bar select 'Bookings' to see your booked time slots.
7. In the bookings screen you can manage bookings by deleting them.
8. Close the app and reopen it to see the booked slots are persisted.

## Assumptions and design decisions

Using redux with a thunk to populate the data in the background on login.
We are assuming the data won't change in real time. so fetching it once when we launch the app should suffice.
Then we ned to filter the list of doctors to remove duplicates per day.
There is no date only day of the week so we are only going to show a weekly view.
The time slots are large chunks so we need to break them down into 30 minute slots.
At this point I am going to persist the new broken down time slots in a slice.

For storage persistance I am using async storage combined with redux persist to avoid handling it manually.
I am only going to persist the booked time slots locally as I want fresh time slot data on load as those are from the server.
When a time slot is booked I assume we want to disable it on the time slot selection.
I am going to convert all time zones into the phone time zone.
Having looked at possible times, I am assuming it is Austraalia only and will not need to compensate for
crossing days with the time conversions (earliest 9am Sydney would be 6am Perth).

I added some basic icons from flaticon www.flaticon.com

The tests are screen based and mainly focus on rendering based on state data.
This I consider more functional tests but there is not an easy way to separate components and test purely their functionality without rendering the screen with state.

I have been using github copilot to help generate boiilerplate code and figuring out how to handle the dates.
I also used it to create a mock test file to test the state actions and screen renderings.

## Known Limitations & Future Enhancements

- There is some overhead generating the time slots that could be streamlined to make the app faster
- My state solution has some extra complexity I could drop that may cause extra re-renders like in the bookings screen
- The tests are very heavy and run slowly as it is rendering the screens with state
- Clean up console log errors with some sort of logger that can be configured on or off in tests
- No server persistence.
- When removing the app a user can delete the booking data
- Api doesn't return when other users have taken a timeslot.
- No auth or login so we don't know the user.
- We do not limit the slots a person can book, someone could theoretically book them all.
- Align the buttons and text with styles possibly using nativewind
- No feedback when cancelling an appointment, maybe add a native pop up with 'Are you sure?'
- Automated ci/cd to stores or firebase and testflight for testing

# Starter Template with React Navigation

This is a minimal starter template for React Native apps using Expo and React Navigation.

It includes the following:

- Example [Native Stack](https://reactnavigation.org/docs/native-stack-navigator) with a nested [Bottom Tab](https://reactnavigation.org/docs/bottom-tab-navigator)
- Web support with [React Native for Web](https://necolas.github.io/react-native-web/)
- TypeScript support and configured for React Navigation
- Automatic [deep link](https://reactnavigation.org/docs/deep-linking) and [URL handling configuration](https://reactnavigation.org/docs/configuring-links)
- Theme support [based on system appearance](https://reactnavigation.org/docs/themes/#using-the-operating-system-preferences)
- Expo [Development Build](https://docs.expo.dev/develop/development-builds/introduction/) with [Continuous Native Generation](https://docs.expo.dev/workflow/continuous-native-generation/)

## Getting Started

1. Create a new project using this template:

   ```sh
   npx create-expo-app@latest --template react-navigation/template
   ```

2. Edit the `app.json` file to configure the `name`, `slug`, `scheme` and bundle identifiers (`ios.bundleIdentifier` and `android.bundleIdentifier`) for your app.

3. Edit the `src/App.tsx` file to start working on your app.

## Running the app

- Install the dependencies:

  ```sh
  npm install
  ```

- Start the development server:

  ```sh
  npm start
  ```

- Build and run iOS and Android development builds:

  ```sh
  npm run ios
  # or
  npm run android
  ```

- In the terminal running the development server, press `i` to open the iOS simulator, `a` to open the Android device or emulator, or `w` to open the web browser.

## Notes

This project uses a [development build](https://docs.expo.dev/develop/development-builds/introduction/) and cannot be run with [Expo Go](https://expo.dev/go). To run the app with Expo Go, edit the `package.json` file, remove the `expo-dev-client` package and `--dev-client` flag from the `start` script.

We highly recommend using the development builds for normal development and testing.

The `ios` and `android` folder are gitignored in the project by default as they are automatically generated during the build process ([Continuous Native Generation](https://docs.expo.dev/workflow/continuous-native-generation/)). This means that you should not edit these folders directly and use [config plugins](https://docs.expo.dev/config-plugins/) instead. However, if you need to edit these folders, you can remove them from the `.gitignore` file so that they are tracked by git.

## Resources

- [React Navigation documentation](https://reactnavigation.org/)
- [Expo documentation](https://docs.expo.dev/)

---

Demo assets are from [lucide.dev](https://lucide.dev/)
