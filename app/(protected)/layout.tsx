import { auth } from "@/lib/auth"; // path to your Better Auth server instance
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    redirect("/sign-in");
  }

  return <div className="min-h-screen">{children}</div>;
}
