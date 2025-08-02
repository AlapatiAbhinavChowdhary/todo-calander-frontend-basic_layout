import { generateObject } from "ai"
import { createGeminiProvider } from "ai-sdk-provider-gemini-cli"
import { z } from "zod"

export const runtime = "edge" // Use edge runtime for faster responses

export async function POST(req) {
  const { prompt } = await req.json()

  try {
    const gemini = createGeminiProvider({
      authType: "api-key",
      apiKey: process.env.GEMINI_API_KEY,
    })

    const { object } = await generateObject({
      model: gemini("gemini-2.5-pro"),
      schema: z.object({
        action: z
          .enum(["add_task", "show_tasks", "delete_task", "complete_task", "unknown"])
          .describe("The action to perform based on the user's request."),
        task: z
          .string()
          .optional()
          .describe("The description of the task, if the action is add_task, delete_task, or complete_task."),
        date: z
          .string()
          .optional()
          .describe('The specific date for the task (e.g., "tomorrow", "August 5th", "next Monday").'),
        query: z.string().optional().describe("A general query for showing tasks, if the action is show_tasks."),
      }),
      prompt: `Analyze the following user command and extract the action, task description, and date.
      If the command is about adding a task, set 'action' to 'add_task', extract the 'task' description, and the 'date'.
      If the command is about showing tasks, set 'action' to 'show_tasks', and extract the 'date' or a general 'query'.
      If the command is about deleting a task, set 'action' to 'delete_task' and extract the 'task' description.
      If the command is about completing a task, set 'action' to 'complete_task' and extract the 'task' description.
      If the command does not fit any of these, set 'action' to 'unknown'.

      Examples:
      - "Add 'buy groceries' to tomorrow": { action: "add_task", task: "buy groceries", date: "tomorrow" }
      - "What are my tasks for next Tuesday?": { action: "show_tasks", date: "next Tuesday" }
      - "Show me this week's schedule": { action: "show_tasks", query: "this week" }
      - "Delete 'call mom'": { action: "delete_task", task: "call mom" }
      - "Mark 'finish report' as done": { action: "complete_task", task: "finish report" }
      - "Hello": { action: "unknown" }

      User command: "${prompt}"`,
    })

    return Response.json(object)
  } catch (error) {
    console.error("Error processing AI command:", error)
    return new Response(JSON.stringify({ error: "Failed to process command" }), { status: 500 })
  }
}
