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
export function generateContributionGrid() {
  return {
    monthLabels: [],
    weeks: []
  };
}
