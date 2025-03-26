import { NextResponse } from "next/server";

import app from "@/app/utils/axios_setting";
export async function GET() {
  try {
    const response = await app.get("/category");
    return NextResponse.json(response.data);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
