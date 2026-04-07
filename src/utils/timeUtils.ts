import { parse, addMinutes, format, isBefore, isEqual } from "date-fns";
import { toZonedTime, formatInTimeZone } from "date-fns-tz";
import { AppointmentSlotType } from "../types/appointmentSlotStoreTypes";

/**
 * Normalizes time string by trimming and adding space before am/pm if missing
 * Handles various formats: "8:00AM", " 8:00AM", "8:00am", "8:00 am", etc.
 * Converts to "8:00 am" format for date-fns parsing
 * @param timeStr Time string in various h:mm[a]m formats
 * @returns Normalized time string in h:mm a format (lowercase am/pm with space)
 */
const normalizeTimeString = (timeStr: string): string => {
  // Trim whitespace and convert to lowercase
  const trimmed = timeStr.trim().toLowerCase();
  // Add space before am/pm if missing
  return trimmed.replace(/([ap]m)/, " $1");
};

/**
 * Splits a doctor's availability window into 30-minute appointment slots
 * @param doctorsTimes - Doctor availability with start/end times and timezone
 * @returns Array of 30-minute appointment slots
 *
 * @example
 * // Input: doctor available 9:00am to 5:00pm
 * // Output: slots at 9:00-9:30am, 9:30-10:00am, ..., 4:30-5:00pm
 */
export function splitTimeSlots(
  doctorsTimes: AppointmentSlotType,
): AppointmentSlotType[] {
  const timeSlots: AppointmentSlotType[] = [];

  // Parse time strings (format: 9:00am, 5:40pm, etc.) using date-fns
  // Normalize the time string to add space before am/pm
  const startTime = parse(
    normalizeTimeString(doctorsTimes.available_at),
    "h:mm a",
    new Date(),
  );
  const endTime = parse(
    normalizeTimeString(doctorsTimes.available_until),
    "h:mm a",
    new Date(),
  );

  let currentTime = new Date(startTime);

  // Generate 30-minute slots from start to end time
  while (isBefore(currentTime, endTime)) {
    timeSlots.push({
      name: doctorsTimes.name,
      timezone: doctorsTimes.timezone,
      day_of_week: doctorsTimes.day_of_week,
      available_at: format(currentTime, "h:mm a"),
      available_until: format(addMinutes(currentTime, 30), "h:mm a"),
    });

    currentTime = addMinutes(currentTime, 30);
  }

  return timeSlots;
}

/**
 * Converts a doctor's appointment time from their timezone to the phone's local timezone
 *
 * Parses the time string and uses date-fns-tz to convert between timezones. This automatically
 * handles Daylight Saving Time changes based on the current date. The input time is assumed to be
 * in the doctor's timezone (IANA format, e.g., "Australia/Perth") and is converted to the phone's
 * local timezone.
 *
 * NOTE: This function works with time-only values. If timezone conversion would move the time to
 * a different day, the output time will reflect that day boundary crossing.
 *
 * @param available_at - Time in doctor's timezone (h:mma format, e.g., "9:00am")
 * @param timezone - Doctor's timezone (IANA format, e.g., "Australia/Perth", "America/New_York")
 * @param available_until - End time in doctor's timezone (currently not used, but included for API consistency)
 * @param day_of_week - Day of week (currently not used, but included for API consistency)
 * @returns Time converted to phone's local timezone (h:mma format)
 *
 * @example
 * // Doctor in Perth offering 2:00pm local time, phone in Sydney
 * convertToLocalTime("2:00pm", "Australia/Perth", "2:30pm", "Monday")
 * // Returns "11:00am" (Perth is 3 hours behind Sydney)
 */
export function convertToLocalTime(
  available_at: string,
  timezone: string,
  available_until: string,
  day_of_week: string,
): string {
  // Get phone's local timezone
  const phoneTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Parse the time string (format: 9:00am, 5:40pm, etc.)
  // Normalize the time string to add space before am/pm
  const doctorTime = parse(
    normalizeTimeString(available_at),
    "h:mm a",
    new Date(),
  );

  // Convert from doctor's timezone to phone's local timezone using date-fns-tz
  // This automatically handles DST by using the current system date
  const zonedTime = toZonedTime(doctorTime, timezone);
  const localTime = formatInTimeZone(zonedTime, phoneTimezone, "h:mma");

  return localTime;
}
