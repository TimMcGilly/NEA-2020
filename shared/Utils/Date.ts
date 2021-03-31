//Gets the date 13 years ago from current time.
export function Date13YearAgo() : Date {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setFullYear(date.getFullYear() - 13);
  return date;
}

//https://stackoverflow.com/questions/563406/add-days-to-javascript-date
//Adds specified number of dates to date object
export function AddDaysToDate(date: Date, days: number): Date{
  let result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

//Converts a date object to a string in YMD format
export function DateToYMDString(date : Date): string { return date.toISOString().split('T')[0]; }
