import { apiError } from "@/lib/api";
import { store } from "@/lib/store";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const pendingItems = store.solicitations.reduce((total, solicitation) => total + solicitation.items.filter((item) => item.requestedAmount > store.deliveries.filter((delivery) => delivery.solicitationId === solicitation.id).flatMap((delivery) => delivery.items).filter((deliveryItem) => deliveryItem.solicitationItemId === item.id).reduce((sum, deliveryItem) => sum + deliveryItem.deliveredAmount, 0)).length, 0);
    return NextResponse.json({ data: { cicoms: store.cicoms.filter((item) => item.status === "ACTIVE").length, solicitations: store.solicitations.length, pendingSolicitations: store.solicitations.filter((item) => item.status !== "DELIVERED").length, deliveries: store.deliveries.length, completed: store.deliveries.filter((item) => item.status === "DELIVERED").length, partial: store.deliveries.filter((item) => item.status === "PARTIALLY_DELIVERED").length, pendingItems, lowStock: store.materials.filter((item) => item.currentStock < item.minimumStock).length } });
  } catch (error) { return apiError(error); }
}
