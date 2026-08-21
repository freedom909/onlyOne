import { injectable, inject } from "tsyringe";
import { TOKENS_TENANT } from "@/modules/tokens/tenant.tokens";
import { IMembershipRepository } from "../../domain/repos/i-membership.repository";
import { ITenantRepository } from "../../domain/repos/i-tenant.repository";
import { MembershipStatus } from "../../domain/entities/membership.entity";
import { TenantStatus } from "../../domain/entities/tenant.entity";

@injectable()
export class SwitchTenantUseCase {
  constructor(
    @inject(TOKENS_TENANT.repos.membershipRepo)
    private membershipRepo: IMembershipRepository,
    @inject(TOKENS_TENANT.repos.tenantRepo)
    private tenantRepo: ITenantRepository
  ) {}

  async execute(input: { userId: string; tenantId: string }) {
    const { userId, tenantId } = input;

    const allMemberships = await this.membershipRepo.findByUserId(userId);
    const activeMemberships = allMemberships.filter(
      (m) => m.status === MembershipStatus.ACTIVE
    );
    const allowedTenantIds = activeMemberships.map((m) => m.tenantId);

    if (!allowedTenantIds.includes(tenantId)) {
      throw new Error(
        `Invalid tenantId. Only the following tenantIds are allowed for this user: [${allowedTenantIds.join(", ")}]`
      );
    }

    const tenant = await this.tenantRepo.findById(tenantId);
    if (!tenant) {
      throw new Error("Tenant not found");
    }
    if (tenant.status !== TenantStatus.ACTIVE) {
      throw new Error("Tenant is not active");
    }

    return {
      tenant: tenant.toJSON(),
      activeTenantId: tenantId,
      allowedTenantIds,
    };
  }
}
