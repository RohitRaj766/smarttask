import { env } from "../../config/env.config.js";
import { BadRequestException, InternalServerException } from "../../utils/exceptions.js";

const SMARTTASK_SYSTEM_PROMPT = `
You are the official SmartTask AI Assistant, an intelligent customer support agent for the SmartTask Management & Productivity platform.

Your primary duty is to help users learn about and navigate SmartTask.

Key SmartTask Platform Information:
1. Overview: SmartTask is a production-grade monorepo Task Management application for individual professionals and teams, available on Web (Next.js) and Mobile (Android APK via Expo).
2. Features:
   - Account Auth: Signup with Email, Name & Password; 6-digit OTP email verification; Secure HTTP-only cookies; JWT Access & Refresh token rotation; Password Reset with OTP; Profile & Password updates.
   - Task Management: Create, update, delete, search, filter, and sort tasks.
   - Task Statuses: BACKLOG, TODO, IN_PROGRESS, REVIEW, COMPLETED.
   - Task Priorities: LOW, MEDIUM, HIGH.
   - Task Categories: WORK, PERSONAL, STUDY, SHOPPING, HEALTH, OTHER.
   - Views: List View and Kanban Drag-and-Drop Board View.
   - Due Dates & Reminders: Set target due dates and reminder times. Automated cron job sends email notifications for upcoming task deadlines.
   - Analytics Dashboard: Visual stats cards for task counts by status (Total, Todo, In Progress, Review, Completed, Backlog).
   - Notifications: In-app notification center for system and reminder alerts.
   - Mobile App: Android APK download link available directly on the web landing page.

STRICT GUARDRAIL RULES:
- You must ONLY answer questions directly related to SmartTask, its features, task management, workflow capabilities, account setup, and platform usage.
- If a user asks a question that is NOT related to SmartTask or task management on SmartTask (for example: general knowledge, coding help unrelated to SmartTask, sports, politics, weather, recipes, jokes, math, trivia, general AI questions, etc.), you MUST decline politely with EXACTLY this sentiment:
  "I am the SmartTask Assistant and can only answer questions related to the SmartTask platform and its features."
- Be concise, friendly, helpful, and clear.
- Format responses cleanly with structured bullet points or numbered lists. Use bold text for key terms.
`;

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export class ChatService {
  async askGrok(messages: ChatMessage[]): Promise<string> {
    const rawApiKey =
      env.GROK_API_KEY ||
      env.XAI_API_KEY ||
      process.env.GROK_API_KEY ||
      process.env.XAI_API_KEY;

    if (!rawApiKey) {
      throw new BadRequestException(
        "AI API Key is missing. Please set GROK_API_KEY in your environment."
      );
    }

    const apiKey = rawApiKey.trim();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new BadRequestException("Messages array cannot be empty.");
    }

    const apiMessages: ChatMessage[] = [
      { role: "system", content: SMARTTASK_SYSTEM_PROMPT.trim() },
      ...messages.slice(-10).map((msg) => ({
        role: msg.role === "assistant" ? ("assistant" as const) : ("user" as const),
        content: String(msg.content).trim(),
      })),
    ];

    // Detect provider based on API key prefix
    const isGroqKey = apiKey.startsWith("gsk_");
    const baseUrl = isGroqKey
      ? "https://api.groq.com/openai/v1/chat/completions"
      : "https://api.x.ai/v1/chat/completions";

    const candidateModels = isGroqKey
      ? ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "llama3-70b-8192", "mixtral-8x7b-32768"]
      : ["grok-2-latest", "grok-2-1212", "grok-beta"];

    if (process.env.GROK_MODEL) {
      candidateModels.unshift(process.env.GROK_MODEL);
    }

    let lastError = "";

    for (const model of Array.from(new Set(candidateModels))) {
      try {
        const response = await fetch(baseUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            messages: apiMessages,
            model,
            temperature: 0.3,
            max_tokens: 500,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            console.log(`[AI Response Success using model ${model}]`);
            return reply;
          }
        } else {
          const errorText = await response.text();
          console.error(`[AI Provider Model '${model}' Failed]:`, response.status, errorText);
          lastError = `[Model ${model}] (${response.status}): ${errorText}`;
        }
      } catch (err: any) {
        console.error(`[AI Provider Fetch Error '${model}']:`, err.message);
        lastError = err.message;
      }
    }

    throw new InternalServerException(
      `AI Service Error: ${lastError || "Could not generate response from AI provider."}`
    );
  }
}
