import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
  perspective: "drafts",
});

// Write client for mutations - server-side only
// Requires SANITY_API_WRITE_TOKEN env var with Editor or higher permissions
const writeToken =
  process.env.SANITY_API_WRITE_TOKEN ??
  process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN;

if (writeToken) {
  console.log(
    "[Sanity] Write token found, length:",
    writeToken.length,
    "starts with:",
    writeToken.substring(0, 10) + "..."
  );
}

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: writeToken,
});
