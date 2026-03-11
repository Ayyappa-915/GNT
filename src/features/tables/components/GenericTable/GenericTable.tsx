/* ============================================================
   GENERIC TABLE COMPONENT
   - Sorting Support
   - Smart Pagination
   - Optional Action Column
   - Overflow Tooltip
   - Auto Page Switch When Next Page Cached
============================================================ */

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
  ColumnDef,
} from "@tanstack/react-table";

import { useState, useMemo, useRef, useEffect } from "react";
import { FaSort, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { GenericTableProps } from "./GenericTable.types";
import "./GenericTable.css";

/* ============================================================
   OVERFLOW TOOLTIP
============================================================ */

function OverflowTooltip({ value }: { value: string }) {
  const textRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    const checkOverflow = () => {
      setIsOverflowing(element.scrollWidth > element.clientWidth);
    };

    checkOverflow();

    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [value]);

  return (
    <div
      ref={textRef}
      className="truncated-cell"
      title={isOverflowing ? value : ""}
    >
      {value}
    </div>
  );
}

/* ============================================================
   GENERIC TABLE
============================================================ */

function GenericTable<T>({
  data,
  columns,
  currentPage,
  totalPages,
  cachedPages,
  onNext,
  onPrevious,
  onPageChange,
  actions,
}: GenericTableProps<T>) {

  const [sorting, setSorting] = useState<SortingState>([]);

  const tableBodyRef = useRef<HTMLDivElement>(null);

  /* ============================================================
     RESET SCROLL WHEN PAGE CHANGES
  ============================================================ */

  useEffect(() => {
    if (tableBodyRef.current) {
      tableBodyRef.current.scrollTop = 0;
    }
  }, [currentPage]);

  /* ============================================================
     AUTO MOVE TO NEXT PAGE WHEN SCROLL BOTTOM
     (ONLY IF NEXT PAGE ALREADY CACHED)
  ============================================================ */

  useEffect(() => {

    const element = tableBodyRef.current;

    if (!element) return;

    const handleScroll = () => {

      const reachedBottom =
        element.scrollTop + element.clientHeight >= element.scrollHeight - 5;

      const nextPageExists = cachedPages[currentPage + 1];

      if (reachedBottom && nextPageExists) {
        onNext();
      }

    };

    element.addEventListener("scroll", handleScroll);

    return () => element.removeEventListener("scroll", handleScroll);

  }, [currentPage, cachedPages]);

  /* ============================================================
     ACTION COLUMN
  ============================================================ */

  const enhancedColumns = useMemo<ColumnDef<T, any>[]>(() => {
    if (!actions) return columns;

    return [
      ...columns,
      {
        id: "actions",
        header: "Action",
        size: 10,
        enableSorting: false,
        cell: ({ row }) => {
          const rowData = row.original as T;

          return (
            <div className="actions">

              {actions?.onView && (
                <button
                  className="action-btn"
                  onClick={() => actions.onView?.(rowData)}
                >
                  <FaEye />
                </button>
              )}

              {actions?.onEdit && (
                <button
                  className="action-btn"
                  onClick={() => actions.onEdit?.(rowData)}
                >
                  <FaEdit />
                </button>
              )}

              {actions?.onDelete && (
                <button
                  className="action-btn"
                  onClick={() => actions.onDelete?.(rowData)}
                >
                  <FaTrash />
                </button>
              )}

            </div>
          );
        },
      },
    ];
  }, [columns, actions]);

  /* ============================================================
     TABLE INSTANCE
  ============================================================ */

  const table = useReactTable({
    data,
    columns: enhancedColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  /* ============================================================
     SMART PAGINATION RANGE
  ============================================================ */

  const getPaginationRange = (): Array<number | "..."> => {

    const SIBLING_PAGE_COUNT = 1;

    const paginationRange: Array<number | "..."> = [];

    const firstPageIndex = 0;
    const lastPageIndex = totalPages - 1;

    const leftSiblingIndex = Math.max(
      firstPageIndex,
      currentPage - SIBLING_PAGE_COUNT
    );

    const rightSiblingIndex = Math.min(
      lastPageIndex,
      currentPage + SIBLING_PAGE_COUNT
    );

    if (leftSiblingIndex > firstPageIndex) {
      paginationRange.push(firstPageIndex);

      if (leftSiblingIndex > firstPageIndex + 1) {
        paginationRange.push("...");
      }
    }

    for (
      let pageIndex = leftSiblingIndex;
      pageIndex <= rightSiblingIndex;
      pageIndex++
    ) {
      paginationRange.push(pageIndex);
    }

    if (rightSiblingIndex < lastPageIndex) {

      if (rightSiblingIndex < lastPageIndex - 1) {
        paginationRange.push("...");
      }

      paginationRange.push(lastPageIndex);
    }

    return paginationRange;
  };

  /* ============================================================
     SORT ICON
  ============================================================ */

  const renderSortIcon = (column: any) => {
    if (!column.getCanSort()) return null;
    return <FaSort size={12} opacity={0.6} />;
  };


  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div className="table-wrapper">
      <div className="table-card">

        {/* ================= HEADER ================= */}

        <div className="table-header">
          {table.getHeaderGroups().map((headerGroup) =>
            headerGroup.headers.map((header) => (
              <div
                key={header.id}
                className="table-cell header-cell"
                style={{
                  width: header.column.columnDef.size
                    ? `${header.column.columnDef.size}%`
                    : undefined,
                }}
              >
                <div className="header-content">

                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}

                  {header.column.getCanSort() && (
                    <span
                      className="sort-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        header.column.toggleSorting();
                      }}
                    >
                      {renderSortIcon(header.column)}
                    </span>
                  )}

                </div>
              </div>
            ))
          )}
        </div>

        {/* ================= BODY ================= */}

        <div className="table-body" ref={tableBodyRef}>
          {table.getRowModel().rows.map((row) => (
            <div key={row.id} className="table-row">

              {row.getVisibleCells().map((cell) => {

                const rawValue = cell.getValue();
                const renderedValue = flexRender(
                  cell.column.columnDef.cell ??
                    ((info) => info.getValue()),
                  cell.getContext()
                );

                const isString = typeof rawValue === "string";

                return (
                  <div
                    key={cell.id}
                    className="table-cell"
                    style={{
                      width: cell.column.columnDef.size
                        ? `${cell.column.columnDef.size}%`
                        : undefined,
                    }}
                  >
                    {isString ? (
                      <OverflowTooltip value={rawValue} />
                    ) : (
                      renderedValue
                    )}
                  </div>
                );

              })}

            </div>
          ))}
        </div>

        {/* ================= PAGINATION ================= */}

        <div className="pagination">

          <button
            onClick={onPrevious}
            disabled={currentPage === 0}
          >
            Previous
          </button>

          <div className="page-numbers">
            {getPaginationRange().map((item, index) => {

              if (item === "...") {
                return (
                  <span key={`ellipsis-${index}`} className="ellipsis">
                    ...
                  </span>
                );
              }

              const pageIndex = item;

              return (
                <button
                    key={pageIndex}
                    onClick={() => onPageChange(pageIndex)}
                    className={`page-number ${
                      currentPage === pageIndex ? "active" : ""
                    }`}
                  >
                    {pageIndex + 1}
                  </button>
              );
            })}
          </div>

          <button
            onClick={onNext}
            disabled={currentPage >= totalPages - 1}
          >
            Next
          </button>

        </div>

      </div>
    </div>
  );
}

export default GenericTable;
