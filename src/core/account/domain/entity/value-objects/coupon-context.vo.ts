// CouponContext — used by CouponRule
export interface CouponContext {
  couponCode: string;
  listingId: string;
  totalPrice: number;
  patientId: string;
  checkInDate: Date;
  checkOutDate: Date;
}

export interface CouponValidationResult {
  valid: boolean;
  discountType: "percentage" | "fixed";
  discountValue: number;
  finalPrice: number;
  reason: string;
}
