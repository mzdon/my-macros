export const getDateWithoutTime = (date: Date | string = new Date()) => {
  const d = date instanceof Date ? date : new Date(date);
  return new Date(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate(),
    (d.getTimezoneOffset() / 60) * -1,
    0,
    0,
  );
};

export const isSameDay = (a: Date, b: Date) => {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};
