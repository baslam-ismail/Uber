export interface Clock {
  getNow(): Date;
}

export function isChristmas(date: Date): boolean {
  const m = date.getMonth(), d = date.getDate(), h = date.getHours();
  return (m === 11 && d === 25) || (m === 11 && d === 24 && h >= 18);
}

export function isBirthday(date: Date, birth?: Date): boolean {
  return !!birth && date.getDate() === birth.getDate() && date.getMonth() === birth.getMonth();
}