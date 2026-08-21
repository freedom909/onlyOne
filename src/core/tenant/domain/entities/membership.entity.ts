export enum TenantRole {
  OWNER = "OWNER",
  DOCTOR = "DOCTOR",
  NURSE = "NURSE",
  RECEPTIONIST = "RECEPTIONIST",
  HYGIENIST = "HYGIENIST",
  ACCOUNTANT = "ACCOUNTANT",
  MANAGER = "MANAGER",
}

export enum MembershipStatus {
  INVITED = "INVITED",
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  REMOVED = "REMOVED",
}

export interface TenantMembershipProps {
  id?: string
  userId?: string
  tenantId: string
  role: TenantRole
  status: MembershipStatus
  invitedEmail?: string
  createdAt?: Date
  updatedAt?: Date
}

export class TenantMembership {
  constructor(private props: TenantMembershipProps) {}

  get id() { return this.props.id }
  get userId() { return this.props.userId }
  get tenantId() { return this.props.tenantId }
  get role() { return this.props.role }
  get status() { return this.props.status }
  get invitedEmail() { return this.props.invitedEmail }
  get createdAt() { return this.props.createdAt }
  get updatedAt() { return this.props.updatedAt }

  public changeRole(newRole: TenantRole) {
    if (this.props.status === MembershipStatus.REMOVED) {
      throw new Error("Cannot change role of a removed membership")
    }
    this.props.role = newRole
  }

  public suspend() {
    if (this.props.role === TenantRole.OWNER) {
      throw new Error("Cannot suspend the OWNER membership")
    }
    this.props.status = MembershipStatus.SUSPENDED
  }

  public activate() {
    this.props.status = MembershipStatus.ACTIVE
  }

  public remove() {
    if (this.props.role === TenantRole.OWNER) {
      throw new Error("Cannot remove the OWNER membership")
    }
    this.props.status = MembershipStatus.REMOVED
  }

  public acceptInvite(userId: string) {
    if (this.props.status !== MembershipStatus.INVITED) {
      throw new Error("Only INVITED memberships can be accepted")
    }
    this.props.userId = userId
    this.props.status = MembershipStatus.ACTIVE
    this.props.invitedEmail = undefined
  }

  public toJSON() { return { ...this.props } }
}
