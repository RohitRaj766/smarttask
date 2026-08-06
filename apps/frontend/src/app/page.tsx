"use client";

import React from "react";
import Link from "next/link";
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
  Smartphone,
  Download,
} from "lucide-react";

export default function LandingPage() {
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
        "Organize deliverables by Work, Personal, Strategy, or custom business verticals effortlessly.",
      color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      icon: ShieldCheck,
      title: "Enterprise Security Architecture",
      description:
        "Built with HTTP-only cookie authentication, refresh token rotation, and robust data encryption.",
      color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    },
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Capture & Organize",
      description: "Log initiatives with detailed specifications, priority levels, and category tags.",
    },
    {
      step: "02",
      title: "Prioritize Execution",
      description: "Filter and sort your workload by urgency to focus effort where ROI is highest.",
    },
    {
      step: "03",
      title: "Track Progress & Scale",
      description: "Monitor status progression (TODO, In Progress, Review, Completed) seamlessly.",
    },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-background">
      {/* 1. Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden border-b border-border bg-gradient-to-b from-background via-card/50 to-background">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs sm:text-sm font-bold shadow-sm">
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

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 flex-wrap">
            <Link href="/signup">
              <Button size="lg" className="gap-2 px-8 text-base shadow-lg shadow-primary/25">
                Start Free Workspace <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <a
              href="https://expo.dev/accounts/rohitraj2k04/projects/smarttask-mobile/builds/e00cd746-f8fc-4481-8689-ecc19b9f4012"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 px-6 text-base border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 shadow-md shadow-emerald-500/10"
              >
                <Smartphone className="h-5 w-5 text-emerald-500" />
                <span>Download Android APK</span>
                <Download className="h-4 w-4 text-emerald-500" />
              </Button>
            </a>
          </div>

          {/* Social Proof / Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 max-w-4xl mx-auto border-t border-border/60">
            <div>
              <p className="text-3xl font-extrabold text-foreground">99.9%</p>
              <p className="text-xs text-muted-foreground mt-1">Uptime Reliability</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-foreground">4.9/5</p>
              <p className="text-xs text-muted-foreground mt-1">Productivity Score</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-foreground">3x</p>
              <p className="text-xs text-muted-foreground mt-1">Faster Execution</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-foreground">10k+</p>
              <p className="text-xs text-muted-foreground mt-1">Tasks Completed</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Business Value Proposition Grid */}
      <section className="py-20 bg-card/40 border-b border-border">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge variant="outline" className="uppercase tracking-wider text-xs">
              Enterprise Productivity
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Designed for Teams Demanding Results
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Everything you need to move initiatives from strategic backlog to verified completion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessBenefits.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.title}
                  className="shadow-sm hover:shadow-xl transition-all duration-300 border-border bg-card hover:-translate-y-1"
                >
                  <CardContent className="p-6 space-y-4">
                    <div
                      className={`h-12 w-12 rounded-xl flex items-center justify-center border ${item.color}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Operational Workflow Section */}
      <section className="py-20 bg-background border-b border-border">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge variant="outline" className="uppercase tracking-wider text-xs">
              Simple 3-Step Workflow
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              How SmartTask Powers High Output
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {workflowSteps.map((step) => (
              <div
                key={step.step}
                className="p-8 rounded-2xl border border-border bg-card/60 relative space-y-4"
              >
                <span className="text-4xl font-black text-primary/20">{step.step}</span>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Full-Width CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-primary via-indigo-600 to-purple-600 text-primary-foreground">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Supercharge Your Daily Productivity?
          </h2>
          <p className="text-base sm:text-lg opacity-90 max-w-xl mx-auto">
            Join thousands of teams streamlining their workflows with SmartTask today.
          </p>
          <div className="pt-2">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="gap-2 px-8 text-base shadow-xl">
                Get Started Now <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Full-Screen Modern Footer */}
      <footer className="w-full border-t border-border bg-card text-card-foreground">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-border">
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-2 font-bold text-xl text-primary">
                <CheckSquare className="h-6 w-6" />
                <span>SmartTask</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The modern task directory built for ambitious teams and professionals.
              </p>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">Product</h5>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><Link href="/overview" className="hover:text-primary transition-colors">Overview</Link></li>
                <li><Link href="/tasks" className="hover:text-primary transition-colors">Task Directory</Link></li>
                <li><Link href="/tasks/new" className="hover:text-primary transition-colors">Create Task</Link></li>
                <li>
                  <a
                    href="https://expo.dev/accounts/rohitraj2k04/projects/smarttask-mobile/builds/e00cd746-f8fc-4481-8689-ecc19b9f4012"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-400 transition-colors text-emerald-500 font-semibold"
                  >
                    Download Mobile APK
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">Key Features</h5>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><span className="hover:text-primary transition-colors cursor-pointer">Priority Matrix</span></li>
                <li><span className="hover:text-primary transition-colors cursor-pointer">Deadline Reminders</span></li>
                <li><span className="hover:text-primary transition-colors cursor-pointer">Productivity Analytics</span></li>
                <li><span className="hover:text-primary transition-colors cursor-pointer">Category Tagging</span></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">Account</h5>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><Link href="/login" className="hover:text-primary transition-colors">Sign In</Link></li>
                <li><Link href="/signup" className="hover:text-primary transition-colors">Create Account</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} SmartTask Inc. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Security</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
