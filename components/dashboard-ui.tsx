"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { IHabitDocument } from "@/lib/db/models/Habit";
import {
  CheckCircle,
  Circle,
  XCircle,
  Calendar,
  PlusCircle,
  Trophy,
  Trash,
  Search,
} from "lucide-react";
import {
  deleteHabit,
  markHabitCompletion,
  unmarkHabitCompletion,
} from "@/lib/db/actions";
// @ts-ignore
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import HabitAnalysis from "./habit-analysis";

export default function Dashboard({ habits }: { habits: IHabitDocument[] }) {
  // Initialize state with provided habits
  const [habitData, setHabitData] = useState<IHabitDocument[]>(habits || []);

  // Get today's date and figure out the week
  const today = new Date();
  const currentDay = today.toLocaleDateString("en-US", { weekday: "short" });

  // Create array of days for the current week starting from Sunday
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Get the current week dates
  const currentWeekDates = useMemo(() => {
    const curr = new Date();
    const first = curr.getDate() - curr.getDay(); // First day of the week (Sunday)

    return weekDays.map((day, index) => {
      const date = new Date(curr.setDate(first + index));
      return {
        name: day,
        date: date,
        isToday: date.toDateString() === today.toDateString(),
        formattedDate: date.getDate(), // Just the day number
      };
    });
  }, []);

  // Map day names to full names
  const dayNameMap: Record<string, string> = {
    Sun: "Sunday",
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
  };

  // Toggle habit completion status
  const toggleHabit = async (habitId: string) => {
    if (
      habitData.find((habit) => habit._id?.toString() === habitId)
        ?.completedToday
    ) {
      await unmarkHabitCompletion(habitId);
    } else if (
      habitData.find((habit) => habit._id?.toString() === habitId)
        ?.completedToday === false
    ) {
      await markHabitCompletion(habitId);
    }

    window.location.reload();
  };

  // Calculate stats
  const totalCompletions = habitData.reduce(
    (sum, habit) => sum + (habit.totalCompletions || 0),
    0
  );

  const currentStreak = habitData.reduce(
    (max, habit) => Math.max(max, habit.streak || 0),
    0
  );

  const longestStreak = habitData.reduce(
    (max, habit) => Math.max(max, habit.streak || 0),
    0
  );

  function isHabitCompletedToday(habitId: string): boolean {
    const habit = habitData.find((habit) => habit._id?.toString() === habitId);
    return habit ? habit.completedToday : false;
  }

  const heatMapValues = habitData.reduce(
    (acc: { date: string; count: number }[], habit) => {
      if (habit.lastCompleted) {
        const date = habit.lastCompleted.toISOString().split("T")[0];
        const existingEntry = acc.find((entry) => entry.date === date);
        if (existingEntry) {
          existingEntry.count += habit.totalCompletions;
        } else {
          acc.push({ date, count: habit.totalCompletions });
        }
      }
      return acc;
    },
    []
  );

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>

          <div className="flex gap-2">
            <Link href="/explore" className="btn btn-outline">
              <Search className="w-5 h-5 mr-1" />
              Explore Habits
            </Link>
            <Link href="/habit/new" className="btn btn-primary">
              <PlusCircle className="w-5 h-5 mr-1" />
              Create a Habit
            </Link>
          </div>
        </div>
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-base-100 shadow-md">
            <div className="card-body p-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                Total Completions
              </h2>
              <p className="text-3xl font-bold">{totalCompletions}</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-md">
            <div className="card-body p-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Current Streak
              </h2>
              <p className="text-3xl font-bold">{currentStreak} days</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-md">
            <div className="card-body p-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Trophy className="h-5 w-5 text-warning" />
                Longest Streak
              </h2>
              <p className="text-3xl font-bold">{longestStreak} days</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Today's Quests */}
          <div className="card bg-base-100 shadow-md mb-8 flex-1">
            <div className="card-body p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                Today's Quests
                <span className="badge badge-primary ml-2">
                  {today.toLocaleDateString()}
                </span>
              </h2>

              {habitData.length > 0 ? (
                <div className="space-y-3">
                  {habitData
                    .filter(
                      (habit) =>
                        habit.isActive &&
                        Array.isArray(habit.daysOfWeek) &&
                        habit.daysOfWeek.includes(dayNameMap[currentDay]) // Ensure the habit is scheduled for today
                    )
                    .sort((a, b) => (a.priority || 5) - (b.priority || 5)) // Sort by priority
                    .map((habit) => (
                      <div
                        key={habit._id?.toString()}
                        className="flex items-center justify-between p-4 rounded-lg bg-base-200 hover:bg-base-300 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-lg"
                            style={{
                              backgroundColor: habit.color || "#3b82f6",
                              color: "#fff",
                            }}
                          >
                            {habit.name[0].toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-medium text-lg">
                              {habit.name}
                            </h3>
                            <div className="flex items-center gap-2">
                              <div
                                className="badge badge-sm"
                                style={{
                                  backgroundColor: habit.color,
                                  color: "#fff",
                                }}
                              >
                                Priority {habit.priority}
                              </div>
                              <p className="text-sm opacity-70">
                                Streak: {habit.streak || 0} days
                              </p>
                            </div>
                            {habit.description && (
                              <p className="text-xs opacity-60 mt-1">
                                {habit.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isHabitCompletedToday(
                            habit._id?.toString() || ""
                          ) ? (
                            <button
                              className="btn btn-sm btn-success btn-outline"
                              onClick={() =>
                                toggleHabit(habit._id?.toString() || "")
                              }
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Completed
                            </button>
                          ) : (
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() =>
                                toggleHabit(habit._id?.toString() || "")
                              }
                            >
                              Complete
                            </button>
                          )}
                          <button
                            className="btn btn-sm btn-error"
                            onClick={() => {
                              deleteHabit(habit._id?.toString() || "");
                              window.location.reload();
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-lg opacity-70">
                    No habits scheduled for today.
                  </p>
                  <Link href="/habit/new" className="btn btn-primary mt-4">
                    Add a Habit
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="card bg-base-100 shadow-md mb-8 flex-1">
            <div className="card-body p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                All your habits
              </h2>
              {habitData.length > 0 ? (
                <div className="space-y-3">
                  {habitData
                    .sort((a, b) => (a.priority || 5) - (b.priority || 5)) // Sort by priority
                    .map((habit) => (
                      <div
                        key={habit._id?.toString()}
                        className="flex items-center justify-between p-4 rounded-lg bg-base-200 hover:bg-base-300 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-lg"
                            style={{
                              backgroundColor: habit.color || "#3b82f6",
                              color: "#fff",
                            }}
                          >
                            {habit.name[0].toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-medium text-lg">
                              {habit.name}
                            </h3>
                            <div className="flex items-center gap-2">
                              <div
                                className="badge badge-sm"
                                style={{
                                  backgroundColor: habit.color,
                                  color: "#fff",
                                }}
                              >
                                Priority {habit.priority}
                              </div>
                              <p className="text-sm opacity-70">
                                Streak: {habit.streak || 0} days
                              </p>
                            </div>
                            {habit.description && (
                              <p className="text-xs opacity-60 mt-1">
                                {habit.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isHabitCompletedToday(
                            habit._id?.toString() || ""
                          ) ? (
                            <button
                              className="btn btn-sm btn-success btn-outline"
                              onClick={() =>
                                toggleHabit(habit._id?.toString() || "")
                              }
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Completed
                            </button>
                          ) : (
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() =>
                                toggleHabit(habit._id?.toString() || "")
                              }
                            >
                              Complete
                            </button>
                          )}
                          <button
                            className="btn btn-sm btn-error"
                            onClick={() => {
                              deleteHabit(habit._id?.toString() || "");
                              window.location.reload();
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-lg opacity-70">No habits found.</p>
                  <Link href="/habit/new" className="btn btn-primary mt-4">
                    Add a Habit
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Weekly Calendar Section */}
        <div className="card bg-base-100 shadow-md mb-8">
          <div className="card-body p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Weekly Habit Tracker
            </h2>

            <div className="grid grid-cols-7 gap-2 md:gap-4">
              {currentWeekDates.map((day) => {
                // Convert "Mon" → "Monday"
                const fullDayName = dayNameMap[day.name];

                // Filter habits that match the full weekday name
                const habitsForDay = habitData.filter(
                  (habit) =>
                    habit.isActive &&
                    Array.isArray(habit.daysOfWeek) &&
                    habit.daysOfWeek.includes(fullDayName)
                );

                return (
                  <div
                    key={day.name}
                    className={`card ${
                      day.isToday
                        ? "bg-primary/10 border border-primary"
                        : "bg-base-200"
                    } p-2 md:p-4 shadow-sm`}
                  >
                    <h3 className="text-center font-medium">
                      {day.name}
                      <span className="block text-sm opacity-70">
                        {day.formattedDate}
                      </span>
                    </h3>
                    <div className="divider my-1"></div>

                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {habitsForDay.length > 0 ? (
                        habitsForDay.map((habit) => (
                          <div
                            key={`${day.name}-${habit._id}`}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-base-300 transition-colors"
                          >
                            {/* Show checkmark for completed habits today */}
                            {day.isToday &&
                            isHabitCompletedToday(
                              habit._id?.toString() || ""
                            ) ? (
                              <CheckCircle className="h-4 w-4 text-success" />
                            ) : (
                              <Circle
                                className={`h-4 w-4 ${
                                  day.isToday
                                    ? "text-base-content/50"
                                    : "text-base-content/20"
                                }`}
                                style={{
                                  color: day.isToday ? habit.color : undefined,
                                  opacity: day.isToday ? 1 : 0.5,
                                }}
                              />
                            )}

                            {/* Display habit name with color */}
                            <span
                              className="text-xs truncate"
                              style={{
                                color: day.isToday ? habit.color : undefined,
                                fontWeight: day.isToday ? "medium" : "normal",
                                opacity: day.isToday ? 1 : 0.6,
                              }}
                            >
                              {habit.name}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-center opacity-50 py-1">
                          No habits
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <HabitAnalysis habits={habitData} />

        <div>
          {/* Heatmap Section */}
          <div className="card bg-base-100 p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Habit Tracking map</h2>
            <CalendarHeatmap
              startDate={
                new Date(new Date().setFullYear(new Date().getFullYear() - 1))
              }
              endDate={new Date()}
              values={heatMapValues}
              classForValue={(value: any) => {
                if (!value) {
                  return "color-empty";
                }
                return `color-scale-${value.count}`;
              }}
              showMonthLabels
              gutterSize={2}
            />
          </div>
        </div>

        {/* Heatmap Custom Styles */}
        <style jsx global>{`
          .react-calendar-heatmap .color-empty {
            fill: #ebedf0;
          }
          .react-calendar-heatmap .color-scale-1 {
            fill: #d6e685;
          }
          .react-calendar-heatmap .color-scale-2 {
            fill: #8cc665;
          }
          .react-calendar-heatmap .color-scale-3 {
            fill: #44a340;
          }
          .react-calendar-heatmap .color-scale-4 {
            fill: #1e6823;
          }
        `}</style>
      </div>
    </div>
  );
}
