"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, X } from "lucide-react";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle Image Upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Sign Up
  const handleSignUp = async () => {
    if (password !== passwordConfirmation) {
      toast.error("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      await signUp.email({
        email,
        password,
        name: `${firstName} ${lastName}`,
        image: image ? await convertImageToBase64(image) : "",
        callbackURL: "/dashboard",
        fetchOptions: {
          onResponse: () => {
            setLoading(false);
          },
          onRequest: () => {
            setLoading(true);
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
          onSuccess: async () => {
            router.push("/dashboard");
          },
        },
      });
      toast.success("Sign up successful!");
    } catch (error) {
      toast.error("Sign up failed. Try again.");
      console.error("Sign up error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Convert image to Base64
  async function convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="card w-full max-w-md bg-base-100 shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center">Create an Account</h2>
        <p className="text-sm text-center text-gray-500">
          Join HabitMind.ai and start tracking your progress today!
        </p>

        <form className="mt-6 space-y-4">
          {/* Name Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">First Name</span>
              </label>
              <input
                type="text"
                placeholder="John"
                className="input input-bordered w-full"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Last Name</span>
              </label>
              <input
                type="text"
                placeholder="Doe"
                className="input input-bordered w-full"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="input input-bordered w-full"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Inputs */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Create a password"
              className="input input-bordered w-full"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Confirm Password</span>
            </label>
            <input
              type="password"
              placeholder="Confirm your password"
              className="input input-bordered w-full"
              required
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
          </div>

          {/* Profile Image Upload */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Profile Image (Optional)</span>
            </label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Profile preview"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <X
                  className="cursor-pointer"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                />
              )}
            </div>
          </div>

          {/* Sign Up Button */}
          <button
            type="button"
            className="btn btn-primary w-full"
            disabled={loading}
            onClick={handleSignUp}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {/* Redirect to Sign In */}
        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
