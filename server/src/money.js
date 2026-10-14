export function assertMinorAmount(value, label = "amount") {
  if (!Number.isSafeInteger(value) || value < 0) throw new TypeError(label + " must be a non-negative safe integer in the currency's minor unit.");
  return value;
}
export function formatMinorAmount(value, currency = "SAR") {
  assertMinorAmount(value);
  return new Intl.NumberFormat("en", { style: "currency", currency }).format(value / 100);
}
export function calculateOrderTotal(items) {
  if (!Array.isArray(items) || items.length === 0) throw new TypeError("An order must contain at least one item.");
  return items.reduce((sum, item) => {
    const price = assertMinorAmount(item.priceMinor, "priceMinor");
    if (!Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > 20) throw new TypeError("quantity must be an integer from 1 to 20.");
    const line = price * item.quantity;
    if (!Number.isSafeInteger(line) || !Number.isSafeInteger(sum + line)) throw new RangeError("Order total exceeds the supported amount.");
    return sum + line;
  }, 0);
}
