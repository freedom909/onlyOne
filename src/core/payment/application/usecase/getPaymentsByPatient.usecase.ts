import { TOKENS_PAYMENT } from "@/modules/tokens/payment.tokens";
import { inject, injectable } from "tsyringe";
import { IPaymentRepository } from "../../domain/repository/i-payment.repository";
import { Payment } from "../../domain/entity/payment.entity";

@injectable()
export class GetPaymentsByPatientUseCase {
  constructor(
    @inject(TOKENS_PAYMENT.repos.paymentRepository)
    private paymentRepository: IPaymentRepository,
  ) {}

  async execute(patientId: string): Promise<Payment[]> {
    return this.paymentRepository.findByPatientId(patientId);
  }
}
