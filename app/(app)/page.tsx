import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { AppShell } from "@/components/AppShell";
import { CourseCard } from "@/components/courses";
import {
  ArrowRight,
  Play,
  BookOpen,
  GraduationCap,
  Rocket,
  CheckCircle2,
  Star,
  Sparkles,
  LayoutDashboard,
  Calculator,
  PenLine,
} from "lucide-react";
import { sanityFetch } from "@/sanity/lib/live";
import { FEATURED_COURSES_QUERY } from "@/sanity/lib/queries";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();
  const isSignedIn = Boolean(user);
  const { data: courses = [] } = await sanityFetch({
    query: FEATURED_COURSES_QUERY,
  });

  return (
    <AppShell>
      <Header />
      <main className="relative z-10">
        {/* Hero */}
        <section className="px-6 lg:px-12 pt-16 pb-24 max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pastel-sky/90 border-2 border-sky-200 mb-8">
              <Sparkles className="w-4 h-4 text-sky-700" />
              <span className="text-sm font-bold text-sky-900">
                Learning made fun for 5th graders!
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-black tracking-tight leading-[0.95] mb-8 text-foreground">
              <span className="block">Learn math &amp;</span>
              <span className="block kid-gradient-text">English the fun way</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed font-medium">
              Welcome to Smart Academy! Explore colorful lessons, silly stories,
              and super-easy math adventures.{" "}
              <span className="text-sky-800 font-semibold">
                Everything is free
              </span>{" "}
              once you sign in.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {isSignedIn ? (
                <>
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white border-0 shadow-lg shadow-sky-300/50 px-8 h-12 text-base font-bold rounded-xl"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Go to My Desk
                    </Button>
                  </Link>
                  <Link href="/dashboard/courses">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-2 border-sky-200 bg-white/80 text-foreground px-8 h-12 text-base font-semibold hover:bg-pastel-sky/50 rounded-xl"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      My Classes
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white border-0 shadow-lg shadow-sky-300/50 px-8 h-12 text-base font-bold rounded-xl"
                    >
                      <Play className="w-4 h-4 mr-2 fill-white" />
                      Start Learning Free
                    </Button>
                  </Link>
                  <Link href="#courses">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-2 border-amber-200 bg-pastel-yellow/60 text-foreground px-8 h-12 text-base font-semibold hover:bg-pastel-yellow rounded-xl"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      See Our Classes
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* What you'll learn */}
        <section className="px-6 lg:px-12 py-16 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Fun Mathematics",
                icon: Calculator,
                gradient: "from-sky-400 to-teal-500",
                bg: "bg-pastel-sky/60",
                border: "border-sky-200",
                description:
                  "Ratios, proportions, and yummy word problems — like sharing cookies fairly!",
                features: [
                  "The Cookie Ratio!",
                  "Sharing chocolates fairly",
                  "Pizza party math",
                ],
              },
              {
                title: "Creative English",
                icon: PenLine,
                gradient: "from-amber-400 to-orange-400",
                bg: "bg-pastel-yellow/70",
                border: "border-amber-200",
                description:
                  "Write magical poems, read fun stories, and become a storytelling star!",
                features: [
                  "Rhyming poems",
                  "Story starters",
                  "Reading adventures",
                ],
              },
            ].map((subject) => (
              <div
                key={subject.title}
                className={`relative p-8 rounded-3xl ${subject.bg} border-2 ${subject.border} transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${subject.gradient} flex items-center justify-center mb-4 shadow-md`}
                >
                  <subject.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-black mb-2 text-foreground">
                  {subject.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-6 font-medium">
                  {subject.description}
                </p>
                <ul className="space-y-3">
                  {subject.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm font-semibold text-foreground"
                    >
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Courses */}
        <section id="courses" className="px-6 lg:px-12 py-20 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4 text-foreground">
              Our{" "}
              <span className="kid-gradient-text">awesome classes</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
              Short lessons, big smiles. Pick a class and start your next
              adventure!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.slug!.current!}
                slug={{ current: course.slug!.current! }}
                title={course.title}
                description={course.description}
                tier={course.tier}
                thumbnail={course.thumbnail}
                moduleCount={course.moduleCount}
                lessonCount={course.lessonCount}
              />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="border-2 border-sky-200 bg-white/80 text-foreground font-semibold hover:bg-pastel-sky/50 rounded-xl"
              >
                View All Classes
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Testimonials */}
        <section
          id="testimonials"
          className="px-6 lg:px-12 py-20 max-w-7xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4 text-foreground">
              Kids{" "}
              <span className="kid-gradient-text">love learning here</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Maya, age 10",
                role: "5th Grader",
                content:
                  "The cookie ratio lesson was so cool! I finally get how to share snacks fairly with my friends.",
                avatar: "🍪",
              },
              {
                name: "Jordan, age 11",
                role: "5th Grader",
                content:
                  "I wrote my first poem about a dragon who loves tacos. Creative English is my favorite class!",
                avatar: "🐉",
              },
              {
                name: "Sam, age 10",
                role: "5th Grader",
                content:
                  "Math used to feel hard, but the lessons are like games. I want to do one more every day!",
                avatar: "⭐",
              },
            ].map((testimonial) => (
              <div key={testimonial.name} className="p-6 rounded-2xl kid-card">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={`star-${testimonial.name}-${i}`}
                      className="w-4 h-4 text-amber-500 fill-amber-400"
                    />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed font-medium">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pastel-mint flex items-center justify-center text-xl border-2 border-teal-200">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 lg:px-12 py-20 max-w-7xl mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-br from-pastel-sky/80 via-pastel-mint/60 to-pastel-yellow/70 border-2 border-sky-200 p-12 md:p-16 text-center overflow-hidden shadow-lg">
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-teal-500 flex items-center justify-center mx-auto mb-6 shadow-md">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-6 text-foreground">
                Ready for your next adventure?
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10 font-medium">
                Jump into math and English lessons made just for you. Sign in
                and start learning — it&apos;s all free!
              </p>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white border-0 shadow-lg shadow-sky-300/50 px-10 h-14 text-lg font-bold rounded-xl"
                >
                  Explore Classes
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 lg:px-12 py-12 border-t-2 border-border/60 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-teal-500 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-foreground">Smart Academy</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-muted-foreground font-medium">
              <Link href="#" className="hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Terms
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              © 2026 Smart Academy · Grade 5
            </p>
          </div>
        </footer>
      </main>
    </AppShell>
  );
}
