import { gql } from "@apollo/client";

export const GET_PAYMENTS_BY_CUSTOMER = gql`
  query GetPaymentsByPatient($patientId: ID!) {
    paymentsByPatient(patientId: $patientId) {
      id
      bookingId
      patientId
      tenantId
      amount
      status
      paymentIntentId
      createdAt
      updatedAt
    }
  }
`;

export const GET_PAYMENT = gql`
  query GetPayment($id: ID!) {
    payment(id: $id) {
      id
      bookingId
      patientId
      tenantId
      amount
      status
      paymentIntentId
      createdAt
      updatedAt
    }
  }
`;

export const GET_PAYMENT_BY_BOOKING = gql`
  query GetPaymentByBooking($bookingId: ID!) {
    paymentByBooking(bookingId: $bookingId) {
      id
      bookingId
      patientId
      tenantId
      amount
      status
      paymentIntentId
      createdAt
      updatedAt
    }
  }
`;
