"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [{ name: "Jobs", href: "/app/jobs" }];

export function SidebarClient() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="px-4 py-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Dashboard
        </h2>
      </div>
      <nav className="flex-1 space-y-1 px-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition
                ${
                  isActive
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800"
                }
              `}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
