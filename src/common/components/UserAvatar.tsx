import React, { useState } from "react";
import { normalizeImageUrl } from "../../lib/image-utils";

interface UserAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  src?: string | null;
  photoUrl?: string | null;
  photo?: string | null;
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  size = "md",
  src,
  photoUrl,
  photo,
  className = "",
}) => {
  const [failedImageSource, setFailedImageSource] = useState<string | null>(
    null,
  );
  const rawSource = src || photoUrl || photo;
  const imageSource = normalizeImageUrl(rawSource);
  const imageError = Boolean(imageSource) && failedImageSource === imageSource;

  const initials = name
    ? name
        .trim()
        .split(" ")
        .filter((n) => n.length > 0)
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  const colors = [
    "bg-[#0D47A1]",
    "bg-[#009688]",
    "bg-violet-600",
    "bg-rose-500",
    "bg-amber-600",
  ];
  const charCode = (name && name.charCodeAt(0)) || 0;
  const color = colors[charCode % colors.length];

  const sizes = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-xl",
  };

  if (imageSource && !imageError) {
    return (
      <img
        src={imageSource}
        alt={name || "User avatar"}
        onError={() => imageSource && setFailedImageSource(imageSource)}
        className={`${sizes[size]} rounded-full object-cover shrink-0 border border-slate-200 shadow-xs ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} ${color} rounded-full flex items-center justify-center text-white font-semibold shrink-0 select-none ${className}`}
    >
      {initials || "?"}
    </div>
  );
};

export default UserAvatar;
