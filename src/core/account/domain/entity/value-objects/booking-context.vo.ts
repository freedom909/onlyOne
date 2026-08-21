// BookingContext — the data needed to evaluate business rules against a booking
export interface BookingContext {
  bookingId: string;
  listingId: string;
  patientId: string;
  tenantId: string;
  checkInDate: Date;
  checkOutDate: Date;
  nightlyPrice: number;
  totalPrice: number;
  patientCount: number;
  numRooms: number;
  status: string;
  createdAt: Date;
  cancelledAt?: Date;
  confirmedAt?: Date;
}

export function createBookingContext(raw: Partial<BookingContext>): BookingContext {
  if (!raw.bookingId) throw new Error("bookingId is required");
  if (!raw.listingId) throw new Error("listingId is required");
  if (!raw.patientId) throw new Error("patientId is required");
  return {
    bookingId: raw.bookingId,
    listingId: raw.listingId,
    patientId: raw.patientId,
    tenantId: raw.tenantId ?? "",
    checkInDate: new Date(raw.checkInDate ?? Date.now()),
    checkOutDate: new Date(raw.checkOutDate ?? Date.now()),
    nightlyPrice: raw.nightlyPrice ?? 0,
    totalPrice: raw.totalPrice ?? 0,
    patientCount: raw.patientCount ?? 1,
    numRooms: raw.numRooms ?? 1,
    status: raw.status ?? "PENDING",
    createdAt: new Date(raw.createdAt ?? Date.now()),
    cancelledAt: raw.cancelledAt,
    confirmedAt: raw.confirmedAt,
  };
}
