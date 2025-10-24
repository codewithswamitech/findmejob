"use client";

import { useState } from "react";
import type { JobListing } from "@/lib/adzuna/transform";

type SearchResults = {
  jobs: JobListing[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};

export default function JobsPage() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [isRemote, setIsRemote] = useState(false);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        query,
        location,
        remote: isRemote.toString(),
        page: "1",
        limit: "10",
      });

      const response = await fetch(`/api/jobs/search?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Failed to search jobs");
      }

      if (data.success) {
        setResults(data.data);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
        Job Search
      </h1>

      <div className="mb-8 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="query"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Job Title or Keywords
              </label>
              <input
                id="query"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Software Engineer"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Location
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Francisco"
                disabled={isRemote}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:disabled:bg-gray-800"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="remote"
              type="checkbox"
              checked={isRemote}
              onChange={(e) => setIsRemote(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="remote"
              className="ml-2 text-sm text-gray-700 dark:text-gray-300"
            >
              Remote jobs only
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 md:w-auto"
          >
            {loading ? "Searching..." : "Search Jobs"}
          </button>
        </form>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {results && (
        <div>
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Found {results.total} jobs (showing {results.jobs.length} on page{" "}
            {results.page} of {results.totalPages})
          </div>

          <div className="space-y-4">
            {results.jobs.map((job) => (
              <div
                key={job.id}
                className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800"
              >
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {job.company}
                    </p>
                  </div>
                  {job.isRemote && (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      Remote
                    </span>
                  )}
                </div>

                <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  📍 {job.location}
                </div>

                <div
                  className="mb-4 text-sm text-gray-700 dark:text-gray-300"
                  dangerouslySetInnerHTML={{ __html: job.descriptionHtml }}
                />

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    Posted: {new Date(job.postedAt).toLocaleDateString()}
                  </span>
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            ))}
          </div>

          {results.jobs.length === 0 && (
            <div className="rounded-lg bg-white p-8 text-center shadow-sm dark:bg-gray-800">
              <p className="text-gray-600 dark:text-gray-400">
                No jobs found. Try adjusting your search criteria.
              </p>
            </div>
          )}
        </div>
      )}

      {!results && !loading && (
        <div className="rounded-lg bg-white p-8 text-center shadow-sm dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-400">
            Enter your search criteria to find jobs
          </p>
        </div>
      )}
    </div>
  );
}
