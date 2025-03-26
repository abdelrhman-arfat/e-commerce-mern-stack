import app from "@/app/utils/axios_setting";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const name = searchParams.get("name");

    const res = await app.get(`/products/by-category/${name}`);

    const data = await res.data;

    return NextResponse.json(data);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
