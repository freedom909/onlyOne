// GetLatestBookingForPatient.useCase.ts

import { TOKENS_BOOKING } from "@/modules/tokens/booking.tokens";
import { inject, injectable } from "tsyringe";
import { BookingRepository } from "../../infrastructure/repos/bookingRepository";
import { Booking } from "../../domain/entities/booking.entity";

@injectable()
export class GetLatestBookingForPatientUseCase {
  constructor(
    @inject(TOKENS_BOOKING.repository.bookingRepository)
    private bookingRepository: BookingRepository,
  ) { }

  async execute(patientId: string): Promise<Booking> {
    if (!patientId) {
      throw new Error("Patient ID is required to retrieve latest booking.");
    }

    const booking = await this.bookingRepository.findByLatestByPatientId(patientId);

    if (!booking) {
      throw new Error(`No bookings found for patient ${patientId}.`);
    }

    return booking;
  }
}
