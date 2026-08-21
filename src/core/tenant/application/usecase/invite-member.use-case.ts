import { injectable, inject } from "tsyringe";
import { TOKENS_TENANT } from "@/modules/tokens/tenant.tokens";
import { ITenantRepository } from "../../domain/repos/i-tenant.repository";
import { IMembershipRepository } from "../../domain/repos/i-membership.repository";
import { TenantMembership, TenantRole, MembershipStatus } from "../../domain/entities/membership.entity";
import { TenantStatus } from "../../domain/entities/tenant.entity";

@injectable()
export class InviteMemberUseCase {
  constructor(
    @inject(TOKENS_TENANT.repos.tenantRepo)
    private tenantRepo: ITenantRepository,
    @inject(TOKENS_TENANT.repos.membershipRepo)
    private membershipRepo: IMembershipRepository
  ) {}

  async execute(input: {
    actorUserId: string
    tenantId: string
    email: string
    role: TenantRole
  }) {
    const { actorUserId, tenantId, email, role } = input

    const tenant = await this.tenantRepo.findById(tenantId)
    if (!tenant) {
      throw new Error("Tenant not found")
    }
    if (tenant.status !== TenantStatus.ACTIVE) {
      throw new Error("Tenant is not active")
    }

    const actorMembership = await this.membershipRepo.findByUserAndTenant(actorUserId, tenantId)
    if (!actorMembership) {
      throw new Error("You are not a member of this tenant")
    }
    if (actorMembership.status !== MembershipStatus.ACTIVE) {
      throw new Error("Your membership is not active")
    }

    const canInvite =
      actorMembership.role === TenantRole.OWNER ||
      actorMembership.role === TenantRole.MANAGER ||
      actorMembership.role === TenantRole.RECEPTIONIST

    if (!canInvite) {
      throw new Error("You do not have permission to invite members")
    }

    if (role === TenantRole.OWNER) {
      throw new Error("Cannot assign OWNER role via invite")
    }

    const existingByEmail = await this.membershipRepo.findByInvitedEmailAndTenant(email, tenantId)
    if (existingByEmail) {
      throw new Error("This email has already been invited to this tenant")
    }

    const membership = new TenantMembership({
      tenantId,
      role,
      status: MembershipStatus.INVITED,
      invitedEmail: email.toLowerCase(),
    })

    const saved = await this.membershipRepo.save(membership)
    return saved.toJSON()
  }
}
