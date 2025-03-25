import { NextResponse } from "next/server";

export async function GET() {
  try {
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
