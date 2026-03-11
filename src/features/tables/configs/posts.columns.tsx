import { ColumnDef } from "@tanstack/react-table";
import { Post } from "../interfaces/posts.interface";

export const postColumns: ColumnDef<Post>[] = [
  {
    header: "ID",
    accessorKey: "id",
    size: 10,
  },
  {
    header: "Title",
    accessorKey: "title",
    size: 40,
  },
  {
    header: "Body",
    accessorKey: "body",
    size: 40,
  }
];
