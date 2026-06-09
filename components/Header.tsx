"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  GraduationCap,
  Play,
  LayoutDashboard,
  BookOpen,
  Menu,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const loggedOutLinks = [
  { href: "#courses", label: "Our Classes" },
  { href: "#testimonials", label: "Fun Reviews" },
];

export function Header() {
  const pathname = usePathname();

  const loggedInLinks = [
    { href: "/dashboard", label: "My Desk", icon: LayoutDashboard },
    { href: "/dashboard/courses", label: "My Classes", icon: BookOpen },
  ];

  return (
    <nav className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-5 max-w-7xl mx-auto">
      <div>
        <Show when="signed-in">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <Logo />
          </Link>
        </Show>
        <Show when="signed-out">
          <Link href="/" className="flex items-center gap-3 group">
            <Logo />
          </Link>
        </Show>
      </div>

      <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Show when="signed-out">
          <div className="flex items-center gap-8 text-sm text-muted-foreground font-medium">
            {loggedOutLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </Show>

        <Show when="signed-in">
          <div className="flex items-center gap-1">
            {loggedInLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href !== "/dashboard" && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                    isActive
                      ? "bg-pastel-sky/80 text-sky-800 shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-pastel-mint/50",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </Show>
      </div>

      <div className="flex items-center gap-3">
        <Show when="signed-out">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Menu className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              {loggedOutLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link href={link.href} className="cursor-pointer">
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <SignInButton mode="modal">
            <Button variant="ghost" className="text-muted-foreground font-medium">
              Sign in
            </Button>
          </SignInButton>
          <Link href="/dashboard" className="hidden sm:block">
            <Button className="bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white border-0 shadow-md shadow-sky-300/40 rounded-xl font-semibold">
              <Sparkles className="w-4 h-4 mr-2" />
              Start Learning
            </Button>
          </Link>
        </Show>

        <Show when="signed-in">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Menu className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              {loggedInLinks.map((link) => {
                const Icon = link.icon;
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/dashboard" &&
                    pathname.startsWith(link.href));

                return (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center gap-2 cursor-pointer",
                        isActive ? "text-primary" : "",
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-9 h-9 ring-2 ring-sky-300/60",
              },
            }}
          />
        </Show>
      </div>
    </nav>
  );
}

function Logo() {
  return (
    <>
      <div className="relative">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-teal-500 flex items-center justify-center shadow-md shadow-sky-300/40 group-hover:shadow-sky-400/50 transition-shadow">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
          <Play className="w-2 h-2 text-white fill-white" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-lg tracking-tight leading-none text-foreground">
          SMART
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
          Academy · Grade 5
        </span>
      </div>
    </>
  );
}
