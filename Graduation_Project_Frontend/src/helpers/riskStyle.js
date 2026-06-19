
export const riskStyles = {
  Low: {
    color: "#4A6B4E",
    backgroundColor: "#E6F4EA",
    label: "Low Risk",
  },
  Medium: {
    color: "#DAA520",
    backgroundColor: "#fff8de",
    label: "Medium Risk",
  },
  High: {
    color: "#D7263D",
    backgroundColor: "#FDEAEA",
    label: "High Risk",
  },
};

export const normalizeRisk = (risk) => {
  if (!risk) return "Low";

  if (risk.includes("Low")) return "Low";

  if (risk.includes("Medium") || risk.includes("Moderate")) return "Medium";

  if (risk.includes("High")) return "High";

  return "Not Predicted";
};