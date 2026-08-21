import { injectable, inject } from "tsyringe";
import { TOKENS_TENANT } from "@/modules/tokens/tenant.tokens";
import { IMembershipRepository } from "../../domain/repos/i-membership.repository";

@injectable()
export class GetTenantMembershipsUseCase {
  constructor(
    @inject(TOKENS_TENANT.repos.membershipRepo)
    private membershipRepo: IMembershipRepository
  ) {}

  async execute(tenantId: string) {
    const memberships = await this.membershipRepo.findByTenantId(tenantId);
    return memberships.map((m) => m.toJSON());
  }
}
