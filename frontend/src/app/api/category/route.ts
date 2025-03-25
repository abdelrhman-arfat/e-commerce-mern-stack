import { NextResponse } from "next/server";
import axios from "axios";
export async function GET() {
  try {
    const response = await axios.get("http://localhost:3001/api/category");
    return NextResponse.json(response.data);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
