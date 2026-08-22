import React from "react";

export interface SectionHeaderProps {
  title: string;
  sub?: string;
  action?: React.ReactNode;
  className?: string;
}
