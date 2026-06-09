import type { Tier } from "@/lib/constants";

/**
 * All logged-in students have full access — no paid tiers in this LMS.
 */
export async function hasAccessToTier(
  _requiredTier: Tier | null | undefined,
): Promise<boolean> {
  return true;
}

/**
 * All students are on the free (full-access) plan.
 */
export async function getUserTier(): Promise<Tier> {
  return "free";
}
