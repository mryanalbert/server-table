// src/app/api/data/route.js

import { data } from "@/backend/data";

export async function GET(request) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page")) || 1;
  const limit = parseInt(url.searchParams.get("limit")) || 10;
  const sort = url.searchParams.get("sort") || "";

  const items = [...data];

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedItems = items.slice(startIndex, endIndex);

  return new Response(
    JSON.stringify({
      items: paginatedItems,
      totalPages: Math.ceil(items.length / limit),
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
