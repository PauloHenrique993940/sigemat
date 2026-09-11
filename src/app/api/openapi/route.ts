import openapi from "../../../../docs/openapi.json";
import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(openapi);
}
