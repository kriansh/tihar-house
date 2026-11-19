export type DayId = "kag" | "kukur" | "gai" | "mha" | "bhai";

export type FestivalDay = {
  id: DayId;
  /** Local calendar date, ISO-like. */
  date: string;
  /** Index in the five-day sequence. */
  index: number;
};

/**
 * Tihar 2083 BS / 2026, following Hamro Patro 2083 and Nepali Calendar 2083.
 * Kukur Tihar and Laxmi Puja share 8 November 2026.
 */
export const FESTIVAL_DAYS: FestivalDay[] = [
  { id: "kag", date: "2026-11-07", index: 0 },
  { id: "kukur", date: "2026-11-08", index: 1 },
  { id: "gai", date: "2026-11-09", index: 2 },
  { id: "mha", date: "2026-11-10", index: 3 },
  { id: "bhai", date: "2026-11-11", index: 4 }
];

function localDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** The day being celebrated today, if the visitor is inside the five-day window. */
export function todayDayId(): DayId | null {
  const key = localDateKey(new Date());
  return FESTIVAL_DAYS.find((day) => day.date === key)?.id ?? null;
}

export function isToday(id: DayId): boolean {
  return todayDayId() === id;
}

export function festivalIndex(id: DayId): number {
  return FESTIVAL_DAYS.find((day) => day.id === id)?.index ?? -1;
}
