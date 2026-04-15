"use client";

import { Row } from "@/app/components/layout/layout-components";
import React from "react";
import { Backdrop } from "../backdrop/backdrop";
import "./data-table.scss";

type DataTableColumn<T> = {
  header: string;
  cell: (row: T) => React.ReactNode;
};

export function DataTable<T>({
  rows,
  columns,
  onRowClick,
  title,
  cta,
  getRowKey,
  getRowAriaLabel,
}: {
  rows: T[];
  columns: DataTableColumn<T>[];
  onRowClick: (row: T) => void;
  title: string;
  cta?: React.ReactNode;
  getRowKey: (row: T) => string;
  getRowAriaLabel: (row: T) => string;
}) {
  const handleRowKeyDown = (e: React.KeyboardEvent, row: T) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onRowClick(row);
    }
  };

  return (
    <div className="data-table-container">
      <Row className="data-table-title-row">
        <h1>{title}</h1>
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
            {rows.map((row) => (
              <tr
                key={getRowKey(row)}
                className="data-table-row"
                onClick={() => onRowClick(row)}
                onKeyDown={(e) => handleRowKeyDown(e, row)}
                aria-label={getRowAriaLabel(row)}
              >
                {columns.map((col, i) => (
                  <td key={i}>{col.cell(row)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Backdrop>
    </div>
  );
}
