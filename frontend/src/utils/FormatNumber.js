export default function formatNumber(num, digits) {
  // Storing symbols based on number size
  let symbols = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  let regex = /\.0+$|(\.[0-9]*[1-9])0+$/,
    i;
  for (i = symbols.length - 1; i > 0; i--) {
    // Stop when the symbol value is greater or equal to the passed number
    // "i" will be by then equal to the index of the corresponding symbol
    if (num >= symbols[i].value) {
      break;
    }
  }
  return (
    (num / symbols[i].value).toFixed(digits).replace(regex, "$1") +
    symbols[i].symbol
  );
}
