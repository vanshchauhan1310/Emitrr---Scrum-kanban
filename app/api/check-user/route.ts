// app/api/user/route.ts
import { checkUser } from "@/lib/checkuser";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await checkUser();
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}