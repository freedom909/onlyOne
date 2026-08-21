import { injectable, inject } from "tsyringe";

import { ITenantRepository } from "../../domain/repos/i-tenant.repository";
import { Tenant, TenantStatus } from "../../domain/entities/tenant.entity";
import { EventBus } from "../../infrastructure/services/event-bus.service";
import { TenantCreatedEvent } from "../../domain/events/tenant.events";
import { TOKENS_TENANT } from "@/modules/tokens/tenant.tokens";
import { IMembershipRepository } from "../../domain/repos/i-membership.repository";
import { TenantMembership, TenantRole as MembershipTenantRole, MembershipStatus } from "../../domain/entities/membership.entity";

@injectable()
export class CreateTenantUseCase {
  constructor(
    @inject(TOKENS_TENANT.repos.tenantRepo) 
    private repo: ITenantRepository,
    @inject(TOKENS_TENANT.repos.membershipRepo)
    private membershipRepo: IMembershipRepository,
    @inject(TOKENS_TENANT.services.eventBus)
    private eventBus: EventBus
  ) {}

  async execute(input: { name: string; slug: string; ownerUserId: string }) {
    const existing = await this.repo.findBySlug(input.slug);
    if (existing) {
      throw new Error("Slug already exists");
    }

    const tenant = new Tenant({
      name: input.name,
      slug: input.slug,
      ownerUserId: input.ownerUserId,
      status: TenantStatus.ACTIVE
    });

    const savedTenant = await this.repo.save(tenant);

    const ownerMembership = new TenantMembership({
      tenantId: savedTenant.id!,
      userId: input.ownerUserId,
      role: MembershipTenantRole.OWNER,
      status: MembershipStatus.ACTIVE,
    });
    await this.membershipRepo.save(ownerMembership);

    this.eventBus.publish(new TenantCreatedEvent({
      tenantId: savedTenant.id!,
      ownerUserId: savedTenant.ownerUserId
    }));

    return savedTenant.toJSON();
  }
}