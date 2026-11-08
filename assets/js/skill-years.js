// Recompute skill durations from data-since="YYYY-MM" so they stay current
// between site builds. Mirrors _includes/skill-duration.html.
// data-format="number" -> "4", "1.5", "<1"; default -> "4 yrs", "8 mos".
function formatSkillDuration(since, now, format) {
  const [y, m] = since.split("-").map(Number);
  let months = now.getFullYear() * 12 + (now.getMonth() + 1) - (y * 12 + m);
  const halves = Math.floor(months / 6);
  const whole = Math.floor(halves / 2);
  const half = halves % 2 === 1;
  if (format === "number") {
    return halves < 1 ? "<1" : `${whole}${half ? ".5" : ""}`;
  }
  if (months < 12) {
    months = Math.max(months, 1);
    return `${months} mo${months === 1 ? "" : "s"}`;
  }
  return `${whole}${half ? ".5" : ""} yr${whole === 1 && !half ? "" : "s"}`;
}

function updateSkillYears(root) {
  const now = new Date();
  (root || document).querySelectorAll("[data-since]").forEach((el) => {
    el.textContent = formatSkillDuration(el.dataset.since, now, el.dataset.format);
  });
}

updateSkillYears(document);
