import app from "@/app/utils/axios_setting";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 15;
    const res = await app.get(`/products?page=${+page}&limit=${+limit}`);
    const data = res.data;
    return NextResponse.json(data);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
