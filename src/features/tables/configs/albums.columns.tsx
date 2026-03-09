import { ColumnDef } from "@tanstack/react-table";
import { Album } from "../interfaces/album.interface";

export const albumColumns: ColumnDef<Album>[] = [
  {
    header: "ID",
    accessorKey: "id",
    size: 10,
  },
  {
    header: "Title",
    accessorKey: "title",
    size: 20,
  },
  {
    header: "Artist",
    accessorKey: "artist",
    size: 10,
  },
  {
    header: "Year",
    accessorKey: "year",
    size: 10,
  },
  {
    header: "Genre",
    accessorKey: "genre",
    size: 10,
  },
  {
    header: "Price ($)",
    accessorKey: "price",
    size: 10,
  },
  {
    header: "Rating",
    accessorKey: "rating",
    size: 10,
  },
  {
    header: "Published",
    accessorKey: "isPublished",
    size: 10,
  }
];