"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import type { LegendProps } from "recharts";
import { cn } from "./utils";

/* ------------------------------------------------ */
/* Chart Config */
/* ------------------------------------------------ */

const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    icon?: React.ComponentType;
    color?: string;
    theme?: Record<keyof typeof THEMES, string>;
  }
>;

interface ChartContextProps {
  config: ChartConfig;
}

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const ctx = React.useContext(ChartContext);
  if (!ctx) {
    throw new Error("useChart must be used within <ChartContainer />");
  }
  return ctx;
}

/* ------------------------------------------------ */
/* Chart Container */
/* ------------------------------------------------ */

interface ChartContainerProps extends React.ComponentProps<"div"> {
  config: ChartConfig;
  children: React.ReactNode;
}

export function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: ChartContainerProps) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        className={cn("flex aspect-video justify-center text-xs", className)}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer width="100%" height="100%">
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

/* ------------------------------------------------ */
/* Dynamic CSS */
/* ------------------------------------------------ */

function ChartStyle({
  id,
  config,
}: {
  id: string;
  config: ChartConfig;
}) {
  const entries = Object.entries(config).filter(
    ([, v]) => v.color || v.theme
  );

  if (!entries.length) return null;

  const css = Object.entries(THEMES)
    .map(([theme, prefix]) => {
      const vars = entries
        .map(([key, item]) => {
          const color =
            item.theme?.[theme as keyof typeof item.theme] ||
            item.color;
          return color ? `--color-${key}: ${color};` : "";
        })
        .join("\n");

      return `${prefix} [data-chart=${id}] { ${vars} }`;
    })
    .join("\n");

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

/* ------------------------------------------------ */
/* Tooltip (CORRECT WAY FOR RECHARTS v3) */
/* ------------------------------------------------ */

/**
 🔥 IMPORTANT:
 Recharts v3 does NOT type payload/label on TooltipProps.
 They are runtime-only.
 So we define EXACTLY what we use.
 */
interface ChartTooltipContentProps {
  active?: boolean;
  payload?: Array<{
    name?: string;
    dataKey?: string;
    value?: number;
    color?: string;
    payload?: Record<string, unknown>;
  }>;
  label?: React.ReactNode;
  className?: string;
  hideIndicator?: boolean;
}

export const ChartTooltip = RechartsPrimitive.Tooltip;

export function ChartTooltipContent({
  active,
  payload,
  label,
  className,
  hideIndicator,
}: ChartTooltipContentProps) {
  const { config } = useChart();

  if (!active || !payload?.length) return null;

  return (
    <div
      className={cn(
        "rounded-lg border bg-background px-2 py-1 text-xs shadow-xl",
        className
      )}
    >
      {label && <div className="mb-1 font-medium">{label}</div>}

      <div className="grid gap-1">
        {payload.map((item, i) => {
          const key = item.name || item.dataKey || "value";
          const cfg = config[key];

          return (
            <div key={i} className="flex items-center gap-2">
              {!hideIndicator && (
                <div
                  className="h-2.5 w-2.5 rounded-sm"
                  style={{
                    backgroundColor:
                      item.color || cfg?.color || "currentColor",
                  }}
                />
              )}

              <span className="text-muted-foreground">
                {cfg?.label || key}
              </span>

              {typeof item.value === "number" && (
                <span className="ml-auto font-mono">
                  {item.value.toLocaleString()}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------ */
/* Legend */
/* ------------------------------------------------ */

interface ChartLegendContentProps {
  payload?: Array<{
    dataKey?: string;
    color?: string;
    value?: string;
  }>;
  verticalAlign?: "top" | "bottom";
  className?: string;
}


export const ChartLegend = RechartsPrimitive.Legend;

export function ChartLegendContent({
  payload,
  verticalAlign = "bottom",
  className,
}: ChartLegendContentProps) {
  const { config } = useChart();

  if (!payload?.length) return null;

  return (
    <div
      className={cn(
        "flex justify-center gap-4",
        verticalAlign === "top" ? "pb-2" : "pt-2",
        className
      )}
    >
      {payload.map((item: any, i: number) => {
        const key = item.dataKey || "value";
        const cfg = config[key];

        return (
          <div key={i} className="flex items-center gap-1.5">
            <div
              className="h-2 w-2 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span>{cfg?.label || key}</span>
          </div>
        );
      })}
    </div>
  );
}
