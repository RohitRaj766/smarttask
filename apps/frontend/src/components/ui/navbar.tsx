"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../store/auth.context";
import { Skeleton } from "./skeleton";
import { useTheme } from "next-themes";
import {
  CheckSquare,
  LayoutDashboard,
  ListTodo,
  User,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "./button";
import { cn } from "../../lib/utils";

export const Navbar: React.FC = () => {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/overview", label: "Overview", icon: LayoutDashboard },
    { href: "/tasks", label: "Tasks", icon: ListTodo },
    { href: "/profile", label: "Profile", icon: User },
  ];

  const closeMenu = () => setIsMobileMenuOpen(false);

  const toggleThemeWithAnimation = (event: React.MouseEvent<HTMLButtonElement>) => {
    const isDark = theme === "dark";
    const nextTheme = isDark ? "light" : "dark";

    if (
      typeof document === "undefined" ||
      !(document as any).startViewTransition
    ) {
      setTheme(nextTheme);
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = (document as any).startViewTransition(() => {
      setTheme(nextTheme);
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      document.documentElement.animate(
        {
          clipPath: isDark ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 500,
          easing: "ease-in-out",
          pseudoElement: isDark
            ? "::view-transition-old(root)"
            : "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link
            href={user ? "/overview" : "/"}
            onClick={closeMenu}
            className="flex items-center gap-2 font-bold text-xl text-primary"
          >
            <CheckSquare className="h-6 w-6 text-primary" />
            <span>SmartTask</span>
          </Link>

          {user && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Dark / Light Theme Toggle Button with Circular View Transition */}
          <button
            onClick={toggleThemeWithAnimation}
            className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors relative"
            title="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-500 ease-in-out dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-500 ease-in-out dark:rotate-0 dark:scale-100 top-2 left-2" />
          </button>

          {isLoading ? (
            <Skeleton className="h-8 w-28 rounded-lg" />
          ) : user ? (
            <>
              {/* Desktop User Info & Logout */}
              <div className="hidden md:flex items-center gap-3 pl-3 border-l border-border">
                <div className="text-right">
                  <p className="text-xs font-semibold text-foreground">{user.name}</p>
                  <p className="text-[10px] text-muted-foreground">{user.email}</p>
                </div>

                <button
                  onClick={logout}
                  className="flex items-center gap-1 text-xs font-medium text-destructive hover:bg-destructive/10 px-3 py-2 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>

              {/* Mobile / Tablet Hamburger Toggle Button with Smooth Icon Swap */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden relative p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors flex items-center justify-center h-10 w-10"
                aria-label="Toggle menu"
              >
                <Menu
                  className={cn(
                    "h-6 w-6 transition-all duration-300 ease-in-out absolute",
                    isMobileMenuOpen ? "rotate-90 opacity-0 scale-50" : "rotate-0 opacity-100 scale-100"
                  )}
                />
                <X
                  className={cn(
                    "h-6 w-6 transition-all duration-300 ease-in-out absolute",
                    isMobileMenuOpen ? "rotate-0 opacity-100 scale-100" : "-rotate-90 opacity-0 scale-50"
                  )}
                />
              </button>
            </>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {!user && !isLoading && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden relative p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors flex items-center justify-center h-10 w-10"
              aria-label="Toggle menu"
            >
              <Menu
                className={cn(
                  "h-6 w-6 transition-all duration-300 ease-in-out absolute",
                  isMobileMenuOpen ? "rotate-90 opacity-0 scale-50" : "rotate-0 opacity-100 scale-100"
                )}
              />
              <X
                className={cn(
                  "h-6 w-6 transition-all duration-300 ease-in-out absolute",
                  isMobileMenuOpen ? "rotate-0 opacity-100 scale-100" : "-rotate-90 opacity-0 scale-50"
                )}
              />
            </button>
          )}
        </div>
      </div>

      {/* Responsive Mobile / Tablet Hamburger Menu Panel with Smooth Open/Close Animation */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-card/95 backdrop-blur-md shadow-xl",
          isMobileMenuOpen
            ? "max-h-[350px] opacity-100 py-4 px-4 border-t border-border"
            : "max-h-0 opacity-0 py-0 px-4 border-t-0"
        )}
      >
        <div className="space-y-4">
          {user ? (
            <>
              {/* User Pill Info */}
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <p className="text-sm font-bold text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    closeMenu();
                    logout();
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-destructive bg-destructive/10 px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMenu}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-primary/10 text-primary font-bold translate-x-1"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground hover:translate-x-1"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-1">
              <Link href="/login" onClick={closeMenu}>
                <Button variant="outline" className="w-full justify-center">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup" onClick={closeMenu}>
                <Button variant="primary" className="w-full justify-center">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
