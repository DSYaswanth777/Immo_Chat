"use client";

import { useSession } from "next-auth/react";

export function SessionStatus() {
  const { data: session, status } = useSession();

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="">
      {/* <div>Status: {status}</div>
      <div>User: {session?.user?.email || "None"}</div>
      <div>Role: {(session?.user as any)?.role || "None"}</div> */}
    </div>
  );
}
