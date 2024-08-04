"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export const columns = [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "First name",
    accessorKey: "first_name",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("first_name")}</div>
    ),
  },
  {
    accessorKey: "last_name",
    header: "Last name",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("last_name")}</div>
    ),
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Birthdate",
    accessorKey: "dob",
  },
];
