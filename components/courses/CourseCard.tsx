"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen, Play, Layers, CheckCircle2, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { DASHBOARD_COURSES_QUERY_RESULT } from "@/sanity.types";

type SanityCourse = DASHBOARD_COURSES_QUERY_RESULT[number];

const SUBJECT_GRADIENTS: Record<string, string> = {
  mathematics: "from-amber-300 via-orange-300 to-yellow-200",
  english: "from-sky-300 via-teal-300 to-emerald-200",
  default: "from-pastel-sky via-pastel-mint to-pastel-yellow",
};

export interface CourseCardProps
  extends Pick<
    SanityCourse,
    | "title"
    | "description"
    | "tier"
    | "thumbnail"
    | "moduleCount"
    | "lessonCount"
  > {
  slug?: { current: string } | null;
  href?: string;
  completedLessonCount?: number | null;
  isCompleted?: boolean;
  showProgress?: boolean;
  subjectHint?: string;
}

export function CourseCard({
  slug,
  href,
  title,
  description,
  thumbnail,
  moduleCount,
  lessonCount,
  completedLessonCount = 0,
  isCompleted = false,
  showProgress = false,
  subjectHint,
}: CourseCardProps) {
  const totalLessons = lessonCount ?? 0;
  const completed = completedLessonCount ?? 0;
  const progressPercent =
    totalLessons > 0 ? (completed / totalLessons) * 100 : 0;

  const linkHref = href ?? `/courses/${slug?.current ?? ""}`;
  const gradientKey = subjectHint?.toLowerCase() ?? "default";
  const gradient =
    SUBJECT_GRADIENTS[gradientKey] ?? SUBJECT_GRADIENTS.default;

  return (
    <Link href={linkHref} className="group block">
      <div className="relative rounded-2xl kid-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-sky-200/50 hover:-translate-y-0.5">
        <div
          className={`h-36 pt-5 bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}
        >
          {thumbnail?.asset?.url ? (
            <Image
              src={thumbnail.asset.url}
              alt={title ?? "Course thumbnail"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-white/60 py-4">
              <BookOpen className="w-16 h-16" />
            </div>
          )}
          <div className="absolute inset-0 bg-white/10" />

          {isCompleted ? (
            <div className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold bg-teal-500 text-white shadow-sm">
              <CheckCircle2 className="w-4 h-4" />
              Done!
            </div>
          ) : (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold bg-white/90 text-amber-600 shadow-sm">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              Fun!
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {title ?? "Untitled Course"}
          </h3>

          {description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {description}
            </p>
          )}

          <div className="flex items-center gap-5 text-sm text-muted-foreground font-medium">
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-500" />
              {moduleCount ?? 0} modules
            </span>
            <span className="flex items-center gap-2">
              <Play className="w-4 h-4 text-teal-500" />
              {lessonCount ?? 0} lessons
            </span>
          </div>

          {showProgress && totalLessons > 0 && (
            <div className="mt-4 pt-4 border-t border-border/60">
              <div className="flex items-center justify-between text-sm mb-2 font-medium">
                <span className="text-muted-foreground">
                  {completed}/{totalLessons} lessons
                </span>
                <span className="text-primary">
                  {Math.round(progressPercent)}%
                </span>
              </div>
              <Progress
                value={progressPercent}
                className="h-2.5 bg-pastel-sky/50 [&>div]:bg-gradient-to-r [&>div]:from-sky-400 [&>div]:to-teal-400"
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
