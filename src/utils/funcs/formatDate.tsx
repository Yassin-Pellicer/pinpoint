const formatToDateString = (rawDate) =>
  rawDate ? `Date ${new Date(rawDate).toString()}` : null;

export default formatToDateString;