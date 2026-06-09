"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CourseCard } from "./CourseCard";
import type { DASHBOARD_COURSES_QUERY_RESULT } from "@/sanity.types";

export type CourseListCourse = DASHBOARD_COURSES_QUERY_RESULT[number];

interface CourseListProps {
  courses: CourseListCourse[];
  showSearch?: boolean;
  emptyMessage?: string;
}

export function CourseList({
  courses,
  showSearch = true,
  emptyMessage = "No courses found",
}: CourseListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = courses.filter((course) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const title = course.title?.toLowerCase() ?? "";
    const description = course.description?.toLowerCase() ?? "";
    const category = course.category?.title?.toLowerCase() ?? "";
    return (
      title.includes(query) ||
      description.includes(query) ||
      category.includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {showSearch && (
        <div className="flex justify-end">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search your classes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl border-2 border-border bg-card focus-visible:ring-sky-400"
            />
          </div>
        </div>
      )}

      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.slug!.current!}
              slug={{ current: course.slug!.current! }}
              title={course.title}
              description={course.description}
              tier={course.tier}
              thumbnail={course.thumbnail}
              moduleCount={course.moduleCount}
              lessonCount={course.lessonCount}
              subjectHint={course.category?.title ?? undefined}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center kid-card">
          <div className="w-16 h-16 rounded-full bg-pastel-sky/80 flex items-center justify-center mb-4">
            <Search className="w-6 h-6 text-sky-600" />
          </div>
          <p className="text-muted-foreground font-medium">{emptyMessage}</p>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mt-2 text-sm text-primary hover:underline font-semibold"
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  );
}
