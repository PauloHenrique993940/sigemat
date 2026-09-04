import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function apiError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: "Dados inválidos.", details: error.flatten() }, { status: 422 });
  }
  console.error(error);
  return NextResponse.json({ error: "Não foi possível concluir a operação." }, { status: 500 });
}

export function pageParams(searchParams: URLSearchParams) {
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const perPage = Math.min(100, Math.max(1, Number(searchParams.get("perPage")) || 20));
  return { page, perPage, skip: (page - 1) * perPage };
}
