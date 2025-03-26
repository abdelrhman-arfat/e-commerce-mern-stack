import app from "@/app/utils/axios_setting";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await app.get(`/products/random-products`);
    const data = res.data;
    return NextResponse.json(data);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
