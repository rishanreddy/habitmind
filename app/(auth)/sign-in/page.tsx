"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);
    try {
      await signIn.email({
        email,
        password,
        callbackURL: "/dashboard",
        rememberMe, // Pass the rememberMe state
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
      toast.success("Signed in successfully!");
    } catch (error) {
      console.error("Sign in failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="card w-full max-w-md shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center">Sign In</h2>
        <p className="text-sm text-center text-gray-500">
          Enter your email below to login to your account.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSignIn}>
          {/* Email Input */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="input input-bordered w-full"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          {/* Password Input */}
          <div className="form-control w-full">
            <label className="label flex justify-between">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="input input-bordered w-full"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label htmlFor="rememberMe" className="text-sm cursor-pointer">
              Remember me
            </label>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Sign Up Redirect */}
        <p className="text-sm text-center mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
