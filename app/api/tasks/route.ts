import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { submitLessonTask } from "@/lib/actions/tasks";

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { message: "Unauthorized" }, 
      { status: 401 },
    );
  }

  const body = await request.json();
  const lessonId = typeof body?.lessonId === "string" ? body.lessonId : "";
  const submission = typeof body?.submission === "string" ? body.submission : "";

  if (!lessonId || !submission.trim()) {
    return NextResponse.json(
      { message: "Please provide a lesson ID and submission text." },
      { status: 400 },
    );
  }

  try {
    const result = await submitLessonTask({
      userId,
      lessonId,
      submission: submission.trim(),
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to submit lesson task.",
      },
      { status: 500 },
    );
  }
}
