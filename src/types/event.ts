/**
 * The 6 valid event states across the single FairDrop event lifecycle.
 */
export const EventState = {
  UPCOMING: "UPCOMING",
  REGISTRATION_OPEN: "REGISTRATION_OPEN",
  REGISTRATION_CLOSED: "REGISTRATION_CLOSED",
  BOOKING_OPEN: "BOOKING_OPEN",
  BOOKING_CLOSED: "BOOKING_CLOSED",
  COMPLETED: "COMPLETED",
} as const;

export type EventStateType = typeof EventState[keyof typeof EventState];

/**
 * Representation of event status exposed to API consumers.
 * Avoids inventing database schema or table fields.
 */
export interface EventStatusResponse {
  state: EventStateType;
  allowedOperations: {
    registration: boolean;
    booking: boolean;
  };
}
