import { apiError, pageParams } from "@/lib/api";
import { Delivery, id, paginate, store } from "@/lib/store";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const deliverySchema = z.object({
  solicitationId: z.string().uuid(),
  attendantId: z.string().min(1),
  attendantName: z.string().trim().min(2).max(120),
  notes: z.string().trim().max(1000).optional(),
  deliveredAt: z.coerce.date().optional(),
  items: z.array(z.object({ solicitationItemId: z.string().uuid(), amount: z.coerce.number().positive() })).min(1),
});

export async function GET(request: NextRequest) {
  try {
    const { page, perPage } = pageParams(request.nextUrl.searchParams);
    return NextResponse.json(paginate([...store.deliveries].sort((a, b) => b.deliveredAt.localeCompare(a.deliveredAt)), page, perPage));
  } catch (error) { return apiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    const payload = deliverySchema.parse(await request.json());
    const solicitation = store.solicitations.find((item) => item.id === payload.solicitationId);
    if (!solicitation || solicitation.status === "CANCELLED") return NextResponse.json({ error: "Solicitação indisponível para entrega." }, { status: 409 });
    if (new Set(payload.items.map((item) => item.solicitationItemId)).size !== payload.items.length) return NextResponse.json({ error: "Um material foi informado mais de uma vez." }, { status: 422 });
    for (const item of payload.items) {
      const solicitationItem = solicitation.items.find((entry) => entry.id === item.solicitationItemId);
      if (!solicitationItem) return NextResponse.json({ error: "Item não pertence à solicitação." }, { status: 422 });
      const material = store.materials.find((entry) => entry.id === solicitationItem.materialId)!;
      const alreadyDelivered = store.deliveries.filter((delivery) => delivery.solicitationId === solicitation.id).flatMap((delivery) => delivery.items).filter((entry) => entry.solicitationItemId === item.solicitationItemId).reduce((total, entry) => total + entry.deliveredAmount, 0);
      if (item.amount > solicitationItem.requestedAmount - alreadyDelivered) return NextResponse.json({ error: `Quantidade de ${material.name} excede a pendência.` }, { status: 422 });
      if (item.amount > material.currentStock) return NextResponse.json({ error: `Estoque insuficiente para ${material.name}.` }, { status: 422 });
    }
    const complete = solicitation.items.every((item) => item.requestedAmount <= store.deliveries.filter((delivery) => delivery.solicitationId === solicitation.id).flatMap((delivery) => delivery.items).filter((entry) => entry.solicitationItemId === item.id).reduce((total, entry) => total + entry.deliveredAmount, 0) + (payload.items.find((entry) => entry.solicitationItemId === item.id)?.amount ?? 0));
    const delivery: Delivery = { id: id(), number: `RET-${new Date().getFullYear()}-${String(++store.sequence).padStart(4, "0")}`, solicitationId: solicitation.id, cicomId: solicitation.cicomId, attendantId: payload.attendantId, attendantName: payload.attendantName, notes: payload.notes, deliveredAt: (payload.deliveredAt ?? new Date()).toISOString(), status: complete ? "DELIVERED" : "PARTIALLY_DELIVERED", items: payload.items.map((item) => ({ solicitationItemId: item.solicitationItemId, materialId: solicitation.items.find((entry) => entry.id === item.solicitationItemId)!.materialId, deliveredAmount: item.amount })) };
    for (const item of delivery.items) store.materials.find((material) => material.id === item.materialId)!.currentStock -= item.deliveredAmount;
    solicitation.status = complete ? "DELIVERED" : "PARTIALLY_DELIVERED";
    store.deliveries.push(delivery);
    store.auditLogs.push({ action: "DELIVERY_REGISTERED", deliveryId: delivery.id, at: new Date().toISOString() });
    return NextResponse.json({ data: delivery }, { status: 201 });
  } catch (error) { return apiError(error); }
}
