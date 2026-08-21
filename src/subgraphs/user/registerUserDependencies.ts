// src/subgraphs/user/registerUserDependencies.ts

import { DependencyContainer } from "tsyringe";
import { TOKENS_USER } from "@/modules/tokens/user.tokens";
import { TOKENS_INFRA } from "@/modules/tokens/infra.tokens";

import UserService from "./services/user.service";
import userModel from "./infra/models/user.model";
import { UserRepository } from "./infra/repos/user.repo";
import { BecomeHostUseCase } from "./application/usecase/becomeHost.usecase";
import CreateOAuthUserUseCase from "./application/usecase/createOAuthUserUseCase";

import RedisService from "@/infrastructure/redis/redisService";
import { UserClient } from "@/packages/user-sdk/src";
import { registerTenantDependencies } from "@/modules/container/tenant.container";

export function registerUserDependencies(container: DependencyContainer) {
  // ── Models ─────────────────────────────────────────
  container.register(TOKENS_USER.models.user, { useValue: userModel });

  // ── Repository (single DDD token) ──────────────────
  container.register(TOKENS_USER.repos.userRepository, { useClass: UserRepository });

  // ── Use Cases ──────────────────────────────────────
  container.register(TOKENS_USER.usecase.becomeHostUseCase, { useClass: BecomeHostUseCase });
  container.register(TOKENS_USER.usecase.createOAuthUserUseCase, { useClass: CreateOAuthUserUseCase });

  // ── Service ────────────────────────────────────────
  container.register(TOKENS_USER.services.userService, { useClass: UserService });

  // ── Infrastructure ─────────────────────────────────
  container.register(TOKENS_INFRA.infra.redis, { useValue: RedisService });

  container.register(TOKENS_USER.userClient, {
    useFactory: () => new UserClient(
      process.env.USER_SUBGRAPH_URL || "http://localhost:4020/graphql"
    ),
  });

  // ── Tenant dependencies (single source of truth) ──
  registerTenantDependencies(container);

  return container;
}
