import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Job Board
            </h1>
            <nav className="flex gap-4">
              <Link
                href="/auth"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Sign In
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
        <div className="w-full max-w-3xl text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            Find Your Next Opportunity
          </h2>
          <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
            Search thousands of jobs from leading companies. Start your journey
            today.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth"
              className="rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700"
            >
              Get Started
            </Link>
            <Link
              href="/app/jobs"
              className="rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
          © 2024 Job Board. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
