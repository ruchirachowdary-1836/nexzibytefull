export const DEFAULT_PROFILE = {
  name: "",
  handle: "",
  email: "",
  timezone: "",
  title: "",
  bio: "",
  location: "",
  role: "",
  company: "",
  avatar: "",
  socials: {
    github: "",
    linkedin: "",
    twitter: "",
    portfolio: "",
    devto: "",
    leetcode: "",
    instagram: ""
  }
};
export const PROFILE_METRICS = [];
export const SKILL_CATEGORIES = [];
export const PUBLISHED_POSTS = [];
export const DRAFT_POSTS_INITIAL = [];
export const ACTIVITY_FEED = [];
export const CAREER_TIMELINE = [];
export const SPEAKING_ENGAGEMENTS = [];
export function generateContributionGrid(contributionDays = []) {
  const counts = new Map(contributionDays.map((day) => [day.date, day.count]));
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - 364 - today.getDay());
  const weeks = [];
  const monthLabels = [];
  for (let weekIndex = 0; weekIndex < 53; weekIndex += 1) {
    const week = [];
    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const current = new Date(start);
      current.setDate(start.getDate() + weekIndex * 7 + dayIndex);
      const date = current.toISOString().slice(0, 10);
      const count = counts.get(date) || 0;
      week.push({
        count,
        level: count === 0 ? 0 : count < 2 ? 1 : count < 4 ? 2 : count < 7 ? 3 : 4,
        formattedDate: current.toLocaleDateString(),
      });
      if (dayIndex === 0 && current.getDate() <= 7) {
        monthLabels.push({ month: current.toLocaleDateString(undefined, { month: "short" }), weekIndex });
      }
    }
    weeks.push(week);
  }
  return { monthLabels, weeks };
}
