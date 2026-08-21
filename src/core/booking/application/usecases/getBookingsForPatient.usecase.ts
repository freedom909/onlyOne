import { inject, injectable } from "tsyringe";
import { IBookingRepository } from "../../domain/repositories/i-booking.repository";
import { TOKENS_BOOKING } from "@/modules/tokens/booking.tokens";

@injectable()
export class GetBookingsForPatientUseCase {

  constructor(
    @inject(TOKENS_BOOKING.repository.bookingRepository)
    private bookingRepository: IBookingRepository
  ) {}

  async execute(
    patientId: string
  ) {
    return this.bookingRepository.findByPatientId(
      patientId
    );
  }
}