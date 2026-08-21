// domain/repositories/i-payment.repository.ts

import { Payment } from "../entity/payment.entity";



export interface IPaymentRepository {
  findByBookingId(bookingId: string): Promise<Payment | null>;

  findById(
    id: string
  ): Promise<Payment | null>;


  findByPatientId(
    patientId: string
  ): Promise<Payment[]>;

  save(
    payment: Payment
  ): Promise<void>;

  delete(
    id: string
  ): Promise<void>;
}