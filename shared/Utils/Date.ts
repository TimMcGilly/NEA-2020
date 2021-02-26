export function Date13YearAgo() : Date {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setFullYear(date.getFullYear() - 13);
  return date;
}

export function AddDaysToDate(date: Date, days: number): Date{
  let result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function DateToYMDString(date : Date): string { return date.toISOString().split('T')[0]; }
