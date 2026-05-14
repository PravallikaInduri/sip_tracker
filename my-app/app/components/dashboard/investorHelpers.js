export function getInvestorName(investor = {}) {
  const fullName = [investor?.first_name, investor?.middle_name, investor?.last_name]
    .filter((part) => typeof part === "string" && part.trim())
    .join(" ");
  return fullName || "Unknown Investor";
}

export function getInvestorEmail(investor = {}) {
  return investor?.email || investor?.username || investor?.user?.email || "—";
}

export function getInvestorAadhaar(investor = {}) {
  return investor?.adhaar_no || "—";
}

export function getInvestorKey(investor = {}, index) {
  return investor?.id || investor?.email || investor?.adhaar_no || investor?.mobile || investor?.mobile_number || index;
}
