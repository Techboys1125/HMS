const AVATAR_COLORS = [
  "bg-[#0D47A1]",
  "bg-[#009688]",
  "bg-violet-600",
  "bg-rose-500",
  "bg-amber-600",
];

const AVATAR_SIZES = {
  sm: "w-7 h-7 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-11 h-11 text-base",
};

import { useState } from "react";

const BASE_URL = "http://192.168.1.44:8888";

function formatAvatarUrl(url?: string | null): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  const cleanBase = BASE_URL.replace(/\/+$/, "");
  return url.startsWith("/") ? `${cleanBase}${url}` : `${cleanBase}/${url}`;
}

export function Avatar({
  name,
  size = "sm",
  src,
  photoUrl,
}: {
  name: string;
  size?: "sm" | "md" | "lg";
  src?: string | null;
  photoUrl?: string | null;
}) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const rawSource = src || photoUrl;
  const imageSource = formatAvatarUrl(rawSource);
  const imageError = failedSource === imageSource;

  const initials = name
    ? name
        .trim()
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  const color =
    AVATAR_COLORS[((name && name.charCodeAt(0)) || 0) % AVATAR_COLORS.length];

  if (imageSource && !imageError) {
    return (
      <img
        src={imageSource}
        alt={name || "Avatar"}
        onError={() => setFailedSource(imageSource)}
        className={`${AVATAR_SIZES[size].split(" ")[0]} ${AVATAR_SIZES[size].split(" ")[1]} rounded-full object-cover shrink-0 border border-slate-200`}
      />
    );
  }

  return (
    <div
      className={`${AVATAR_SIZES[size]} ${color} rounded-full flex items-center justify-center text-white font-semibold shrink-0`}
    >
      {initials}
    </div>
  );
}
