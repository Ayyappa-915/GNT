import { ColumnDef } from "@tanstack/react-table";
import { User } from "../interfaces/users.interface";
export const userColumns: ColumnDef<User>[] = [
  {
    header: "ID",
    accessorKey: "id",
    size: 10,   // 10%
  },
  {
    header: "Name",
    accessorKey: "name",
    size: 25,   // 25%
  },
  {
    header: "Email",
    accessorKey: "email",
    size: 30,   // 30%
  },
  {
    header: "Phone",
    accessorKey: "phone",
    size: 25,   // 25%
  },
];