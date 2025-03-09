"use client";

import { useSession } from "@/lib/auth-client";
import { signOut } from "@/lib/auth-client";
import { CalendarDays, Mail, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  if (isPending) {
    return (
      <div className="container mx-auto py-10">
        <div className="card max-w-3xl mx-auto bg-base-100 shadow-xl">
          <div className="card-body items-center text-center space-y-6 pb-8">
            <h2 className="card-title text-3xl font-bold">Profile</h2>
            <div className="w-32 h-32 rounded-full bg-base-300 animate-pulse"></div>
            <div className="space-y-4 w-full">
              <div className="h-6 bg-base-300 rounded animate-pulse w-3/4 mx-auto"></div>
              <div className="h-6 bg-base-300 rounded animate-pulse w-2/3 mx-auto"></div>
              <div className="space-y-4 mt-8 w-full">
                <div className="h-6 bg-base-300 rounded animate-pulse w-full"></div>
                <div className="h-6 bg-base-300 rounded animate-pulse w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto py-10">
        <div className="card max-w-3xl mx-auto bg-base-100 shadow-xl">
          <div className="card-body py-10">
            <p className="text-center text-base-content/70 text-lg">
              Please sign in to view your profile.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { user } = session;
  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="container mx-auto py-10">
      <div className="card max-w-3xl mx-auto bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-3xl font-bold">Profile</h2>

          <div className="avatar my-6">
            <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User"}
                  width={128}
                  height={128}
                />
              ) : (
                <div className="bg-primary text-primary-content flex items-center justify-center text-3xl font-bold">
                  {initials || "?"}
                </div>
              )}
            </div>
          </div>

          <div className="divider"></div>

          <div className="w-full max-w-xl space-y-6">
            <div className="flex items-center gap-4 text-lg">
              <div className="bg-base-200 p-3 rounded-full">
                <User className="h-6 w-6" />
              </div>
              <span className="font-medium">{user.name}</span>
            </div>

            <div className="flex items-center gap-4 text-lg">
              <div className="bg-base-200 p-3 rounded-full">
                <Mail className="h-6 w-6" />
              </div>
              <span className="text-base-content/70">{user.email}</span>
            </div>

            <div className="flex items-start gap-4 text-lg">
              <div className="bg-base-200 p-3 rounded-full mt-1">
                <CalendarDays className="h-6 w-6" />
              </div>
              <div className="text-base-content/70">
                <p>
                  Member since: {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          <button
            className="btn btn-neutral"
            onClick={() =>
              signOut({
                fetchOptions: {
                  onSuccess: () => {
                    router.push("/sign-in");
                  },
                },
              })
            }
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
