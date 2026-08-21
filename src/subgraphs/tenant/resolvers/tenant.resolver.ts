import { TOKENS_TENANT } from '@/modules/tokens/tenant.tokens';
import { DependencyContainer } from 'tsyringe';
import { SessionService } from '@/subgraphs/auth/infrastructure/services/session.service';

type TenantParent = {
  id: string;
  ownerUserId: string;
};

type MembershipParent = {
  id: string;
  userId?: string;
  tenantId: string;
};

export const resolvers = {
  Query: {
    getTenant: async (
      _: unknown,
      { id }: { id: string },
      { container }: { container: DependencyContainer }
    ) => {
      const useCase = container.resolve<any>(TOKENS_TENANT.useCases.getTenant);
      return useCase.execute(id);
    },

    getTenants: async (
      _: unknown,
      { filter }: any,
      { container }: { container: DependencyContainer }
    ) => {
      const useCase = container.resolve<any>(TOKENS_TENANT.useCases.listTenants);
      return useCase.execute(filter || {});
    },

    myMemberships: async (
      _: unknown,
      __: unknown,
      { user, container }: { user: any; container: DependencyContainer }
    ) => {
      if (!user?.userId) {
        throw new Error('Unauthenticated');
      }
      const useCase = container.resolve<any>(TOKENS_TENANT.useCases.myMemberships);
      return useCase.execute(user.userId);
    },

    getCurrentTenant: async (
      _: unknown,
      __: unknown,
      { user, container }: { user: any; container: DependencyContainer }
    ) => {
      const useCase = container.resolve<any>(TOKENS_TENANT.useCases.getCurrentTenant);
      return useCase.execute(user?.activeTenantId);
    },
  },

  Mutation: {
    createTenant: async (
      _: unknown,
      { input }: any,
      { user, container }: { user: any; container: DependencyContainer }
    ) => {
      if (!user?.userId) {
        throw new Error('Unauthenticated');
      }
      const useCase = container.resolve<any>(TOKENS_TENANT.useCases.createTenant);
      return useCase.execute({ ...input, ownerUserId: user.userId });
    },

    updateTenant: async (
      _: unknown,
      { id, name }: any,
      { container }: { container: DependencyContainer }
    ) => {
      const useCase = container.resolve<any>(TOKENS_TENANT.useCases.updateTenant);
      return useCase.execute({ tenantId: id, name });
    },

    suspendTenant: async (
      _: unknown,
      { id }: { id: string },
      { container }: { container: DependencyContainer }
    ) => {
      const useCase = container.resolve<any>(TOKENS_TENANT.useCases.suspendTenant);
      return useCase.execute(id);
    },

    switchTenant: async (
      _: unknown,
      { tenantId }: { tenantId: string },
      { user, container }: { user: any; container: DependencyContainer }
    ) => {
      if (!user?.userId) {
        throw new Error('Unauthenticated');
      }

      const useCase = container.resolve<any>(TOKENS_TENANT.useCases.switchTenant);
      const result = await useCase.execute({ userId: user.userId, tenantId });

      if (user?.sessionId) {
        const sessionService = new SessionService();
        await sessionService.updateActiveTenant(user.sessionId, tenantId);
      }

      return result;
    },

    inviteMember: async (
      _: unknown,
      { input }: any,
      { user, container }: { user: any; container: DependencyContainer }
    ) => {
      if (!user?.userId) {
        throw new Error('Unauthenticated');
      }
      const useCase = container.resolve<any>(TOKENS_TENANT.useCases.inviteMember);
      return useCase.execute({
        actorUserId: user.userId,
        tenantId: input.tenantId,
        email: input.email,
        role: input.role,
      });
    },

    updateMemberRole: async (
      _: unknown,
      { membershipId, role }: any,
      { user, container }: { user: any; container: DependencyContainer }
    ) => {
      if (!user?.userId) {
        throw new Error('Unauthenticated');
      }
      const useCase = container.resolve<any>(TOKENS_TENANT.useCases.updateMemberRole);
      return useCase.execute({
        actorUserId: user.userId,
        membershipId,
        role,
      });
    },

    removeMember: async (
      _: unknown,
      { membershipId }: { membershipId: string },
      { user, container }: { user: any; container: DependencyContainer }
    ) => {
      if (!user?.userId) {
        throw new Error('Unauthenticated');
      }
      const useCase = container.resolve<any>(TOKENS_TENANT.useCases.removeMember);
      return useCase.execute({
        actorUserId: user.userId,
        membershipId,
      });
    },
  },

  Tenant: {
    __resolveReference: async (
      reference: { id: string },
      { container }: { container: DependencyContainer }
    ) => {
      const useCase = container.resolve<any>(TOKENS_TENANT.useCases.getTenant);
      return useCase.execute(reference.id);
    },

    owner: (parent: TenantParent) => {
      if (!parent.ownerUserId) return null;
      return {
        __typename: 'User',
        id: parent.ownerUserId,
      };
    },

    memberships: async (
      parent: TenantParent,
      _: unknown,
      { container }: { container: DependencyContainer }
    ) => {
      const useCase = container.resolve<any>(TOKENS_TENANT.useCases.getTenantMemberships);
      return useCase.execute(parent.id);
    },
  },

  TenantMembership: {
    user: (parent: MembershipParent) => {
      if (!parent.userId) return null;
      return {
        __typename: 'User',
        id: parent.userId,
      };
    },

    tenant: (parent: MembershipParent) => {
      return {
        __typename: 'Tenant',
        id: parent.tenantId,
      };
    },
  },
};
