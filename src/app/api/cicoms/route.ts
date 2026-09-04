import { apiError, pageParams } from "@/lib/api";
import { Cicom, id, paginate, store } from "@/lib/store";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const cicomSchema = z.object({
  name: z.string().trim().min(3).max(120),
  code: z.string().trim().min(2).max(30),
  region: z.string().trim().max(80).optional().nullable(),
  municipality: z.string().trim().max(80).optional().nullable(),
  address: z.string().trim().max(250).optional().nullable(),
  responsible: z.string().trim().max(120).optional().nullable(),
  phone: z.string().trim().max(30).optional().nullable(),
  email: z.string().trim().email().max(120).optional().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  notes: z.string().trim().max(1000).optional().nullable(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const { page, perPage, skip } = pageParams(searchParams);
    const query = searchParams.get("q")?.trim();
    const status = searchParams.get("status") as "ACTIVE" | "INACTIVE" | null;
    const filtered = store.cicoms.filter((cicom) => (!status || cicom.status === status) && (!query || [cicom.name, cicom.code, cicom.region].some((value) => value?.toLowerCase().includes(query.toLowerCase())))).sort((a, b) => a.name.localeCompare(b.name));
    return NextResponse.json(paginate(filtered.slice(skip), 1, perPage));
  } catch (error) { return apiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    const data = cicomSchema.parse(await request.json());
    if (store.cicoms.some((cicom) => cicom.code === data.code)) return NextResponse.json({ error: "Já existe um CICOM com este código." }, { status: 409 });
    const cicom: Cicom = { ...data, id: id(), createdAt: new Date().toISOString() };
    store.cicoms.push(cicom);
    return NextResponse.json({ data: cicom }, { status: 201 });
  } catch (error) { return apiError(error); }
}
