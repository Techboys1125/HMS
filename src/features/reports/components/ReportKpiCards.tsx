import React from "react";

export interface KpiCardData {
  title: string;
  value: string;
  sub?: string;
  trend?: string;
  isPositive?: boolean;
  color?: string;
  icon?: React.ElementType;
}
