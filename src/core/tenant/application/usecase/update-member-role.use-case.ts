import { injectable, inject } from "tsyringe";
import { TOKENS_TENANT } from "@/modules/tokens/tenant.tokens";
import { IMembershipRepository } from "../../domain/repos/i-membership.repository";
import { TenantRole, MembershipStatus } from "../../domain/entities/membership.entity";

@injectable()
export class UpdateMemberRoleUseCase {
  constructor(
    @inject(TOKENS_TENANT.repos.membershipRepo)
    private membershipRepo: IMembershipRepository
  ) {}

  async execute(input: {
    actorUserId: string
    membershipId: string
    role: TenantRole
  }) {
    const { actorUserId, membershipId, role } = input

    const targetMembership = await this.membershipRepo.findById(membershipId)
    if (!targetMembership) {
      throw new Error("Membership not found")
    }

    if (targetMembership.role === TenantRole.OWNER) {
      throw new Error("Cannot change the OWNER role")
    }

    if (role === TenantRole.OWNER) {
      throw new Error("Cannot assign OWNER role")
    }

    const actorMembership = await this.membershipRepo.findByUserAndTenant(
      actorUserId,
      targetMembership.tenantId
    )
    if (!actorMembership) {
      throw new Error("You are not a member of this tenant")
    }
    if (actorMembership.status !== MembershipStatus.ACTIVE) {
      throw new Error("Your membership is not active")
    }

    const canManage =
      actorMembership.role === TenantRole.OWNER ||
      actorMembership.role === TenantRole.MANAGER

    if (!canManage) {
      throw new Error("You do not have permission to manage member roles")
    }

    targetMembership.changeRole(role)
    const updated = await this.membershipRepo.update(targetMembership)
    return updated.toJSON()
  }
}
