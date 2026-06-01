

export const getInitials = (name) => {
    if (!name) return "NA";
    const parts = name.split(" ");
    return (parts[0]?.[0] + (parts[1]?.[0] || "")).toUpperCase();
  };