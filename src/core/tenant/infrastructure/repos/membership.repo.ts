import { injectable, inject } from 'tsyringe';
import { Model } from 'mongoose';
import { MembershipDocument, TenantRole, MembershipStatus } from '../models/membership.model';
import { TOKENS_TENANT } from '@/modules/tokens/tenant.tokens';
import { TenantMembership } from '../../domain/entities/membership.entity';
import { IMembershipRepository } from '../../domain/repos/i-membership.repository';

function toDomain(doc: MembershipDocument): TenantMembership {
  return new TenantMembership({
    id: doc._id.toString(),
    userId: doc.userId ? doc.userId.toString() : undefined,
    tenantId: doc.tenantId.toString(),
    role: doc.role as TenantRole,
    status: doc.status as MembershipStatus,
    invitedEmail: doc.invitedEmail,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  });
}

function toPersistence(entity: TenantMembership): Partial<MembershipDocument> {
  const json = entity.toJSON();
  return {
    userId: json.userId ? (json.userId as any) : undefined,
    tenantId: json.tenantId as any,
    role: json.role,
    status: json.status,
    invitedEmail: json.invitedEmail,
  };
}

@injectable()
export class MembershipRepository implements IMembershipRepository {
  constructor(
    @inject(TOKENS_TENANT.models.membership) private model: Model<MembershipDocument>
  ) {}

  async save(entity: TenantMembership): Promise<TenantMembership> {
    const data = toPersistence(entity);
    const doc = await this.model.create(data);
    return toDomain(doc);
  }

  async update(entity: TenantMembership): Promise<TenantMembership> {
    const id = entity.id;
    if (!id) throw new Error("Membership id is required for update");
    const data = toPersistence(entity);
    const doc = await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!doc) throw new Error(`Membership ${id} not found`);
    return toDomain(doc);
  }

  async findById(id: string): Promise<TenantMembership | null> {
    const doc = await this.model.findById(id).exec();
    return doc ? toDomain(doc) : null;
  }

  async findByUserId(userId: string): Promise<TenantMembership[]> {
    const docs = await this.model
      .find({ userId, status: { $ne: MembershipStatus.REMOVED } })
      .exec();
    return docs.map(toDomain);
  }

  async findByUserAndTenant(userId: string, tenantId: string): Promise<TenantMembership | null> {
    const doc = await this.model
      .findOne({
        userId,
        tenantId,
        status: { $ne: MembershipStatus.REMOVED },
      })
      .exec();
    return doc ? toDomain(doc) : null;
  }

  async findByTenantId(tenantId: string): Promise<TenantMembership[]> {
    const docs = await this.model
      .find({ tenantId, status: { $ne: MembershipStatus.REMOVED } })
      .exec();
    return docs.map(toDomain);
  }

  async findByInvitedEmailAndTenant(email: string, tenantId: string): Promise<TenantMembership | null> {
    const doc = await this.model
      .findOne({
        invitedEmail: email.toLowerCase(),
        tenantId,
      })
      .exec();
    return doc ? toDomain(doc) : null;
  }
}
