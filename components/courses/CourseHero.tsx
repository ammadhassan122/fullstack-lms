import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen, Play, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { COURSE_WITH_MODULES_QUERY_RESULT } from "@/sanity.types";

type Course = NonNullable<COURSE_WITH_MODULES_QUERY_RESULT>;

type CourseHeroProps = Pick<
  Course,
  | "title"
  | "description"
  | "thumbnail"
  | "category"
  | "moduleCount"
  | "lessonCount"
>;

const CATEGORY_GRADIENTS: Record<string, string> = {
  Mathematics: "from-amber-300 via-orange-300 to-yellow-200",
  English: "from-sky-300 via-teal-300 to-emerald-200",
};

export function CourseHero({
  title,
  description,
  thumbnail,
  category,
  moduleCount,
  lessonCount,
}: CourseHeroProps) {
  const gradient =
    CATEGORY_GRADIENTS[category?.title ?? ""] ??
    "from-pastel-sky via-pastel-mint to-pastel-yellow";

  return (
    <div className="mb-12">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to my desk
      </Link>

      <div className="flex flex-col lg:flex-row gap-8 kid-card p-6 md:p-8">
        <div
          className={`relative w-full lg:w-80 h-48 lg:h-52 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden shrink-0 border-2 border-white/60`}
        >
          {thumbnail?.asset?.url ? (
            <Image
              src={thumbnail.asset.url}
              alt={title ?? "Course thumbnail"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-white/70">
              <BookOpen className="w-20 h-20" />
            </div>
          )}
        </div>

        <div className="flex-1">
          {category?.title && (
            <Badge
              variant="outline"
              className="mb-4 border-sky-300 bg-pastel-sky/60 text-sky-800 font-semibold rounded-full"
            >
              <Tag className="w-3 h-3 mr-1" />
              {category.title}
            </Badge>
          )}

          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4 kid-gradient-text">
            {title ?? "Untitled Course"}
          </h1>

          {description && (
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed max-w-2xl">
              {description}
            </p>
          )}

          <div className="flex items-center gap-6 text-sm text-muted-foreground font-semibold">
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-500" />
              {moduleCount ?? 0} modules
            </span>
            <span className="flex items-center gap-2">
              <Play className="w-4 h-4 text-teal-500" />
              {lessonCount ?? 0} lessons
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
