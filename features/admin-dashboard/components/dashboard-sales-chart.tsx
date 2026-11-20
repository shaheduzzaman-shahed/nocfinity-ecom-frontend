"use client";

import { useState } from "react";
import { BarChart3, DollarSign, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "cn";
import type { SalesChartData } from "../types/dashboard.types";

interface DashboardSalesChartProps {
  data: SalesChartData | undefined;
  isLoading: boolean;
}

export function DashboardSalesChart({
  data,
  isLoading,
}: DashboardSalesChartProps) {
  const [activeMetric, setActiveMetric] = useState<"revenue" | "orders">(
    "revenue"
  );
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(
    null
  );

  if (isLoading) {
    return (
      <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
        <div className="h-6 w-40 animate-pulse rounded bg-muted" />
        <div className="h-56 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  const points = data?.points ?? [];
  const summary = data?.summary ?? {
    total_revenue: 0,
    total_orders: 0,
    average_order_value: 0,
  };
  const currency = data?.store_currency ?? "USD";

  const maxRevenue = Math.max(...points.map((p) => p.revenue), 10);
  const maxOrders = Math.max(...points.map((p) => p.orders_count), 1);
  const currentMax = activeMetric === "revenue" ? maxRevenue : maxOrders;

  const hoveredPoint =
    hoveredPointIndex !== null ? points[hoveredPointIndex] : null;

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-5">
      {/* Chart Header & Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="size-4 text-primary" />
            <h3 className="font-heading text-base font-bold text-foreground">
              30-Day Sales Performance
            </h3>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Trailing daily revenue and order volume for paid orders.
          </p>
        </div>

        {/* Metric Switch */}
        <div className="flex items-center rounded-lg border bg-muted/40 p-0.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveMetric("revenue")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors",
              activeMetric === "revenue"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <DollarSign className="size-3" />
            Revenue
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric("orders")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors",
              activeMetric === "orders"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Package className="size-3" />
            Orders
          </button>
        </div>
      </div>

      {/* Summary Metrics Bar */}
      <div className="grid grid-cols-3 gap-3 rounded-xl border bg-muted/20 p-3 text-xs">
        <div>
          <span className="text-muted-foreground">30-Day Revenue</span>
          <p className="font-heading text-sm font-bold text-foreground mt-0.5">
            ${summary.total_revenue.toFixed(2)}
          </p>
        </div>
        <div>
          <span className="text-muted-foreground">Total Orders</span>
          <p className="font-heading text-sm font-bold text-foreground mt-0.5">
            {summary.total_orders}
          </p>
        </div>
        <div>
          <span className="text-muted-foreground">Avg Order Value</span>
          <p className="font-heading text-sm font-bold text-foreground mt-0.5">
            ${summary.average_order_value.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Interactive Daily Bar Visualizer */}
      <div className="space-y-2">
        {/* Hover info tooltip line */}
        <div className="h-6 flex items-center justify-between text-xs">
          {hoveredPoint ? (
            <>
              <span className="font-medium text-foreground">
                {hoveredPoint.label} ({hoveredPoint.date})
              </span>
              <span className="font-bold text-primary">
                ${hoveredPoint.revenue.toFixed(2)} • {hoveredPoint.orders_count}{" "}
                {hoveredPoint.orders_count === 1 ? "order" : "orders"}
              </span>
            </>
          ) : (
            <span className="text-[11px] text-muted-foreground">
              Hover over bars to inspect daily metrics
            </span>
          )}
        </div>

        {/* Bars Container */}
        <div className="relative flex h-48 items-end gap-1 border-b pb-1 pt-4">
          {points.map((point, index) => {
            const val =
              activeMetric === "revenue" ? point.revenue : point.orders_count;
            const heightPercent = currentMax > 0 ? (val / currentMax) * 100 : 0;
            const isHovered = hoveredPointIndex === index;

            return (
              <div
                key={point.date}
                className="group relative flex-1 flex flex-col justify-end h-full items-center cursor-pointer"
                onMouseEnter={() => setHoveredPointIndex(index)}
                onMouseLeave={() => setHoveredPointIndex(null)}
              >
                {/* Visual Bar */}
                <div
                  style={{ height: `${Math.max(heightPercent, 2)}%` }}
                  className={cn(
                    "w-full rounded-t-sm transition-all duration-150",
                    isHovered
                      ? "bg-primary"
                      : val > 0
                      ? "bg-primary/70 hover:bg-primary"
                      : "bg-muted-foreground/15"
                  )}
                />
              </div>
            );
          })}
        </div>

        {/* Date Labels (Start, Mid, End) */}
        {points.length > 0 && (
          <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
            <span>{points[0]?.label}</span>
            <span>{points[Math.floor(points.length / 2)]?.label}</span>
            <span>{points[points.length - 1]?.label} (Today)</span>
          </div>
        )}
      </div>
    </div>
  );
}
