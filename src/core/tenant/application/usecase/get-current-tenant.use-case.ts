import { injectable, inject } from "tsyringe";
import { TOKENS_TENANT } from "@/modules/tokens/tenant.tokens";
import { ITenantRepository } from "../../domain/repos/i-tenant.repository";

@injectable()
export class GetCurrentTenantUseCase {
  constructor(
    @inject(TOKENS_TENANT.repos.tenantRepo)
    private tenantRepo: ITenantRepository
  ) {}

  async execute(activeTenantId: string | undefined | null) {
    if (!activeTenantId) return null;
    const tenant = await this.tenantRepo.findById(activeTenantId);
    return tenant ? tenant.toJSON() : null;
  }
}
