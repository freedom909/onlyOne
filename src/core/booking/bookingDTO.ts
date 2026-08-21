export interface BookingExternalDTO {
  id: string;
  patientId: string;
  price: number;
  status: string;
  metadata: {
    ipAddress?: string;
    userAgent?: string;
  };
  patientStats: {
    cancellationCount: number;
    totalBookingsCount: number;
  };
}