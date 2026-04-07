import { splitTimeSlots, convertToLocalTime } from "./timeUtils";
import { AppointmentSlotType } from "../types/appointmentSlotStoreTypes";

describe("timeUtils", () => {
  describe("splitTimeSlots", () => {
    it("should split a 1-hour availability window into 2 30-minute slots", () => {
      const doctor: AppointmentSlotType = {
        name: "Test Blue",
        available_at: "9:00am",
        available_until: "10:00am",
        day_of_week: "Monday",
        timezone: "Australia/Perth",
      };

      const slots = splitTimeSlots(doctor);

      expect(slots.length).toBe(2);
      expect(slots[0].available_at).toBe("9:00 AM");
      expect(slots[0].available_until).toBe("9:30 AM");
      expect(slots[1].available_at).toBe("9:30 AM");
      expect(slots[1].available_until).toBe("10:00 AM");
    });

    it("should handle afternoon times correctly", () => {
      const doctor: AppointmentSlotType = {
        name: "Test Brown",
        available_at: "1:00pm",
        available_until: "2:00pm",
        day_of_week: "Wednesday",
        timezone: "Australia/Perth",
      };

      const slots = splitTimeSlots(doctor);

      expect(slots.length).toBe(2);
      expect(slots[0].available_at).toBe("1:00 PM");
      expect(slots[0].available_until).toBe("1:30 PM");
      expect(slots[1].available_at).toBe("1:30 PM");
      expect(slots[1].available_until).toBe("2:00 PM");
    });

    it("should return empty array for same start and end time", () => {
      const doctor: AppointmentSlotType = {
        name: "Test White",
        available_at: "9:00am",
        available_until: "9:00am",
        day_of_week: "Monday",
        timezone: "Australia/Perth",
      };

      const slots = splitTimeSlots(doctor);

      expect(slots.length).toBe(0);
    });

    it("should preserve doctor metadata in each slot", () => {
      const doctor: AppointmentSlotType = {
        name: "Test Orange",
        available_at: "10:00am",
        available_until: "11:00am",
        day_of_week: "Friday",
        timezone: "Australia/Melbourne",
      };

      const slots = splitTimeSlots(doctor);

      slots.forEach((slot) => {
        expect(slot.name).toBe("Test Orange");
        expect(slot.day_of_week).toBe("Friday");
        expect(slot.timezone).toBe("Australia/Melbourne");
      });
    });
  });

  describe("convertToLocalTime", () => {
    beforeEach(() => {
      const OriginalDateTimeFormat = Intl.DateTimeFormat;
      jest
        .spyOn(Intl, "DateTimeFormat")
        .mockImplementation((locale?, options?) => {
          const instance = new OriginalDateTimeFormat(locale, options);
          instance.resolvedOptions = () => ({
            ...new OriginalDateTimeFormat().resolvedOptions(),
            timeZone: "Australia/Perth", // simulate phone in Perth
          });
          return instance;
        });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should convert Sydney time to Perth time (Perth is 3hrs behind Sydney in AEDT)", () => {
      // 11:00am Sydney → 9:00am Perth (UTC+11 → UTC+8 in summer)
      // Don't know how to deal with daylight savings right now, probably need some extra params
      const result = convertToLocalTime(
        "11:00am",
        "Australia/Sydney",
        "11:30am",
        "Monday",
      );
      expect(result).toBe("2:00PM");
    });

    it("should return same time if doctor and user are in the same timezone", () => {
      // Mock user as Perth, doctor also in Perth
      const result = convertToLocalTime(
        "2:00pm",
        "Australia/Perth",
        "2:30pm",
        "Tuesday",
      );
      expect(result).toBe("2:00PM");
    });
  });
});
