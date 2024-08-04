// app/api/data/route.js
import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import db from "@/app/db/db";

async function getDataFromDatabase(page, limit, sortOptions) {
  const offset = page * limit;

  // Construct the ORDER BY clause
  // const orderByClause = sortOptions.length
  //   ? `ORDER BY ${sortOptions
  //       .map(({ field, direction }) => `${mysql.escapeId(field)} ${direction}`)
  //       .join(", ")}`
  //   : "";
  let orderByClause = "";
  if (sortOptions.length > 0) {
    orderByClause = `ORDER BY ${sortOptions[0]} ${sortOptions[1]}`;
  }

  // let orderByQuery = orderByClause ? orderByClause : "";

  // Query to get the total count of records
  const countResults = await db({
    query: "SELECT COUNT(*) AS total FROM data",
    values: [],
  }); // replace with your table name
  const total = countResults[0].total;

  // Query to get the paginated data
  const data = await db({
    query: `SELECT * FROM data ${orderByClause} LIMIT ? OFFSET ?`, // replace with your table name
    values: [limit, offset],
  });

  return { data, total };
  // Close the connection
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10) - 1; // 0-based index for pagination
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const sort = searchParams.get("sort");

  // Parse sorting options
  // const sortOptions = sort.split(",").map((option) => {
  //   const [field, direction] = option.split(":");
  //   return { field, direction: direction || "asc" };
  // });
  let sortOptions = [];
  if (sort) {
    sortOptions = sort.split(":");
  }

  // Fetch data from the database
  const { data, total } = await getDataFromDatabase(page, limit, sortOptions);

  const totalPages = Math.ceil(total / limit);

  return NextResponse.json({
    items: data,
    totalPages,
  });
}
