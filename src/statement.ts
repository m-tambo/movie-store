import { MovieCode, MovieCollection } from "./Movie";
import { Customer } from "./Customer";

export const statement = (customer: Customer, movies: MovieCollection): string => {
  return htmlStatement(customer, movies).replace(/<[^>]+>/g, '');
};

export const htmlStatement = (customer: Customer, movies: MovieCollection): string => {
  let totalAmount = 0;
  let result = `<h1>Rental Record for <em>${customer.name}</em></h1>\n`;
  result += `<ul>\n`;

  for (let r of customer.rentals) {
    let movie = movies[r.movieID as keyof MovieCollection];
    let thisAmount = getAmountOwed(movie.code, r.days);

    result += `\t<li>${movie.title} - ${thisAmount}</li>\n`;
    totalAmount += thisAmount;
  }

  result += `</ul>\n`;
  result += `<p>Amount owed is <em>${totalAmount}</em></p>\n`;
  result += `<p>You earned <em>${getFrequentRenterPts(customer, movies)}</em> frequent renter points</p>\n`;

  return result;
}

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
