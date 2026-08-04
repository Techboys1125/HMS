import React from "react";
import { Loader2 } from "lucide-react";

interface LoaderProps {
  message?: string;
  size?: number;
}

export const Loader: React.FC<LoaderProps> = ({
  message = "Loading data...",
  size = 32,
}) => {
  return (
    <div className="py-20 flex flex-col items-center justify-center gap-3">
      <Loader2 className="animate-spin text-[#0D47A1]" size={size} />
      <p className="text-xs text-[#64748B] font-medium">{message}</p>
    </div>
  );
};

export default Loader;
