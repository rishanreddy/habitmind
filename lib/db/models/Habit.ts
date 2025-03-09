import mongoose, { Document, Model } from "mongoose";

// Define the TypeScript interface for a habit
export interface IHabit {
  userId: string;
  name: string;
  description?: string;
  daysOfWeek: string[]; // ["Monday", "Tuesday", "Saturday"]
  streak: number; // Consecutive days completed
  totalCompletions: number; // Total times completed
  lastCompleted?: Date; // Last date habit was completed
  completedToday: boolean; // If completed today
  priority: number; // Priority level (1-5)
  color: string; // Hex color for habit
  isActive: boolean; // If the habit is currently active
}

// Extend the interface with Mongoose's Document
export interface IHabitDocument extends IHabit, Document {
  createdAt: Date;
  updatedAt: Date;
}

// Create the Mongoose schema
const habitSchema = new mongoose.Schema<IHabitDocument>(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    daysOfWeek: {
      type: [String],
      required: true,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
    streak: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalCompletions: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastCompleted: {
      type: Date,
    },
    completedToday: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    color: {
      type: String,
      default: "#3b82f6",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically adds 'createdAt' and 'updatedAt'
  }
);

// Middleware: Reset `completedToday` at midnight
habitSchema.pre("save", function (next) {
  const now = new Date();
  if (this.lastCompleted) {
    const lastCompletedDate = new Date(this.lastCompleted);
    if (now.toDateString() !== lastCompletedDate.toDateString()) {
      this.completedToday = false;
    }
  }
  next();
});

// Function to mark habit as completed
habitSchema.methods.markAsCompleted = async function () {
  const now = new Date();
  if (!this.completedToday) {
    this.completedToday = true;
    this.lastCompleted = now;
    this.totalCompletions += 1;

    // Check if streak should be incremented
    if (this.lastCompleted) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (
        new Date(this.lastCompleted).toDateString() === yesterday.toDateString()
      ) {
        this.streak += 1;
      } else {
        this.streak = 1; // Reset streak if a day is skipped
      }
    } else {
      this.streak = 1;
    }
  }
  await this.save();
};

// Function to mark habit as incomplete
habitSchema.methods.markAsIncomplete = async function () {
  if (this.completedToday) {
    this.completedToday = false;
    this.totalCompletions -= 1;
    await this.save();
  }

  // Check if streak should be decremented
  if (this.streak > 0) {
    this.streak -= 1;
  }
  await this.save();
};

// Create the Mongoose model
const Habit: Model<IHabitDocument> =
  mongoose.models.Habit || mongoose.model<IHabitDocument>("Habit", habitSchema);

export default Habit;
