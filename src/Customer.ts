export interface Rental {
  movieID: string;
  days: number;
}

export interface Customer {
  name: string;
  rentals: Rental[];
}
