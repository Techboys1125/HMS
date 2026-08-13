import React, { useId } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type ChartType = "area" | "bar" | "pie" | "line";

interface ReportChartProps {
  type: ChartType;
  data: Record<string, unknown>[];
  dataKey?: string;
  xKey?: string;
  colors?: string[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  layout?: "horizontal" | "vertical";
  yAxisWidth?: number;
  barRadius?: [number, number, number, number];
  barSize?: number;
  areaGradient?: boolean;
  lineDot?: boolean;
}

const DEFAULT_COLORS = [
  "#0D47A1",
  "#009688",
  "#4DB6AC",
  "#66BB6A",
  "#F59E0B",
  "#EF4444",
];

export function ReportChart({
  type,
  data,
  dataKey = "value",
  xKey = "name",
  colors = DEFAULT_COLORS,
  height = 220,
  showGrid = true,
  showLegend = false,
  showTooltip = true,
  layout = "horizontal",
  yAxisWidth = 80,
  barRadius = [0, 4, 4, 0],
  barSize = 14,
  areaGradient = true,
  lineDot = false,
}: ReportChartProps) {
  const generatedId = useId();
  const gradId = `report-chart-${generatedId.replace(/:/g, "")}`;
  const tooltipStyle = {
    background: "#fff",
    border: "1px solid #E5E7EB",
    borderRadius: 12,
    fontSize: 12,
  };

  if (type === "pie") {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={75}
            paddingAngle={3}
            dataKey={dataKey}
          >
            {data.map((item, idx) => {
              const cellKey = xKey && item[xKey] !== undefined
                ? String(item[xKey])
                : (item.id !== undefined ? String(item.id) : JSON.stringify(item));
              return (
                <Cell key={cellKey} fill={colors[idx % colors.length]} />
              );
            })}
          </Pie>
          {showTooltip && <Tooltip contentStyle={tooltipStyle} />}
          {showLegend && <Legend />}
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (type === "bar" && layout === "vertical") {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
        >
          <XAxis
            type="number"
            tick={{ fontSize: 10, fill: "#94A3B8" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            dataKey={xKey}
            type="category"
            tick={{ fontSize: 11, fill: "#111827" }}
            axisLine={false}
            tickLine={false}
            width={yAxisWidth}
          />
          {showTooltip && <Tooltip contentStyle={tooltipStyle} />}
          <Bar
            dataKey={dataKey}
            fill={colors[0]}
            radius={barRadius}
            barSize={barSize}
          >
            {data.map((item, idx) => {
              const cellKey = xKey && item[xKey] !== undefined
                ? String(item[xKey])
                : (item.id !== undefined ? String(item.id) : JSON.stringify(item));
              return (
                <Cell key={cellKey} fill={colors[idx % colors.length]} />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (type === "bar") {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
        >
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 11, fill: "#64748B" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#94A3B8" }}
            axisLine={false}
            tickLine={false}
          />
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
          {showTooltip && <Tooltip contentStyle={tooltipStyle} />}
          <Bar
            dataKey={dataKey}
            fill={colors[0]}
            radius={barRadius}
            barSize={barSize}
          >
            {data.map((item, idx) => {
              const cellKey = xKey && item[xKey] !== undefined
                ? String(item[xKey])
                : (item.id !== undefined ? String(item.id) : JSON.stringify(item));
              return (
                <Cell key={cellKey} fill={colors[idx % colors.length]} />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (type === "line") {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 15, left: -15, bottom: 0 }}
        >
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 11, fill: "#64748B" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#94A3B8" }}
            axisLine={false}
            tickLine={false}
          />
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
          {showTooltip && <Tooltip contentStyle={tooltipStyle} />}
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={colors[0]}
            strokeWidth={2.5}
            dot={lineDot ? { r: 3, fill: colors[0] } : false}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  // Default: Area chart
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        {areaGradient && (
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors[0]} stopOpacity={0.2} />
              <stop offset="100%" stopColor={colors[0]} stopOpacity={0} />
            </linearGradient>
          </defs>
        )}
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 11, fill: "#64748B" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#94A3B8" }}
          axisLine={false}
          tickLine={false}
        />
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
        {showTooltip && <Tooltip contentStyle={tooltipStyle} />}
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={colors[0]}
          strokeWidth={2.5}
          fill={areaGradient ? `url(#${gradId})` : colors[0]}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
