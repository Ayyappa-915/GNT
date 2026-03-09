import { ColumnDef } from "@tanstack/react-table";
import { Comment } from "../interfaces/comments.interface";

export const commentColumns: ColumnDef<Comment>[] = [
  {
    header: "ID",
    accessorKey: "id",
    size: 10,   // 10%
  },
  {
    header: "Name",
    accessorKey: "name",
    size: 20,   // 20%
  },
  {
    header: "Email",
    accessorKey: "email",
    size: 25,   // 25%
  },
  {
    header: "Comment",
    accessorKey: "body",
    size: 35,   // 35%
  },
];