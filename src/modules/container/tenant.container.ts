import { CreateTenantUseCase } from "@/core/tenant/application/usecase/create-tenant.use-case";
import { GetTenantUseCase } from "@/core/tenant/application/usecase/get-tenant.use-case";
import { ListTenantsUseCase } from "@/core/tenant/application/usecase/list-tenants.use-case";
import { SuspendTenantUseCase } from "@/core/tenant/application/usecase/suspend-tenant.use-case";
import { SwitchTenantUseCase } from "@/core/tenant/application/usecase/switch-tenant.use-case";
import { UpdateTenantUseCase } from "@/core/tenant/application/usecase/update-tenant.use-case";
import { InviteMemberUseCase } from "@/core/tenant/application/usecase/invite-member.use-case";
import { UpdateMemberRoleUseCase } from "@/core/tenant/application/usecase/update-member-role.use-case";
import { RemoveMemberUseCase } from "@/core/tenant/application/usecase/remove-member.use-case";
import { MyMembershipsUseCase } from "@/core/tenant/application/usecase/my-memberships.use-case";
import { GetCurrentTenantUseCase } from "@/core/tenant/application/usecase/get-current-tenant.use-case";
import { GetTenantMembershipsUseCase } from "@/core/tenant/application/usecase/get-tenant-memberships.use-case";
import { TenantRepository } from "@/core/tenant/infrastructure/repos/tenant.repository";
import { MembershipRepository } from "@/core/tenant/infrastructure/repos/membership.repo";
import MembershipModel from "@/core/tenant/infrastructure/models/membership.model";
import TenantModel from "@/core/tenant/infrastructure/models/tenant.model";
import { EventBus } from "@/core/tenant/infrastructure/services/event-bus.service";
import { TOKENS_TENANT } from "@/modules/tokens/tenant.tokens";
import { DependencyContainer } from "tsyringe";


export function registerTenantDependencies(container: DependencyContainer) {
  container.register(TOKENS_TENANT.models.tenant, { useValue: TenantModel });
  container.register(TOKENS_TENANT.models.membership, { useValue: MembershipModel });
  container.registerSingleton(TOKENS_TENANT.services.eventBus, EventBus);
  container.register(TOKENS_TENANT.repos.tenantRepo, { useClass: TenantRepository });
  container.register(TOKENS_TENANT.repos.membershipRepo, { useClass: MembershipRepository });

  container.register(TOKENS_TENANT.useCases.createTenant, { useClass: CreateTenantUseCase });
  container.register(TOKENS_TENANT.useCases.updateTenant, { useClass: UpdateTenantUseCase });
  container.register(TOKENS_TENANT.useCases.suspendTenant, { useClass: SuspendTenantUseCase });
  container.register(TOKENS_TENANT.useCases.listTenants, { useClass: ListTenantsUseCase });
  container.register(TOKENS_TENANT.useCases.getTenant, { useClass: GetTenantUseCase });
  container.register(TOKENS_TENANT.useCases.switchTenant, { useClass: SwitchTenantUseCase });
  container.register(TOKENS_TENANT.useCases.inviteMember, { useClass: InviteMemberUseCase });
  container.register(TOKENS_TENANT.useCases.updateMemberRole, { useClass: UpdateMemberRoleUseCase });
  container.register(TOKENS_TENANT.useCases.removeMember, { useClass: RemoveMemberUseCase });
  container.register(TOKENS_TENANT.useCases.myMemberships, { useClass: MyMembershipsUseCase });
  container.register(TOKENS_TENANT.useCases.getCurrentTenant, { useClass: GetCurrentTenantUseCase });
  container.register(TOKENS_TENANT.useCases.getTenantMemberships, { useClass: GetTenantMembershipsUseCase });

  return container;
}