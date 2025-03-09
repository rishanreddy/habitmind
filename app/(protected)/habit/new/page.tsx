"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  PlusCircle,
  Calendar,
  Flag,
  Palette,
  Check,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Confetti from "react-confetti-boom";
import { createHabit } from "@/lib/db/actions";
import { useQueryState } from "nuqs";

export default function CreateHabit() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useQueryState("name");
  const [description, setDescription] = useQueryState("description");
  const [formData, setFormData] = useState({
    days: [] as string[], // Selected days of the week
    priority: 3,
    color: "#3b82f6",
    streak: 0, // Streak count
    completedToday: false, // Whether the habit is marked as completed today
  });

  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  // Quick Select Functions
  const selectAllDays = () =>
    setFormData((prev) => ({ ...prev, days: [...weekdays] }));
  const selectWeekdays = () =>
    setFormData((prev) => ({
      ...prev,
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    }));
  const selectWeekends = () =>
    setFormData((prev) => ({ ...prev, days: ["Saturday", "Sunday"] }));

  // Form submission function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!(name ?? "").trim()) {
      toast.error("Please enter a habit name");
      return;
    }

    if (formData.days.length === 0) {
      toast.error("Please select at least one day of the week");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      data.append("name", name ?? "");
      data.append("description", description ?? "");
      data.append("days", JSON.stringify(formData.days));
      data.append("priority", formData.priority.toString());
      data.append("color", formData.color);

      // Create the habit
      const habit = createHabit(data);
      if (!habit) {
        throw new Error("Failed to create habit");
      } else {
        // Success!
        toast.success("Habit created successfully!");
      }

      // Redirect to dashboard after successful creation
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error creating habit:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
    // Reset form after successful creation
    setName(null);
    setDescription(null);
    setFormData({
      days: [],
      priority: 3,
      color: "#3b82f6",
      streak: 0,
      completedToday: false,
    });
  };

  const toggleCompletion = () => {
    setFormData((prev) => ({
      ...prev,
      completedToday: !prev.completedToday,
    }));
  };

  const presetColors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#f97316",
  ];

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      {/* Page Header */}
      <div className="flex items-center mb-8">
        <Link href="/dashboard" className="btn btn-ghost btn-sm">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </Link>
        <h1 className="text-3xl font-bold ml-4">Create a New Habit</h1>
      </div>

      {/* Habit Preview */}
      <div className="card bg-base-100 shadow-xl mb-6 relative">
        <div className="card-body">
          <h2 className="card-title flex items-center justify-between">
            Habit Preview
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={formData.completedToday}
                onChange={toggleCompletion}
              />
              <span className="ml-2 text-sm font-medium">
                Mark as Completed
              </span>
              {/* Confetti Explosion 🎉 */}
              {formData.completedToday && (
                <div className="z-100">
                  <Confetti
                    mode="boom"
                    particleCount={500}
                    x={0.4}
                    y={0.1}
                    launchSpeed={1}
                    effectCount={1}
                  />
                </div>
              )}
            </label>
          </h2>

          <div
            className="p-6 rounded-box flex items-center justify-between"
            style={{ backgroundColor: `${formData.color}20` }}
          >
            {/* Left Side: Icon and Habit Details */}
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                style={{ backgroundColor: formData.color, color: "#fff" }}
              ></div>
              <div>
                <h3 className="text-xl font-bold">{name || "New Habit"}</h3>
                <p className="text-sm opacity-70">
                  {formData.days.length === 7
                    ? "Daily"
                    : formData.days.length === 0
                    ? "No days selected"
                    : `${formData.days.length} days a week`}
                </p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {formData.completedToday && (
            <div className="mt-4 alert alert-success flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>Great job! Habit completed today 🎉</span>
            </div>
          )}
        </div>
      </div>
      {/* Habit Form */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Habit Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Habit Name</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Drink Water, Read Books, Meditate..."
                className="input input-bordered w-full"
                value={name || ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Description</span>
              </label>
              <textarea
                name="description"
                placeholder="Add a brief description of the habit..."
                className="textarea textarea-bordered w-full"
                value={description ?? ""}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* Days of the Week */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Select Days</span>
              </label>

              {/* Quick Select Buttons */}
              <div className="flex flex-wrap gap-2 mb-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={selectAllDays}
                >
                  Every Day
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={selectWeekdays}
                >
                  Weekdays
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={selectWeekends}
                >
                  Weekends
                </button>
              </div>

              {/* Individual Days */}
              <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                {weekdays.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`btn ${
                      formData.days.includes(day)
                        ? "btn-primary"
                        : "btn-outline"
                    }`}
                  >
                    {day.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority Level */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Priority Level</span>
              </label>
              <div className="rating rating-lg">
                {[1, 2, 3, 4, 5].map((value) => (
                  <input
                    key={value}
                    type="radio"
                    name="priority"
                    className="mask mask-star-2 bg-orange-400"
                    value={value}
                    checked={formData.priority === value}
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, priority: value }))
                    }
                  />
                ))}
              </div>
            </div>

            {/* Color Picker */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Habit Color</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {presetColors.map((color) => (
                  <div
                    key={color}
                    className={`w-10 h-10 rounded-full cursor-pointer transition-all hover:scale-110 ${
                      formData.color === color
                        ? "ring-2 ring-offset-2 ring-primary"
                        : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData((prev) => ({ ...prev, color }))}
                  ></div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Habit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
