import { MovieCode, MovieCollection } from "./Movie";
import { Customer } from "./Customer";
// const movies: MovieCollection = require("./data/movies.json");

export const statement = (customer: Customer, movies: MovieCollection): string => {
  let totalAmount = 0;
  let result = `Rental Record for ${customer.name}\n`;

  for (let r of customer.rentals) {
    let movie = movies[r.movieID as keyof MovieCollection];
    let thisAmount = getAmountOwed(movie.code, r.days);

    result += `\t${movie.title}\t${thisAmount}\n`;
    totalAmount += thisAmount;
  }

  result += `Amount owed is ${totalAmount}\n`;
  result += `You earned ${getFrequentRenterPts(customer, movies)} frequent renter points\n`;

  return result;
};

function getFrequentRenterPts(c: Customer, movies: MovieCollection): number {
  let points = c.rentals.length;

  for (let r of c.rentals) {
    if (movies[r.movieID as keyof MovieCollection].code === MovieCode.NEW && r.days > 2) {
      points++;
    }
  }

  return points;
}

function getAmountOwed(code: MovieCode, days: number): number {
  let owed = 0;

  switch (code) {
    case MovieCode.REGULAR:
      owed = 2;
      if (days > 2) {
        owed += (days - 2) * 1.5;
      }
      break;
    case MovieCode.NEW:
      owed = days * 3;
      break;
    case MovieCode.CHILDRENS:
      owed = 1.5;
      if (days > 3) {
        owed += (days - 3) * 1.5;
      }
      break;
  }

  return owed;
}
