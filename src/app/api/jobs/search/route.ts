import { NextRequest } from "next/server";
import { createAdzunaClient } from "@/lib/adzuna/client";
import { normalizeJob } from "@/lib/adzuna/transform";
import { rateLimitMiddleware, getClientIdentifier } from "@/lib/rate-limit";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const identifier = await getClientIdentifier();
    const ipRateLimitResponse = await rateLimitMiddleware(
      identifier,
      "jobs:ip"
    );
    if (ipRateLimitResponse) {
      return ipRateLimitResponse;
    }

    const supabase = await createServerSupabaseClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user?.id) {
      const userRateLimitResponse = await rateLimitMiddleware(
        session.user.id,
        "jobs:user"
      );
      if (userRateLimitResponse) {
        return userRateLimitResponse;
      }
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query") ?? "";
    const location = searchParams.get("location") ?? "";
    const isRemote = searchParams.get("remote") === "true";
    const page = parseInt(searchParams.get("page") ?? "1");
    const resultsPerPage = Math.min(
      parseInt(searchParams.get("limit") ?? "10"),
      50
    );

    const adzunaClient = createAdzunaClient();

    const searchLocation = isRemote ? "remote" : location;

    const response = await adzunaClient.search({
      query,
      location: searchLocation,
      page,
      resultsPerPage,
      sortBy: "date",
    });

    const jobs = response.results.map(normalizeJob);

    return Response.json({
      success: true,
      data: {
        jobs,
        total: response.count,
        page,
        perPage: resultsPerPage,
        totalPages: Math.ceil(response.count / resultsPerPage),
      },
    });
  } catch (error) {
    console.error("Job search error:", error);

    return Response.json(
      {
        success: false,
        error: "Failed to search jobs",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
