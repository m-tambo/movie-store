import { MovieCode, MovieCollection } from "./Movie";
import { Customer } from "./Customer";

export const statement = (customer: Customer, movies: MovieCollection): string => {
  return htmlStatement(customer, movies).replace(/<[^>]+>/g, '');
};

export const htmlStatement = (customer: Customer, movies: MovieCollection): string => {
  let totalAmount = 0;
  let output = [];

  let name = enclose(customer.name, 'em');
  output.push(enclose(`Rental Record for ${name}`, 'h1'));
  
  output.push('<ul>');

  for (let r of customer.rentals) {
    let movie = movies[r.movieID as keyof MovieCollection];
    let thisAmount = getAmountOwed(movie.code, r.days);

    output.push('\t' + enclose(`${movie.title} - ${thisAmount}`, 'li'));
    totalAmount += thisAmount;
  }

  output.push('</ul>');

  let total = enclose(totalAmount, 'em');
  output.push(enclose(`Amount owed is ${total}`, 'p'));

  let points = enclose(getFrequentRenterPts(customer, movies), 'em');
  output.push(enclose(`You earned ${points} frequent renter points`, 'p'));

  return output.join('\n');
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

function enclose(content: any, el: string): string {
  return `<${el}>${content}</${el}>`;
}
