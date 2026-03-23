export interface UpdateFavoriteRequest {
  listingId: string;
  favorite: boolean;
}

export interface GetListingQuery {
  userId?: string;
  roomCount?: number;
  guestCount?: number;
  bathroomCount?: number;
  country?: string;
  startDate?: Date;
  endDate?: Date;
  category?: string;
  cursor?: string;
}

export interface GetPropertyQuery {
  userId?: string;
  cursor?: string;
}

export interface GetReservationQuery {
  listingId?: string;
  userId?: string;
  authorId?: string;
  cursor?: string;
}

export interface CreatePaymentSessionRequest {
  listingId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
}
