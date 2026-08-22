import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-[#E5E7EB] shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
