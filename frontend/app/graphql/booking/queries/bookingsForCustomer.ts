import { gql } from "@apollo/client";


// booking.queries.ts
export const GET_BOOKINGS = gql`
query BookingsForPatient($userId: ID!) {
  bookingsForPatient(userId: $userId) {
    checkInDate
    checkOutDate
    createdAt
    price
    tenant {
      name
      owner {
pictures {
    id
    objectKey
    url
    mimeType
    size
    type
    sortOrder
}
      }
    }
  }
}
`;