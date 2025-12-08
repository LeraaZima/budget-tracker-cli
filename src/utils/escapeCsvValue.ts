export function escapeCsvValue(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""').replace(/\n/g, ' ')}"`;
  }
  return value;
}
