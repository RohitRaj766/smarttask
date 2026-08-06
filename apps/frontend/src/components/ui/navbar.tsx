"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../store/auth.context";
import { useTheme } from "next-themes";
import { CheckSquare, LayoutDashboard, ListTodo, User, Sun, Moon, LogOut } from "lucide-react";
import { Button } from "./button";
import { cn } from "../../lib/utils";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/tasks", label: "Tasks", icon: ListTodo },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link
            href={user ? "/dashboard" : "/"}
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
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors relative"
            title="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 top-2 left-2" />
          </button>

          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-border">
                <div className="text-right">
                  <p className="text-xs font-semibold text-foreground">{user.name}</p>
                  <p className="text-[10px] text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <button
                onClick={logout}
                className="flex items-center gap-1 text-xs font-medium text-destructive hover:bg-destructive/10 px-3 py-2 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
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
        </div>
      </div>
    </header>
  );
};
