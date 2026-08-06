"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "../store/auth.context";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import {
  CheckSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Target,
  BarChart3,
  Clock,
  CheckCircle2,
  ListTodo,
  LayoutDashboard,
  Calendar,
  Layers,
  Users,
} from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();

  const businessBenefits = [
    {
      icon: Target,
      title: "Centralized Task Management",
      description:
        "Streamline all your daily projects, action items, and deliverables in one unified, distraction-free workspace.",
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      icon: BarChart3,
      title: "Real-Time Productivity Analytics",
      description:
        "Gain instant visibility into task distribution, completion trends, and project bottlenecks across your pipeline.",
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      icon: Zap,
      title: "Smart Priority Matrix",
      description:
        "Focus on high-impact initiatives first with intuitive priority classification (High, Medium, Low).",
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
    {
      icon: Clock,
      title: "Deadline & Reminder Guardrails",
      description:
        "Set target due dates and reminder timestamps to keep your team aligned and ensure deadlines are never missed.",
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    },
    {
      icon: Layers,
      title: "Flexible Category Tagging",
      description:
        "Organize workflows across Work, Personal, Study, Shopping, Health, and custom business categories.",
      color: "text-pink-500 bg-pink-500/10 border-pink-500/20",
    },
    {
      icon: ShieldCheck,
      title: "Bank-Grade Security",
      description:
        "Keep your corporate data protected with encrypted password storage, HttpOnly session tokens, and strict privacy controls.",
      color: "text-teal-500 bg-teal-500/10 border-teal-500/20",
    },
  ];

  const stats = [
    { label: "Completion Rate", value: "98.4%" },
    { label: "Time Saved Weekly", value: "8+ Hours" },
    { label: "System Uptime", value: "99.99%" },
    { label: "Active Task Tracking", value: "Unlimited" },
  ];

  return (
    <div className="flex flex-col min-h-screen -mt-4 sm:-mt-6">
      {/* Main Content Area */}
      <main className="flex-1 space-y-24 py-8 sm:py-16">
        {/* Hero Section */}
        <section className="relative text-center space-y-8 max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-semibold tracking-wide">
            <Sparkles className="h-4 w-4" />
            <span>Elevate Your Daily Team Workflow</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground leading-[1.15]">
            Organize, Prioritize & Execute Work{" "}
            <span className="bg-gradient-to-r from-primary via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Without Friction
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            SmartTask helps ambitious professionals and teams centralize task management, eliminate project bottlenecks, and achieve peak operational throughput.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            {user ? (
              <Link href="/dashboard">
                <Button size="lg" className="gap-2 px-8 text-base shadow-lg shadow-primary/25">
                  <LayoutDashboard className="h-5 w-5" /> Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/signup">
                  <Button size="lg" className="gap-2 px-8 text-base shadow-lg shadow-primary/25">
                    Start Free Workspace <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="px-8 text-base">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Interactive SaaS Mockup */}
          <div className="pt-8">
            <div className="relative rounded-2xl border border-border bg-card/70 p-4 sm:p-6 shadow-2xl backdrop-blur-xl max-w-3xl mx-auto">
              <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <CheckSquare className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-foreground">Project Workspace</h4>
                    <p className="text-[10px] text-muted-foreground">Executive Overview</p>
                  </div>
                </div>
                <Badge variant="success" className="text-[10px] gap-1">
                  <CheckCircle2 className="h-3 w-3" /> System Synchronized
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 text-left mb-6">
                <div className="p-3 rounded-xl border border-primary/20 bg-primary/5">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Total Scope</p>
                  <p className="text-xl font-extrabold text-primary">32 Tasks</p>
                </div>
                <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Active Sprint</p>
                  <p className="text-xl font-extrabold text-amber-500">12 Pending</p>
                </div>
                <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Completed</p>
                  <p className="text-xl font-extrabold text-emerald-500">20 Items</p>
                </div>
              </div>

              <div className="space-y-2 text-left">
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/80 text-sm">
                  <div className="flex items-center gap-3">
                    <CheckSquare className="h-4 w-4 text-emerald-500" />
                    <span className="font-semibold text-xs sm:text-sm">Finalize Quarterly Marketing Strategy</span>
                  </div>
                  <Badge variant="success">COMPLETED</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/80 text-sm">
                  <div className="flex items-center gap-3">
                    <ListTodo className="h-4 w-4 text-amber-500" />
                    <span className="font-semibold text-xs sm:text-sm">Review Product Roadmap & Client Deliverables</span>
                  </div>
                  <Badge variant="warning">IN_PROGRESS</Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Impact Banner */}
        <section className="border-y border-border bg-card/40 py-8">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-3xl font-black text-primary">{stat.value}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Key Business Benefits Grid */}
        <section className="space-y-12 max-w-6xl mx-auto px-4">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight">Everything You Need to Scale Output</h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              Purpose-built tools designed to reduce administrative chaos and keep team objectives on track.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessBenefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <Card key={idx} className="border-border bg-card shadow-sm hover:shadow-md hover:border-primary/40 transition-all">
                  <CardContent className="p-6 space-y-4">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${benefit.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="max-w-4xl mx-auto px-4">
          <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-purple-500/10 p-8 sm:p-12 text-center space-y-6 shadow-xl">
            <h2 className="text-3xl font-extrabold tracking-tight">Take Control of Your Workflows Today</h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base">
              Join thousands of professionals using SmartTask to drive productivity, hit deadlines, and accomplish more every day.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="px-8 shadow-md">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Comprehensive Professional Footer */}
      <footer className="w-full border-t border-border bg-card mt-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                <CheckSquare className="h-6 w-6 text-primary" />
                <span>SmartTask</span>
              </Link>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The intuitive task management platform built for modern teams and ambitious professionals.
              </p>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">Product</h5>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
                <li><Link href="/tasks" className="hover:text-primary transition-colors">Task Directory</Link></li>
                <li><Link href="/tasks/new" className="hover:text-primary transition-colors">Create Task</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">Solutions</h5>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><span className="hover:text-primary transition-colors cursor-pointer">Project Planning</span></li>
                <li><span className="hover:text-primary transition-colors cursor-pointer">Daily Productivity</span></li>
                <li><span className="hover:text-primary transition-colors cursor-pointer">Task Prioritization</span></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">Account & Access</h5>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><Link href="/login" className="hover:text-primary transition-colors">Sign In</Link></li>
                <li><Link href="/signup" className="hover:text-primary transition-colors">Register Free</Link></li>
                <li><Link href="/profile" className="hover:text-primary transition-colors">User Profile</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
            <p>© {new Date().getFullYear()} SmartTask Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <span className="hover:text-foreground transition-colors cursor-pointer">Privacy Policy</span>
              <span className="hover:text-foreground transition-colors cursor-pointer">Terms of Service</span>
              <span className="hover:text-foreground transition-colors cursor-pointer">Security</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
