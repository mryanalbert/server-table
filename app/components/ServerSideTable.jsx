// src/app/components/ServerSideTable.jsx
"use client";
import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchData = async ({ pageIndex, pageSize, sortBy }) => {
  const response = await axios.get("/api/data", {
    params: {
      page: pageIndex + 1,
      limit: pageSize,
      sort: sortBy
        .map(({ id, desc }) => `${id}:${desc ? "desc" : "asc"}`)
        .join(","),
    },
  });
  return response.data;
};

const ServerSideTable = ({ columns }) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState([]);

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["data", { pageIndex, pageSize, sortBy }],
    queryFn: () => fetchData({ pageIndex, pageSize, sortBy }),
    keepPreviousData: true,
  });

  const table = useReactTable({
    data: data?.items || [],
    columns,
    pageCount: data?.totalPages || 0,
    state: {
      pagination: { pageIndex, pageSize },
      sorting: sortBy,
    },
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: (updater) => {
      // setPageIndex(updater.pageIndex);
      // setPageSize(updater.pageSize);
      const { pageIndex, pageSize } = updater;
      console.log(pageIndex, pageSize);
      setPageIndex(pageIndex !== undefined ? pageIndex : 0);
      setPageSize(pageSize !== undefined ? pageSize : 10);
    },
    onSortingChange: setSortBy,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted()] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button
          onClick={() => setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          onClick={() => setPageIndex((prev) => prev - 1)}
          disabled={!table.getCanPreviousPage()}
          className="ms-2"
        >
          {"<"}
        </button>
        <button
          onClick={() => setPageIndex((prev) => prev + 1)}
          disabled={!table.getCanNextPage()}
          className="me-2"
        >
          {">"}
        </button>
        <button
          onClick={() => setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {table.getPageCount()}
          </strong>
        </span>
        <span>
          | Go to page:
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              setPageIndex(page);
            }}
            style={{ width: "100px" }}
          />
        </span>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
        {isFetching && <span> Loading...</span>}
      </div>
    </>
  );
};

export default ServerSideTable;
