import { sanitizeHtml } from "@/lib/sanitize";
import type { AdzunaRawJob } from "@/lib/adzuna/client";

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  isRemote: boolean;
  descriptionHtml: string;
  applyUrl: string;
  postedAt: string;
}

const REMOTE_KEYWORDS = ["remote", "work from home", "distributed"];

export function normalizeJob(job: AdzunaRawJob): JobListing {
  const location = job.location?.display_name ?? "";
  const descriptionHtml = sanitizeHtml(job.description ?? "");
  const postedAt = job.created ?? new Date().toISOString();
  const company = job.company?.display_name ?? "Unknown";

  const isRemote = REMOTE_KEYWORDS.some((keyword) =>
    [location, job.title, job.description]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(keyword)
  );

  return {
    id: job.id,
    title: job.title,
    company,
    location,
    isRemote,
    descriptionHtml,
    applyUrl: job.redirect_url,
    postedAt,
  };
}
