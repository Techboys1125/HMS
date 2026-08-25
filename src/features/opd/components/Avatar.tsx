import React from "react";

const PP = "'Poppins', system-ui, sans-serif";

export interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
}

const OPD_AVATAR_COLORS = [
  "bg-[#0D47A1]",
  "bg-[#009688]",
  "bg-violet-600",
  "bg-rose-500",
  "bg-amber-600",
];

const OPD_AVATAR_SIZES = {
  sm: "w-7 h-7 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-11 h-11 text-base",
};

export const Avatar: React.FC<AvatarProps> = ({ name, size = "sm" }) => {
  const initials = name
    .split(" ")
    .filter((n) => n.length > 0)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const color =
    OPD_AVATAR_COLORS[name.charCodeAt(0) % OPD_AVATAR_COLORS.length];

  return (
    <div
      className={`${OPD_AVATAR_SIZES[size]} ${color} rounded-full flex items-center justify-center text-white font-bold shrink-0`}
      style={{ fontFamily: PP }}
    >
      {initials}
    </div>
  );
};

export default Avatar;
