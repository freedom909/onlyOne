import { TenantMembership } from "../entities/membership.entity"

export interface IMembershipRepository {
  save(membership: TenantMembership): Promise<TenantMembership>
  findById(id: string): Promise<TenantMembership | null>
  findByUserId(userId: string): Promise<TenantMembership[]>
  findByUserAndTenant(userId: string, tenantId: string): Promise<TenantMembership | null>
  findByTenantId(tenantId: string): Promise<TenantMembership[]>
  findByInvitedEmailAndTenant(email: string, tenantId: string): Promise<TenantMembership | null>
  update(membership: TenantMembership): Promise<TenantMembership>
}
