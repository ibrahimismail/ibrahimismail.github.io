const MONTH_NAMES = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
] as const;

export interface DateRange {
  startMonth: number;
  startYear: number;
  endMonth?: number | null;
  endYear?: number | null;
}

function getDurationMonths(
  startMonth: number,
  startYear: number,
  endMonth: number,
  endYear: number
): number {
  return (endYear - startYear) * 12 + (endMonth - startMonth);
}

function formatDuration(totalMonths: number): string {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const parts: string[] = [];

  if (years > 0) {
    parts.push(`${years} ${years === 1 ? "year" : "years"}`);
  }
  if (months > 0) {
    parts.push(`${months} ${months === 1 ? "month" : "months"}`);
  }
  if (parts.length === 0) {
    return "less than 1 month";
  }

  return parts.join(" ");
}

export function formatExperiencePeriod(dates: DateRange): string {
  const { startMonth, startYear, endMonth, endYear } = dates;
  const startLabel = `${MONTH_NAMES[startMonth - 1]} ${startYear}`;

  const isPresent = endMonth == null || endYear == null;
  const endLabel = isPresent
    ? "PRESENT"
    : `${MONTH_NAMES[endMonth - 1]} ${endYear}`;

  const now = new Date();
  const effectiveEndMonth = isPresent ? now.getMonth() + 1 : endMonth;
  const effectiveEndYear = isPresent ? now.getFullYear() : endYear;

  const duration = formatDuration(
    getDurationMonths(
      startMonth,
      startYear,
      effectiveEndMonth,
      effectiveEndYear
    )
  );

  return `${startLabel} - ${endLabel} (${duration})`;
}
