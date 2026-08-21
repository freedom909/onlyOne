

import { SubmitPatientReviewUseCase } from "@/core/review/application/usecase/create.reviewUseCase";
import { SubmitOwnerReplyToPatientReviewUseCase } from "@/core/review/application/usecase/submitOwnerReplyToPatientReviewUseCase";
import { IReviewRepository } from "@/core/review/domain/entities/repos/IReviewRepository";
import { TOKENS_REVIEW } from "@/modules/tokens/review.tokens";
import { container } from "tsyringe";
import { withAuthorization } from "@/infrastructure/auth/withAuthorization";
import { Action, Resource } from "@/subgraphs/user/domain/entities/types";


export const reviewResolvers = {
  Query: {
    review: async (_: any, { id }: { id: string }) => {
      const repo = container.resolve<IReviewRepository>(TOKENS_REVIEW.repository.reviewRepository);
      return repo.findById(id);
    },
    reviewsByListing: async (_: any, { listingId }: { listingId: string }) => {
      const repo = container.resolve<IReviewRepository>(TOKENS_REVIEW.repository.reviewRepository);
      return repo.findByListingId(listingId);
    }
  },
  Mutation: {
    submitPatientReview: withAuthorization(Action.CREATE, Resource.REVIEW, async (_: any, { input }: any, context: any) => {
      console.log("input++:", input);
      const useCase = container.resolve<SubmitPatientReviewUseCase>(TOKENS_REVIEW.usecase.submitPatientReview);
      return useCase.execute({ ...input, patientId: context.user.id });
    }),

    submitOwnerReplyToPatientReview: withAuthorization(Action.CREATE, Resource.REVIEW, async (_: any, { input }: any, context: any) => {
      console.log("input+++:", input);
      const useCase = container.resolve<SubmitOwnerReplyToPatientReviewUseCase>(TOKENS_REVIEW.usecase.submitOwnerReplyToPatientReview);
      return useCase.execute({ ...input, ownerId: context.user.id });
    }),

    updateReview: withAuthorization(Action.UPDATE, Resource.REVIEW, async (_: any, { id, input }: any) => {
        const useCase = container.resolve(TOKENS_REVIEW.usecase.updateReview) as any;
        return useCase.execute(id, input);
    }, {
      resolveOwnerId: async (_ctx, { id }) => {
        const repo = container.resolve<IReviewRepository>(TOKENS_REVIEW.repository.reviewRepository);
        const review = await repo.findById(id);
        return review?.patientId ?? null;
      },
    }),

    deleteReview: withAuthorization(Action.DELETE, Resource.REVIEW, async (_: any, { id }: any) => {
        const useCase = container.resolve(TOKENS_REVIEW.usecase.deleteReview) as any;
        await useCase.execute(id);
        return true;
    }),
  },
  Review: {
    author: (review: any) => ({ __typename: "Patient", id: review.patientId }),
    listing: (review: any) => ({ __typename: "Listing", id: review.listingId }),
    owner: (review: any) => ({ __typename: "Owner", id: review.ownerId }),
  }
};