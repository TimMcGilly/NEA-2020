// Gets the date 13 years ago from current time.
export function Date13YearAgo() : Date {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setFullYear(date.getFullYear() - 13);
  return date;
}

// https://stackoverflow.com/questions/563406/add-days-to-javascript-date
// Adds specified number of dates to date object
export function AddDaysToDate(date: Date, days: number): Date{
  let result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Converts a date object to a string in YMD format
// Offset code from https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
export function DateToYMDString(date : Date): string { 
  const offset = date.getTimezoneOffset()
  date = new Date(date.getTime() - (offset*60*1000))
  return date.toISOString().split('T')[0] 
}
