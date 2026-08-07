"use client";

import React, { useState, useRef, useEffect } from "react";
import { apiClient } from "../services/api.client";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
} from "lucide-react";
import { Button } from "./ui/button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  "What features does SmartTask offer?",
  "How do priorities and categories work?",
  "Where can I download the mobile app?",
  "How does OTP email verification work?",
];

function FormattedMessage({ text }: { text: string }) {
  const lines = text.split("\n");

  const parseInline = (content: string) => {
    const parts = content.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return (
          <em key={i} className="italic">
            {part.slice(1, -1)}
          </em>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={i}
            className="bg-muted px-1.5 py-0.5 rounded text-[11px] font-mono border border-border/50"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-1 text-[13px] leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-1.5 my-1">
              <span className="font-bold text-primary shrink-0">{numMatch[1]}.</span>
              <div className="flex-1">{parseInline(numMatch[2])}</div>
            </div>
          );
        }

        const bulletMatch = trimmed.match(/^[-*]\s+(.*)/);
        if (bulletMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 my-0.5 pl-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
              <div className="flex-1">{parseInline(bulletMatch[1])}</div>
            </div>
          );
        }

        return <p key={idx}>{parseInline(line)}</p>;
      })}
    </div>
  );
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content:
        "Hello! 👋 I'm your SmartTask AI Assistant. Ask me anything about SmartTask features, task organization, priorities, email reminders, or platform setup!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputValue("");
    setIsLoading(true);

    try {
      const historyPayload = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await apiClient.post("/chat", { messages: historyPayload });
      const replyText = res.data?.data?.reply || "I apologize, I couldn't process that response.";

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      const errorMessageText =
        err?.response?.data?.message || "Failed to connect to AI server. Please try again later.";

      const errorBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `⚠️ ${errorMessageText}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Simple Attractive Floating Icon Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative h-14 w-14 rounded-full bg-gradient-to-r from-primary via-indigo-600 to-purple-600 text-white shadow-2xl hover:shadow-primary/40 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center"
          aria-label="Open SmartTask AI Assistant"
        >
          <Sparkles className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12" />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-background"></span>
          </span>
        </button>
      )}

      {/* Chat Modal / Popover */}
      {isOpen && (
        <div className="w-[90vw] sm:w-[420px] h-[580px] max-h-[82vh] flex flex-col bg-background/95 backdrop-blur-xl border border-border/80 rounded-2xl shadow-2xl overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-primary/10 via-indigo-500/10 to-purple-500/10 border-b border-border/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-primary/15 text-primary">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">SmartTask Assistant</h3>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block"></span>
                  Platform Expert • Instant Replies
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 rounded-full p-0 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-sm scrollbar-thin">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`flex-shrink-0 p-1.5 rounded-full ${
                      isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20"
                    }`}
                  >
                    {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 space-y-1 shadow-sm leading-relaxed ${
                      isUser
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-card border border-border/70 text-foreground rounded-tl-none"
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap text-[13px]">{msg.content}</p>
                    ) : (
                      <FormattedMessage text={msg.content} />
                    )}

                    <span
                      className={`text-[10px] block text-right opacity-70 ${
                        isUser ? "text-primary-foreground/80" : "text-muted-foreground"
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Quick Prompts */}
            {messages.length <= 2 && (
              <div className="pt-2 space-y-2">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-primary" /> Suggested Questions:
                </p>
                <div className="flex flex-col gap-1.5">
                  {QUICK_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(prompt)}
                      className="text-left text-xs px-3 py-2 rounded-xl bg-card hover:bg-primary/10 border border-border/60 hover:border-primary/30 text-foreground transition-all duration-150 flex items-center justify-between group"
                    >
                      <span>{prompt}</span>
                      <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Typing Loader */}
            {isLoading && (
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="bg-card border border-border/70 text-foreground rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-xs text-muted-foreground font-medium">
                    AI Assistant is thinking...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Bar */}
          <div className="p-3 border-t border-border/60 bg-card/60">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about SmartTask features..."
                disabled={isLoading}
                className="flex-1 bg-background border border-input rounded-xl px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
              />
              <Button
                size="sm"
                disabled={!inputValue.trim() || isLoading}
                onClick={() => handleSendMessage()}
                className="h-8 w-8 rounded-xl shrink-0 p-0 flex items-center justify-center"
              >
                {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              </Button>
            </div>
            <p className="text-[10px] text-center text-muted-foreground mt-1.5">
              Strictly answers platform questions
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
