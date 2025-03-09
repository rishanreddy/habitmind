"use server";

import { connectToMongoDB } from "./db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Habit from "./models/Habit";
import { toObjects } from "../utils";
import { revalidatePath } from "next/cache";

export async function createHabit(formData: FormData) {
  try {
    await connectToMongoDB();
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    // Extract form data
    const name = formData.get("name");
    const description = formData.get("description");
    const days = formData.get("days");
    const daysParsed = days ? JSON.parse(days as string) : null;
    const priority = formData.get("priority");
    const color = formData.get("color");

    // // Create a new habit
    const habit = await Habit.create({
      userId: session.user.id,
      name: name,
      description: description,
      daysOfWeek: daysParsed,
      priority: priority,
      color: color,
    });

    revalidatePath("/dashboard");

    return toObjects([habit]);
  } catch (error) {
    console.error(error);
  }
}

export async function getHabitByUser(userId: string) {
  try {
    await connectToMongoDB();
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    // Find habits by user ID
    const habits = await Habit.find({ userId: userId });

    return toObjects(habits);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get habits");
  }
}

export async function markHabitCompletion(habitId: string) {
  try {
    await connectToMongoDB();
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    // Find habit by ID
    const habit = await Habit.findById(habitId);

    // Toggle completion
    if (!habit) {
      throw new Error("Habit not found");
    }

    // @ts-ignore
    habit.markAsCompleted();

    revalidatePath("/dashboard");
    return toObjects([habit]);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to toggle habit completion");
  }
}

export async function unmarkHabitCompletion(habitId: string) {
  try {
    await connectToMongoDB();
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    // Find habit by ID
    const habit = await Habit.findById(habitId);

    // Toggle completion
    if (!habit) {
      throw new Error("Habit not found");
    }

    // @ts-ignore
    habit.markAsIncomplete();

    revalidatePath("/dashboard");
    return toObjects([habit]);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to toggle habit completion");
  }
}

export async function deleteHabit(habitId: string) {
  try {
    await connectToMongoDB();
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    // Find habit by ID
    const habit = await Habit.findOneAndDelete({ _id: habitId });

    if (!habit) {
      throw new Error("Habit not found");
    }

    revalidatePath("/");
    return toObjects([habit]);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete habit");
  }
}
