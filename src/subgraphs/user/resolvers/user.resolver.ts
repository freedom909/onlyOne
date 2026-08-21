// src/subgraphs/user/resolvers/user.resolver.ts

import { container } from "tsyringe";
import { TOKENS_USER } from "@/modules/tokens/user.tokens";
import UserService from "../services/user.service";
import { BecomeHostUseCase } from "../application/usecase/becomeHost.usecase";

interface ResolverContext {
  container: typeof container;
  user?: any;
  req: any;
}

interface UserReference {
  id: string;
  __typename?: string;
}

const resolvers = {
  // ── Federation References ──────────────────────────

  Patient: {
    __resolveReference: async (
      ref: UserReference,
      { container }: ResolverContext,
    ) => {
      const userService = container.resolve<UserService>(TOKENS_USER.services.userService);
      return userService.findById(ref.id);
    },
  },

  User: {
    __resolveReference: async (
      reference: UserReference,
      { container }: ResolverContext,
    ) => {
      const userService = container.resolve<UserService>(TOKENS_USER.services.userService);
      return userService.findById(reference.id);
    },
  },

  // ── Queries ────────────────────────────────────────

  Query: {
    currentUser: async (_parent: any, _args: any, context: ResolverContext) => {
      if (!context.user) {
        throw new Error("Unauthenticated");
      }
      const userService = context.container.resolve<UserService>(TOKENS_USER.services.userService);
      return userService.findById(context.user.userId);
    },

    user: async (_: unknown, { id }: { id: string }) => {
      const userService = container.resolve<UserService>(TOKENS_USER.services.userService);
      return userService.findById(id);
    },

    users: async (_: unknown, { limit = 50, offset = 0 }: { limit?: number; offset?: number }) => {
      const userService = container.resolve<UserService>(TOKENS_USER.services.userService);
      return userService.findAll(limit, offset);
    },

    userCount: async () => {
      const userService = container.resolve<UserService>(TOKENS_USER.services.userService);
      return userService.count();
    },

    userByEmail: async (_: unknown, { email }: { email: string }) => {
      const userService = container.resolve<UserService>(TOKENS_USER.services.userService);
      return userService.userByEmail(email);
    },

    tenantsByUser: async (_: unknown, { userId }: { userId: string }, { container }: ResolverContext) => {
      const { TOKENS_TENANT } = await import("@/modules/tokens/tenant.tokens");
      const membershipRepo = container.resolve<any>(TOKENS_TENANT.repos.membershipRepo);
      const tenantRepo = container.resolve<any>(TOKENS_TENANT.repos.tenantRepo);
      const memberships = await membershipRepo.findByUserId(userId);
      const tenantIds = memberships.map((m: any) => m.tenantId);
      if (tenantIds.length === 0) return [];
      const results = await Promise.all(tenantIds.map((id: string) => tenantRepo.findById(id)));
      return results.filter(Boolean).map((t: any) => t.toJSON ? t.toJSON() : t);
    },
  },

  // ── Mutations ──────────────────────────────────────

  Mutation: {
    becomeHost: async (_: unknown, __: any, context: ResolverContext) => {
      if (!context.user) {
        throw new Error("Unauthenticated");
      }
      const useCase = context.container.resolve<BecomeHostUseCase>(TOKENS_USER.usecase.becomeHostUseCase);
      console.log("🔥🔥 BECOME DOCTOR USECASE =", useCase);
      return useCase.execute(context.user.userId);
    },

    createUser: async (_: unknown, { input }: any) => {
      const userService = container.resolve<UserService>(TOKENS_USER.services.userService);
      return userService.create(input);
    },

    createOAuthUser: async (_: unknown, { input }: any) => {
      const { default: CreateOAuthUserUseCase } = await import(
        "../application/usecase/createOAuthUserUseCase"
      );
      const useCase = container.resolve(CreateOAuthUserUseCase);
      return useCase.execute(input);
    },

    updateProfile: async (_: unknown, { userId }: any) => {
      const userService = container.resolve<UserService>(TOKENS_USER.services.userService);
      // TODO: implement updateProfile on UserService
      return userService.findById(userId);
    },

    updateLastLogin: async (_: unknown, _args: { userId: string }) => {
      // TODO: implement updateLastLogin on UserService
      return true;
    },

    deactivateUser: async (_: unknown, { userId }: { userId: string }) => {
      const userService = container.resolve<UserService>(TOKENS_USER.services.userService);
      return userService.deactivate(userId);
    },
  },
};

export default resolvers;
