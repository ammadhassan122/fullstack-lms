"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { writeClient } from "@/sanity/lib/client";

export async function toggleLessonCompletion(
  lessonId: string,
  lessonSlug: string,
  markComplete: boolean
): Promise<{ success: boolean; isCompleted: boolean; error?: string }> {
  const { userId } = await auth();

  if (!userId) {
    return {
      success: false,
      isCompleted: false,
      error: "You must be signed in to mark this lesson complete.",
    };
  }

  const token =
    process.env.SANITY_API_WRITE_TOKEN ||
    process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN;

  if (!token) {
    const message = "Missing Sanity write token for lesson completion toggle.";
    console.error(message);
    return {
      success: false,
      isCompleted: false,
      error: message,
    };
  }

  console.log("Token exists:", !!token, "Length:", token.length);

  try {
    if (markComplete) {
      // Add user ID to completedBy array
      await writeClient
        .patch(lessonId)
        .setIfMissing({ completedBy: [] })
        .append("completedBy", [userId])
        .commit();
    } else {
      // Remove user ID from completedBy array
      await writeClient
        .patch(lessonId)
        .unset([`completedBy[@ == "${userId}"]`])
        .commit();
    }

    revalidatePath(`/lessons/${lessonSlug}`);
    revalidatePath("/dashboard");

    return { success: true, isCompleted: markComplete };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to toggle lesson completion";
    console.error("Failed to toggle lesson completion:", error);
    return { success: false, isCompleted: !markComplete, error: message };
  }
}
