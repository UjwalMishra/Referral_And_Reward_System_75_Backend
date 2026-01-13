export const exportToCSV = (
  rows: Record<string, any>[],
  headers: string[]
): string => {
  const csvRows: string[] = [];

  // Header row
  csvRows.push(headers.join(","));

  // Data rows
  for (const row of rows) {
    const values = headers.map((header) => {
      const val = row[header] ?? "";
      return `"${String(val).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(","));
  }

  return csvRows.join("\n");
};
