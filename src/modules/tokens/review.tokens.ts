export const TOKENS_REVIEW = {
  repository: {
    reviewRepository: Symbol.for("ReviewRepository"),
  },
  usecase: {
    submitPatientReview: Symbol.for("SubmitPatientReviewUseCase"),
    updateReview: Symbol.for("UpdateReviewUseCase"),
    deleteReview: Symbol.for("DeleteReviewUseCase"),
    replyToReview: Symbol.for("ReplyToReviewUseCase"),
    reportReview: Symbol.for("ReportReviewUseCase"),
    getListingReviews: Symbol.for("GetListingReviewsUseCase"),
    getOwnerReviews: Symbol.for("GetOwnerReviewsUseCase"),
    submitOwnerReplyToPatientReview: Symbol.for("SubmitOwnerReplyToPatientReviewUseCase"),
  },
  service: {
    moderationPolicy: Symbol.for("ReviewModerationPolicy"),
    validationService: Symbol.for("ReviewValidationService"),
    reviewMapper: Symbol.for("ReviewMapper"),
    moderationService: Symbol.for("ReviewModerationService"),
  },
  infrastructure: {
    mongooseModel: Symbol.for("ReviewMongooseModel"),
  },
};