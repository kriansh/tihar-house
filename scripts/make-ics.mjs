import fs from "node:fs";

const events = [
  ["kag", "20261107", "Kag Tihar", "Crows are fed at dawn. Day 1 of Tihar 2083."],
  [
    "kukur",
    "20261108",
    "Kukur Tihar + Laxmi Puja",
    "Dogs are honoured; lamps are lit for Laxmi at dusk. Day 2 of Tihar 2083."
  ],
  ["gai", "20261109", "Gai Tihar", "Cows are honoured. Day 3 of Tihar 2083."],
  [
    "mha",
    "20261110",
    "Govardhan Puja + Mha Puja",
    "Oxen and Govardhan are honoured; Newar New Year (Nepal Sambat 1147). Day 4 of Tihar 2083."
  ],
  [
    "bhai",
    "20261111",
    "Bhai Tika",
    "Sisters and brothers exchange tika, garlands and blessings. Day 5 of Tihar 2083."
  ]
];

const stamp = `${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
const lines = [
  "BEGIN:VCALENDAR",
  "VERSION:2.0",
  "PRODID:-//Tihar House//Tihar 2083//EN",
  "CALSCALE:GREGORIAN",
  "METHOD:PUBLISH",
  "X-WR-CALNAME:Tihar 2083 (2026)",
  "X-WR-CALDESC:Five days of Tihar, 7-11 November 2026. Dates per Hamro Patro 2083 and Nepali Calendar 2083."
];

for (const [id, date, summary, description] of events) {
  const end = new Date(
    `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}T00:00:00Z`
  );
  end.setUTCDate(end.getUTCDate() + 1);
  const endDate = end.toISOString().slice(0, 10).replace(/-/g, "");
  lines.push(
    "BEGIN:VEVENT",
    `UID:${id}-tihar-2083@tihar.house`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${date}`,
    `DTEND;VALUE=DATE:${endDate}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    "TRANSP:TRANSPARENT",
    "END:VEVENT"
  );
}

lines.push("END:VCALENDAR");
fs.writeFileSync("public/tihar-2083.ics", `${lines.join("\r\n")}\r\n`);
console.log(`wrote public/tihar-2083.ics (${lines.length} lines)`);
