import { injectable, inject } from "tsyringe";
import { TOKENS_TENANT } from "@/modules/tokens/tenant.tokens";
import { IMembershipRepository } from "../../domain/repos/i-membership.repository";

@injectable()
export class MyMembershipsUseCase {
  constructor(
    @inject(TOKENS_TENANT.repos.membershipRepo)
    private membershipRepo: IMembershipRepository
  ) {}

  async execute(userId: string) {
    if (!userId) {
      throw new Error("Unauthenticated");
    }
    const memberships = await this.membershipRepo.findByUserId(userId);
    return memberships.map((m) => m.toJSON());
  }
}
