export const PP = "Poppins, system-ui, sans-serif";
export const RB = "Roboto, system-ui, sans-serif";

export type UserRole = "ADMIN" | "DOCTOR" | "RECEPTIONIST" | "ACCOUNTANT";

/**
 * Formats financial amounts with Indian Rupee (₹) symbol and Lacs/Cr/k suffixes for large numbers.
 * e.g. 15000000 -> "₹1.50 Cr", 250000 -> "₹2.50 Lacs", 15000 -> "₹15.0k", 850 -> "₹850"
 */
export function formatIndianCurrency(amount: number): string {
  const num = Number(amount) || 0;
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  }
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2)} Lacs`;
  }
  if (num >= 1000) {
    return `₹${(num / 1000).toFixed(1)}k`;
  }
  return `₹${num.toLocaleString("en-IN")}`;
}

/**
 * Formats exact currency values in Indian Rupees with 2 decimal places.
 * e.g. 1500 -> "₹1,500.00"
 */
export function formatRupees(amount: number): string {
  const num = Number(amount) || 0;
  return `₹${num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
