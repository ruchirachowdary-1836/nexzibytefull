import path from "node:path";
import { pathToFileURL } from "node:url";

const dataDirectory = path.resolve("frontend/src/data");
const [coursesData, mockData, founderMeetsData, internshipsData, summitsData] =
  await Promise.all([
    import(pathToFileURL(path.join(dataDirectory, "coursesData.js")).href),
    import(pathToFileURL(path.join(dataDirectory, "mockData.js")).href),
    import(pathToFileURL(path.join(dataDirectory, "founderMeetsData.js")).href),
    import(pathToFileURL(path.join(dataDirectory, "internshipsData.js")).href),
    import(pathToFileURL(path.join(dataDirectory, "summitsData.js")).href),
  ]);

function rows(items, source, key = (item, index) => item.id ?? item.title ?? index) {
  return items.map((payload, index) => ({
    source_key: `${source}:${String(key(payload, index))}`,
    payload,
    sort_order: index,
  }));
}

function mergeById(...sources) {
  const merged = new Map();
  for (const items of sources) {
    for (const item of items) {
      const key = String(item.id);
      merged.set(key, { ...(merged.get(key) || {}), ...item });
    }
  }
  return [...merged.values()];
}

const faqs = [
  ...rows(mockData.FAQ_ITEMS, "mockData.FAQ_ITEMS", (item) => item.q.trim().toLowerCase()),
  ...rows(
    internshipsData.INTERNSHIP_FAQS,
    "internshipsData.INTERNSHIP_FAQS",
    (item) => item.q.trim().toLowerCase(),
  ),
];

const exported = {
  courses: rows(
    mergeById(coursesData.COURSES, mockData.COURSES),
    "courses",
  ),
  speakers: [
    ...rows(mockData.SPEAKERS, "mockData.SPEAKERS"),
    ...rows(founderMeetsData.FEATURED_FOUNDERS, "founderMeetsData.FEATURED_FOUNDERS"),
  ],
  internships: rows(internshipsData.INTERNSHIPS, "internshipsData.INTERNSHIPS"),
  founder_meets: rows(
    mergeById(
      founderMeetsData.FOUNDER_MEETS_LIST,
      mockData.FOUNDER_MEETS_LIST,
      [mockData.DEFAULT_FOUNDER_MEET],
    ),
    "founder_meets",
  ),
  events: rows(
    mergeById(
      summitsData.SUMMIT_LIST,
      mockData.SUMMIT_LIST,
      mockData.DEDICATED_UPCOMING_EVENTS,
      mockData.DEDICATED_PAST_EVENTS,
      mockData.UPCOMING_EVENTS,
      mockData.FEATURED_SUMMITS_LIST,
      [mockData.DEFAULT_SUMMIT, mockData.FEATURED_SUMMIT, mockData.FEATURED_EVENT_DETAILS],
    ),
    "events",
  ),
  articles: rows(mockData.TECHNICAL_ARTICLES, "mockData.TECHNICAL_ARTICLES"),
  testimonials: rows(mockData.TESTIMONIALS, "mockData.TESTIMONIALS"),
  faqs,
};

process.stdout.write(`${JSON.stringify(exported)}\n`);
