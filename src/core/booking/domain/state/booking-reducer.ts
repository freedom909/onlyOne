// src/core/booking/domain/state/booking-reducer.ts

import { BookingMemory } from "@/wisdom/memory/type/booking.memory";
import {
  BookingEvent,
  BookingTransitionEvent,
} from "./booking-event";



export function bookingReducer(
  bookingDraft: BookingMemory | undefined,
  event: BookingTransitionEvent,
): BookingMemory {

  const current: BookingMemory =
    bookingDraft ?? {
      status: undefined,
      listingId: undefined,
      checkInDate: undefined,
      checkOutDate: undefined,
      patientCount: undefined,
    };

  switch (event.type) {

    case BookingEvent.SELECT_LISTING:

      return {
        ...current,

        listingId:
          event.payload.listingId as string,

        checkInDate:
          event.payload.checkInDate as string,

        checkOutDate:
          event.payload.checkOutDate as string,

        patientCount:
          event.payload.patientCount as number,
      };

    default:

      return current;
  }
}