// utils.js

export function formatNumber(value) {
  try {
    if (typeof value !== "number" || isNaN(value)) {
      throw new TypeError("Invalid input: value must be a valid number.");
    }

    if (value >= 1e12) return (value / 1e12).toFixed(2) + "T";
    if (value >= 1e9) return (value / 1e9).toFixed(2) + "B";
    if (value >= 1e6) return (value / 1e6).toFixed(1) + "M";
    if (value >= 1e3) return (value / 1e3).toFixed(1) + "K";
    return value.toLocaleString();
  } catch (error) {
    console.error("formatNumber error:", error);
    return "N/A"; // or any default fallback
  }
}
