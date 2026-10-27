const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Räknar hela dagar från idag till bäst före-datumet. Negativt värde betyder att varan gått ut.
export function getDaysLeft(isoDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(isoDate);
  expiry.setHours(0, 0, 0, 0);

  return Math.round((expiry - today) / MS_PER_DAY);
}

// Avgör hur bråttom det är att förbruka varan och vilken text som ska visas
export function getExpiryStatus(isoDate) {
  const daysLeft = getDaysLeft(isoDate);

  if (daysLeft < 0) {
    return { level: "expired", label: "Utgången" };
  }
  if (daysLeft === 0) {
    return { level: "today", label: "Idag" };
  }
  if (daysLeft <= 3) {
    return {
      level: "soon",
      label: `${daysLeft} ${daysLeft === 1 ? "dag" : "dagar"}`,
    };
  }
  return { level: "fresh", label: `${daysLeft} dagar` };
}

export function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("sv-SE");
}
