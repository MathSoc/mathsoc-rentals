"use client";

import { Column, Row } from "@/app/components/layout/layout-components";
import React, { useState } from "react";
import { Backdrop } from "../backdrop/backdrop";
import "./table.scss";

type TableColumn<T> = {
  header: string;
  cell: (row: T) => React.ReactNode;
};

export function Table<T>({
  rows,
  columns,
  onRowClick,
  title,
  cta,
  getRowKey,
  getRowAriaLabel,
  getExpandedRowContents,
  page,
  setPageIndex,
  searchQuery,
  onSearchChange,
}: {
  rows: T[];
  columns: TableColumn<T>[];
  onRowClick?: (row: T) => void;
  title: string;
  cta?: React.ReactNode;
  getRowKey: (row: T) => string;
  getRowAriaLabel: (row: T) => string;
  getExpandedRowContents?: (row: T) => React.ReactNode;
  page: {
    page_index: number;
    page_size: number;
    total_count: number;
  };
  setPageIndex: (index: number) => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}) {
  const [expandedRow, setExpandedRow] = useState<T | null>(null);

  const handleRowClick = (row: T) => {
    if (getExpandedRowContents) {
      if (row === expandedRow) {
        setExpandedRow(null);
      } else {
        setExpandedRow(row);
      }
    }

    onRowClick?.(row);
  };

  const handleRowKeyDown = (e: React.KeyboardEvent, row: T) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleRowClick(row);
    }
  };

  return (
    <Column className="data-table-container">
      <Row className="data-table-title-row">
        <Column className="data-table-title-left">
          <h1>{title}</h1>
          {onSearchChange !== undefined && (
            <input
              className="data-table-search"
              type="search"
              placeholder="Search…"
              value={searchQuery ?? ""}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label={`Search ${title}`}
            />
          )}
        </Column>
        {cta}
      </Row>
      <Backdrop>
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th key={i}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <>
                <tr
                  key={getRowKey(row)}
                  className={`data-table-row ${rowIndex % 2 === 0 ? "even" : "odd"}`}
                  onClick={() => handleRowClick(row)}
                  onKeyDown={(e) => handleRowKeyDown(e, row)}
                  aria-label={getRowAriaLabel(row)}
                >
                  {columns.map((col, i) => (
                    <td key={i}>{col.cell(row)}</td>
                  ))}
                </tr>
                {row === expandedRow ? (
                  <tr
                    key={`row-expansion-${getRowKey(row)}`}
                    className={`row-expansion ${rowIndex % 2 === 0 ? "even" : "odd"}`}
                  >
                    <td colSpan={columns.length}>
                      {getExpandedRowContents?.(row)}
                    </td>
                  </tr>
                ) : null}
              </>
            ))}
          </tbody>
        </table>
      </Backdrop>
      <Pagination page={page} setPageIndex={setPageIndex} />
    </Column>
  );
}

function Pagination({
  page,
  setPageIndex,
}: {
  page: {
    total_count: number;
    page_size: number;
    page_index: number;
  };
  setPageIndex: (index: number) => void;
}) {
  const { total_count, page_size, page_index } = page;

  const pageCount = Math.ceil(total_count / page_size);
  const lastResult = page_size * (page_index + 1);

  return (
    <Row className="data-table-pagination">
      <button
        className="pagination-btn"
        disabled={page_index <= 0}
        onClick={() => setPageIndex(page_index - 1)}
        aria-label="Previous page"
      >
        ‹
      </button>
      <span className="pagination-label">
        Results {page_size * page_index + 1} –{" "}
        {Math.min(lastResult, total_count)} of {total_count}
      </span>
      <button
        className="pagination-btn"
        disabled={page_index >= pageCount - 1}
        onClick={() => setPageIndex(page_index + 1)}
        aria-label="Next page"
      >
        ›
      </button>
    </Row>
  );
}
