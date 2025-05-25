export function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/); // split by one or more spaces

  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }

  const first = parts[0][0];
  const last = parts[parts.length - 1][0];

  return (first + last).toUpperCase();
}

export function formatCurrency(value: number, currencyCode = 'USD') {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 2,
    notation: 'compact',
    compactDisplay: 'short',
  });
  return formatter.format(value);
}
