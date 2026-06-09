"use client";

import type { Tier } from "@/lib/constants";

/** All students have full access — billing tiers are disabled. */
export function useUserTier(): Tier {
  return "free";
}

/** All course content is freely accessible to logged-in students. */
export function hasTierAccess(
  _userTier: Tier,
  _contentTier: Tier | null | undefined,
): boolean {
  return true;
}
