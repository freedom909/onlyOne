//src/modules/container/review.register.ts

import { container } from "tsyringe";
import { TOKENS_REVIEW } from "../tokens/review.tokens";
import { ReviewRepositoryImpl } from "@/core/review/infrastructure/repos/review.repository";
import { ReviewModel } from "@/core/review/infrastructure/models/ReviewModel";


import { ModeratePolicyRepository } from "@/core/review/infrastructure/repos/moderate.policy.repo";
import { SubmitPatientReviewUseCase } from "@/core/review/application/usecase/create.reviewUseCase";
import { SubmitOwnerReplyToPatientReviewUseCase } from "@/core/review/application/usecase/submitOwnerReplyToPatient.usecase";

export function registerReviewDependencies() {
  // Models
  container.register(TOKENS_REVIEW.infrastructure.mongooseModel, { useValue: ReviewModel });

  // Repositories
  container.register(TOKENS_REVIEW.repository.reviewRepository, { 
    useClass: ReviewRepositoryImpl 
  });

  // // Domain Services
   container.register(TOKENS_REVIEW.service.moderationPolicy, { useClass: ModeratePolicyRepository });
  // container.register(TOKENS_REVIEW.service.validationService, { useClass: ReviewValidationService });

  // Use Cases
  container.register(TOKENS_REVIEW.usecase.submitPatientReview, { useClass: SubmitPatientReviewUseCase });
  container.register(TOKENS_REVIEW.usecase.submitOwnerReplyToPatientReview, { useClass: SubmitOwnerReplyToPatientReviewUseCase });
  // container.register(TOKENS_REVIEW.usecase.updateReview, { useClass: UpdateReviewUseCase });
  // container.register(TOKENS_REVIEW.usecase.deleteReview, { useClass: DeleteReviewUseCase });
  // container.register(TOKENS_REVIEW.usecase.replyToReview, { useClass: ReplyToReviewUseCase });
  // container.register(TOKENS_REVIEW.usecase.reportReview, { useClass: ReportReviewUseCase });
}