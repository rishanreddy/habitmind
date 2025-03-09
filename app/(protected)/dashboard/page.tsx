import React from "react";

import { getHabitByUser } from "@/lib/db/actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Dashboard from "@/components/dashboard-ui";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user.id) {
    throw new Error("Unauthorized");
  }
  const habits: any = await getHabitByUser(session.user.id);

  return <Dashboard habits={habits} />;
}
