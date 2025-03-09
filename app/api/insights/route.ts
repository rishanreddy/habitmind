import { NextRequest, NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import z from "zod";
import { RunnableSequence } from "@langchain/core/runnables";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getHabitByUser } from "@/lib/db/actions";

// Define AI response structure using Zod
const habitInsightSchema = z.object({
  recommendations: z.string(), // AI-generated habit suggestions
  successRate: z.number().min(0).max(100), // Habit success rate %
  improvementPercentage: z.number(), // Change from last week
});

// Extract type from the schema
export type HabitInsightResponse = z.infer<typeof habitInsightSchema>;

// Langchain Output Parser
const habitOutputParser =
  StructuredOutputParser.fromZodSchema(habitInsightSchema);

// Function to predict AI habit insights
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get habits for the user
    const habits = await getHabitByUser(session.user.id);

    if (!habits || !Array.isArray(habits) || habits.length === 0) {
      return NextResponse.json(
        { error: "No active habits found" },
        { status: 400 }
      );
    }

    // Calculate success rate
    const totalAttempts = habits.length;

    const totalCompleted = habits.filter(
      (habit) => habit.completedToday
    ).length;

    const successRate =
      totalAttempts > 0
        ? Math.round((totalCompleted / totalAttempts) * 100)
        : 0;

    // Setup Gemini AI Model
    const model = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-flash",
      temperature: 0.7, // Adjust for randomness
      maxOutputTokens: 500, // Maximum tokens to generate
      maxRetries: 3, // Maximum retries on failure
    });

    // Define AI prompt using Langchain's PromptTemplate
    const prompt = new PromptTemplate({
      template: `
        You are an AI trained to analyze habit-tracking data and provide actionable habit improvement recommendations.
        Given the user's habits and their success rate, suggest ONE way to optimize their habit-building strategy.

        User Habit Data:
        {habitData}

        Their current success rate is {successRate}%.

        Return the response in this structured JSON format:
        {formatInstructions}
      `,
      inputVariables: ["habitData", "successRate"],
      partialVariables: {
        formatInstructions: habitOutputParser.getFormatInstructions(),
      },
    });

    // Create a runnable chain
    const chain = RunnableSequence.from([prompt, model, habitOutputParser]);

    // Invoke AI model
    const aiResponse = await chain.invoke({
      habitData: JSON.stringify(habits),
      successRate,
    });

    // Revalidate cache
    revalidatePath("/dashboard");

    // Return AI-generated habit insights
    return NextResponse.json(aiResponse, { status: 200 });
  } catch (error) {
    console.error("Error fetching AI habit insights:", error);
    return NextResponse.json(
      { error: "Failed to fetch AI habit insights" },
      { status: 500 }
    );
  }
}
