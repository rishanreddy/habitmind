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
// Define AI response structure using Zod
const decayResponseSchema = z.object({
  decayRisk: z.array(
    z.object({
      habitName: z.string(),
      riskPercentage: z.number().min(0).max(100),
      riskLevel: z.enum(["Low", "Medium", "High"]),
      recommendation: z.string(),
    })
  ),
});

// Extract type from the schema
export type DecayResponse = z.infer<typeof decayResponseSchema>;

// Langchain Output Parser
const decayOutputParser =
  StructuredOutputParser.fromZodSchema(decayResponseSchema);

// Function to predict habit decay risk
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get habits from request body
    const habits = await getHabitByUser(session.user.id);

    if (!habits || !Array.isArray(habits)) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    // Setup Gemini AI Model
    const model = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-flash",
      temperature: 0.7, // Adjust for randomness
      maxOutputTokens: Math.max(500, habits.length * 150), // Scale token limit based on habit count
      maxRetries: 3, // Maximum retries on failure
    });

    // Define AI prompt using Langchain's PromptTemplate
    const prompt = new PromptTemplate({
      template: `
        You are an AI trained to predict habit decay risk based on user habit data. 
        Given the following habits, analyze their tracking behavior and predict their likelihood of being abandoned. 
        Provide a risk percentage (0-100%) along with a risk level (Low, Medium, High) and a brief recommendation.

        User Habit Data:
        {habitData}

        Return the response in this structured JSON format:
        {formatInstructions}
      `,
      inputVariables: ["habitData"],
      partialVariables: {
        formatInstructions: decayOutputParser.getFormatInstructions(),
      },
    });

    // Create a runnable chain
    const chain = RunnableSequence.from([prompt, model, decayOutputParser]);

    // Invoke AI model
    const aiResponse = await chain.invoke({
      habitData: JSON.stringify(habits),
    });

    // Revalidate cache
    revalidatePath("/dashboard");

    // Return AI-predicted decay risk data
    return NextResponse.json(aiResponse, { status: 200 });
  } catch (error) {
    console.error("Error fetching decay predictions:", error);
    return NextResponse.json(
      { error: "Failed to fetch decay predictions" },
      { status: 500 }
    );
  }
}
