"use client";

import React, { useState } from "react";
import { PlusCircle, Check, Search, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ExplorePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [addedHabits, setAddedHabits] = useState<string[]>([]);
  const router = useRouter();

  // List of example habits with icons, descriptions and categories
  const habitExamples = [
    {
      name: "Morning Exercise",
      icon: "🏃‍♂️",
      description: "Start your day with energy and vitality",
      category: "health",
      color: "#10b981", // Green
    },
    {
      name: "Meditation",
      icon: "🧘‍♀️",
      description: "Take 10 minutes to clear your mind",
      category: "mental",
      color: "#8b5cf6", // Purple
    },
    {
      name: "Read 20 Pages",
      icon: "📚",
      description: "Expand your knowledge daily",
      category: "learning",
      color: "#3b82f6", // Blue
    },
    {
      name: "Drink Water",
      icon: "💧",
      description: "Stay hydrated with 8 glasses per day",
      category: "health",
      color: "#0ea5e9", // Light blue
    },
    {
      name: "Journal",
      icon: "✏️",
      description: "Record your thoughts and experiences",
      category: "mental",
      color: "#f59e0b", // Yellow
    },
    {
      name: "Stretch",
      icon: "🤸‍♀️",
      description: "Improve flexibility and prevent injuries",
      category: "health",
      color: "#ef4444", // Red
    },
    {
      name: "Learn Language",
      icon: "🗣️",
      description: "Practice your target language daily",
      category: "learning",
      color: "#ec4899", // Pink
    },
    {
      name: "Gratitude",
      icon: "🙏",
      description: "Write down three things you're grateful for",
      category: "mental",
      color: "#f97316", // Orange
    },
    {
      name: "Take Vitamins",
      icon: "💊",
      description: "Remember your daily supplements",
      category: "health",
      color: "#14b8a6", // Teal
    },
    {
      name: "No Social Media",
      icon: "📵",
      description: "Limit your social media consumption",
      category: "productivity",
      color: "#6366f1", // Indigo
    },
    {
      name: "Floss",
      icon: "🦷",
      description: "Maintain good dental hygiene",
      category: "health",
      color: "#0891b2", // Cyan
    },
    {
      name: "Practice Instrument",
      icon: "🎸",
      description: "Dedicate time to improve your musical skills",
      category: "hobby",
      color: "#a855f7", // Purple
    },
  ];

  // Filter habits based on search query
  const filteredHabits = habitExamples.filter(
    (habit) =>
      habit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      habit.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      habit.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group habits by category
  const categories = [...new Set(habitExamples.map((habit) => habit.category))];

  // Handle adding a habit
  const addHabit = (habit: (typeof habitExamples)[0]) => {
    router.push(
      `/habit/new?name=${habit.name}&description=${habit.description}`
    );
  };

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center">
            <Link href="/dashboard" className="btn btn-circle btn-ghost mr-4">
              <ArrowLeft />
            </Link>
            <h1 className="text-3xl font-bold">Explore Habits</h1>
          </div>

          <div className="w-full md:w-auto">
            <div className="flex items-center w-full">
              <input
                type="text"
                placeholder="Search habits..."
                className="input input-bordered w-full pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Selected habits summary */}
        {addedHabits.length > 0 && (
          <div className="alert bg-primary text-primary-content mb-8">
            <div>
              <Check className="h-6 w-6" />
              <span>You've selected {addedHabits.length} habits</span>
            </div>
            <div className="flex-none">
              <Link href="/dashboard" className="btn btn-sm">
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* Content by category */}
        {searchQuery ? (
          // Search results view
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Search Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredHabits.map((habit, index) => (
                <div
                  key={index}
                  className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="card-body p-5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                        style={{ backgroundColor: habit.color, color: "#fff" }}
                      >
                        {habit.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="card-title text-lg">{habit.name}</h3>
                        <div className="badge badge-sm">{habit.category}</div>
                      </div>
                    </div>
                    <p className="text-sm mt-2 opacity-70">
                      {habit.description}
                    </p>
                    <div className="card-actions justify-end mt-3">
                      <button
                        className={`btn btn-sm ${
                          addedHabits.includes(habit.name)
                            ? "btn-success btn-outline"
                            : "btn-primary"
                        }`}
                        onClick={() => addHabit(habit)}
                      >
                        {addedHabits.includes(habit.name) ? (
                          <>
                            <Check className="h-4 w-4 mr-1" />
                            Added
                          </>
                        ) : (
                          <>
                            <PlusCircle className="h-4 w-4 mr-1" />
                            Add
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filteredHabits.length === 0 && (
              <div className="text-center py-10">
                <p className="text-lg opacity-70">
                  No habits found for "{searchQuery}"
                </p>
              </div>
            )}
          </div>
        ) : (
          // Category view (when not searching)
          categories.map((category) => (
            <div key={category} className="mb-8">
              <h2 className="text-xl font-bold capitalize mb-4">{category}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {habitExamples
                  .filter((habit) => habit.category === category)
                  .map((habit, index) => (
                    <div
                      key={index}
                      className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="card-body p-5">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                            style={{
                              backgroundColor: habit.color,
                              color: "#fff",
                            }}
                          >
                            {habit.icon}
                          </div>
                          <h3 className="card-title text-lg flex-1">
                            {habit.name}
                          </h3>
                        </div>
                        <p className="text-sm mt-2 opacity-70">
                          {habit.description}
                        </p>
                        <div className="card-actions justify-end mt-3">
                          <button
                            className={`btn btn-sm ${
                              addedHabits.includes(habit.name)
                                ? "btn-success btn-outline"
                                : "btn-primary"
                            }`}
                            onClick={() => addHabit(habit)}
                          >
                            {addedHabits.includes(habit.name) ? (
                              <>
                                <Check className="h-4 w-4 mr-1" />
                                Added
                              </>
                            ) : (
                              <>
                                <PlusCircle className="h-4 w-4 mr-1" />
                                Add
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))
        )}

        {/* Create custom habit card */}
        <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow mt-8 border border-dashed border-primary">
          <div className="card-body items-center text-center">
            <h3 className="card-title">Can't find what you need?</h3>
            <p>Create your own custom habit tailored to your personal goals.</p>
            <div className="card-actions mt-4">
              <Link href="/habit/new" className="btn btn-primary">
                Create Custom Habit
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
