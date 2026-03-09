import { ColumnDef } from "@tanstack/react-table";

export interface GenericTableProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];

  currentPage: number;
  totalPages: number;

  onNext: () => void;
  onPrevious: () => void;
  onPageChange: (page: number) => void;

  cachedPages: Record<number, T[]>;   // 🔥 NEW

  actions?: {
    onView?: (row: T) => void;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
  };
}