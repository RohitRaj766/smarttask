"use client";

import React, { useState } from "react";
import { Skeleton } from "./skeleton";
import { EmptyState } from "./empty-state";
import { Input } from "./input";
import { Select } from "./select";
import { Button } from "./button";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RotateCw,
  Loader2,
} from "lucide-react";

export interface ColumnDef<T> {
  key: string;
  label: string;
  visible?: boolean;
  headerClassName?: string;
  cellClassName?: string;
  render?: (row: T, index: number) => React.ReactNode;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterDef {
  key: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
}

export interface CustomizableTableProps<T> {
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
  columns: ColumnDef<T>[];
  data: T[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  search?: string;
  onSearchChange?: (search: string) => void;
  searchPlaceholder?: string;
  filters?: FilterDef[];
  isLoading?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  rowKey: (row: T, index: number) => string | number;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionText?: string;
  onEmptyAction?: () => void;
}

export function CustomizableTable<T>({
  title,
  subtitle,
  headerActions,
  columns: initialColumns,
  data,
  total,
  page,
  limit,
  onPageChange,
  onLimitChange,
  search,
  onSearchChange,
  searchPlaceholder = "Search records...",
  filters = [],
  isLoading = false,
  isRefreshing = false,
  onRefresh,
  rowKey,
  emptyTitle = "No data found",
  emptyDescription = "Try adjusting your filters or search terms.",
  emptyActionText,
  onEmptyAction,
}: CustomizableTableProps<T>) {
  const [showColumnToggle, setShowColumnToggle] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(() =>
    initialColumns.reduce((acc, col) => {
      acc[col.key] = col.visible !== false;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const toggleColumn = (key: string) => {
    setColumnVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const visibleColumns = initialColumns.filter(
    (col) => columnVisibility[col.key] !== false
  );

  const totalPages = Math.ceil(total / limit) || 1;
  const startRange = total === 0 ? 0 : (page - 1) * limit + 1;
  const endRange = Math.min(page * limit, total);

  // Smart Truncated Pagination Window Calculation
  const getPaginationWindow = (current: number, maxPages: number) => {
    if (maxPages <= 7) {
      return Array.from({ length: maxPages }, (_, i) => i + 1);
    }
    const pages: (number | string)[] = [];
    pages.push(1);
    if (current > 3) pages.push("...");

    const start = Math.max(2, current - 1);
    const end = Math.min(maxPages - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (current < maxPages - 2) pages.push("...");
    pages.push(maxPages);

    return pages;
  };

  const paginationWindow = getPaginationWindow(page, totalPages);

  return (
    <div className="space-y-6">
      {/* 1. Header with Title & Action Controls */}
      {(title || headerActions || onRefresh) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {title && <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>}
            {subtitle && <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Refresh Table Button */}
            {onRefresh && (
              <Button
                variant="outline"
                size="md"
                onClick={onRefresh}
                disabled={isLoading || isRefreshing}
                title="Refresh Table Data"
                className="gap-2"
              >
                <RotateCw
                  className={`h-4 w-4 transition-transform ${
                    isRefreshing || isLoading ? "animate-spin text-primary" : ""
                  }`}
                />
                <span>Refresh</span>
              </Button>
            )}

            {/* Column Toggle Button */}
            <div className="relative">
              <Button
                variant="outline"
                size="md"
                onClick={() => setShowColumnToggle(!showColumnToggle)}
                className="gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" /> Columns
              </Button>

              {showColumnToggle && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card p-3 shadow-xl z-30 space-y-2 animate-in fade-in duration-150">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground pb-1 border-b border-border">
                    Toggle Columns
                  </p>
                  <div className="space-y-1 text-xs max-h-64 overflow-y-auto">
                    {initialColumns.map((col) => (
                      <label
                        key={col.key}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={columnVisibility[col.key] !== false}
                          onChange={() => toggleColumn(col.key)}
                          className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                        />
                        <span>{col.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {headerActions}
          </div>
        </div>
      )}

      {/* 2. Top Filter Bar (Search + Dropdown Filters + Rows Per Page) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 p-4 rounded-xl border border-border bg-card shadow-sm">
        {onSearchChange && (
          <div className="lg:col-span-2">
            <Input
              leftElement={<Search className="h-4 w-4 text-muted-foreground" />}
              placeholder={searchPlaceholder}
              value={search || ""}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        )}

        {filters.map((filter) => (
          <Select
            key={filter.key}
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            options={filter.options}
          />
        ))}

        {/* Rows Per Page Selector */}
        <Select
          value={String(limit)}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          options={[
            { label: "10 per page", value: "10" },
            { label: "20 per page", value: "20" },
            { label: "50 per page", value: "50" },
            { label: "100 per page", value: "100" },
          ]}
        />
      </div>

      {/* 3. Table Content & Animated Loader */}
      {isLoading ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center shadow-sm space-y-4">
          <div className="flex flex-col items-center justify-center space-y-3 py-6">
            <Loader2 className="h-9 w-9 text-primary animate-spin" />
            <p className="text-sm font-semibold text-muted-foreground">
              Fetching latest table records...
            </p>
          </div>
          <div className="space-y-2.5 opacity-40">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        </div>
      ) : data.length === 0 ? (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          actionText={emptyActionText}
          onAction={onEmptyAction}
        />
      ) : (
        <div className="relative overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
          {isRefreshing && (
            <div className="absolute inset-0 bg-card/60 backdrop-blur-[1px] z-20 flex items-center justify-center gap-2 text-sm font-semibold text-primary">
              <Loader2 className="h-5 w-5 animate-spin" /> Refreshing...
            </div>
          )}
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-muted/50 border-b border-border text-xs uppercase font-semibold text-muted-foreground tracking-wider">
              <tr>
                {visibleColumns.map((col) => (
                  <th
                    key={col.key}
                    className={`py-3.5 px-4 ${col.headerClassName || ""}`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((row, index) => (
                <tr
                  key={rowKey(row, index)}
                  className="hover:bg-accent/40 transition-colors"
                >
                  {visibleColumns.map((col) => (
                    <td
                      key={col.key}
                      className={`py-4 px-4 ${col.cellClassName || ""}`}
                    >
                      {col.render
                        ? col.render(row, index)
                        : (row as any)[col.key] ?? "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. Bottom Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{startRange}</span> to{" "}
          <span className="font-semibold text-foreground">{endRange}</span> of{" "}
          <span className="font-semibold text-foreground">{total}</span> items
        </p>

        <div className="flex flex-wrap items-center gap-1.5">
          {totalPages > 1 && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-2">
              <span>Go to Page:</span>
              <select
                value={page}
                onChange={(e) => onPageChange(Number(e.target.value))}
                className="h-8 rounded-lg border border-input bg-background px-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <option key={p} value={p}>
                    Page {p}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(1)}
            className="h-8 w-8 p-0"
            title="First Page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="h-8 w-8 p-0"
            title="Previous Page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {paginationWindow.map((item, idx) => {
            if (typeof item === "string") {
              return (
                <span key={`ellipsis-${idx}`} className="px-1 text-xs text-muted-foreground">
                  ...
                </span>
              );
            }
            return (
              <Button
                key={item}
                variant={item === page ? "primary" : "outline"}
                size="sm"
                onClick={() => onPageChange(item)}
                className="h-8 w-8 p-0 text-xs font-semibold"
              >
                {item}
              </Button>
            );
          })}

          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="h-8 w-8 p-0"
            title="Next Page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange(totalPages)}
            className="h-8 w-8 p-0"
            title="Last Page"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
