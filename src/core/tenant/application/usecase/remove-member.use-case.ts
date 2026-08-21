import { injectable, inject } from "tsyringe";
import { TOKENS_TENANT } from "@/modules/tokens/tenant.tokens";
import { IMembershipRepository } from "../../domain/repos/i-membership.repository";
import { TenantRole, MembershipStatus } from "../../domain/entities/membership.entity";

@injectable()
export class RemoveMemberUseCase {
  constructor(
    @inject(TOKENS_TENANT.repos.membershipRepo)
    private membershipRepo: IMembershipRepository
  ) {}

  async execute(input: {
    actorUserId: string
    membershipId: string
  }): Promise<boolean> {
    const { actorUserId, membershipId } = input

    const targetMembership = await this.membershipRepo.findById(membershipId)
    if (!targetMembership) {
      throw new Error("Membership not found")
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

    const canRemove =
      actorMembership.role === TenantRole.OWNER ||
      actorMembership.role === TenantRole.MANAGER

    if (!canRemove) {
      throw new Error("You do not have permission to remove members")
    }

    if (targetMembership.role === TenantRole.OWNER) {
      throw new Error("Cannot remove the OWNER membership")
    }

    targetMembership.remove()
    await this.membershipRepo.update(targetMembership)
    return true
  }
}
