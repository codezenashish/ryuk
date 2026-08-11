"use client";

import { Avatar } from "@avatune/react";
import theme from "@avatune/yanliu-theme/react";

interface UserAvatarProps {
  seed?: string | null;
  size?: number;
  className?: string;
}

export function UserAvatar({ seed, size = 36, className = "" }: UserAvatarProps) {
  const avatarSeed = seed && seed.trim() !== "" ? seed : "ryuk-default-user";

  return (
    <div className={`inline-flex items-center justify-center overflow-hidden rounded-full shrink-0 ${className}`}>
      <Avatar theme={theme} seed={avatarSeed} size={size} />
    </div>
  );
}
