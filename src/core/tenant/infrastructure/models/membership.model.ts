import mongoose, { Schema, Document } from "mongoose"

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

export interface MembershipDocument extends Document {
  userId: mongoose.Types.ObjectId
  tenantId: mongoose.Types.ObjectId
  role: TenantRole
  status: MembershipStatus
  invitedEmail?: string
  createdAt: Date
  updatedAt: Date
}

const membershipSchema = new Schema<MembershipDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: false,
      index: true,
    },

    tenantId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    role: {
      type: String,
      enum: Object.values(TenantRole),
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(MembershipStatus),
      default: MembershipStatus.ACTIVE,
    },

    invitedEmail: {
      type: String,
      required: false,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

membershipSchema.index({ userId: 1, tenantId: 1 }, { unique: true, partialFilterExpression: { userId: { $exists: true } } })
membershipSchema.index({ invitedEmail: 1, tenantId: 1 }, { unique: true, partialFilterExpression: { invitedEmail: { $exists: true } } })
membershipSchema.index({ tenantId: 1, status: 1 })

const MembershipModel =
  mongoose.models.TenantMembership ||
  mongoose.model<MembershipDocument>("TenantMembership", membershipSchema)

export default MembershipModel